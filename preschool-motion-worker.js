/* Runs the heavy U2NetP foreground segmentation away from the page's main thread. */
const MODEL = '/assets/preschool-motion/u2netp.onnx';
const RUNTIME = '/assets/preschool-motion/ort.wasm.min.mjs';
let sessionPromise;

async function session() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const ort = await import(RUNTIME);
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.wasmPaths = '/assets/preschool-motion/';
      const response = await fetch(MODEL);
      if (!response.ok) throw new Error('Δεν μπόρεσε να φορτωθεί η κίνηση. Δοκίμασε ξανά αργότερα.');
      const bytes = await response.arrayBuffer();
      const model = await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'] });
      return { ort, model };
    })().catch(error => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
}

self.onmessage = async event => {
  const { id, pixelsBuffer } = event.data || {};
  if (!id || !pixelsBuffer) return;
  try {
    const pixels = new Uint8ClampedArray(pixelsBuffer);
    const plane = 320 * 320;
    const input = new Float32Array(3 * plane);
    const mean = [.485, .456, .406];
    const std = [.229, .224, .225];

    for (let i = 0; i < plane; i++) {
      const p = 4 * i;
      input[i] = (pixels[p] / 255 - mean[0]) / std[0];
      input[plane + i] = (pixels[p + 1] / 255 - mean[1]) / std[1];
      input[2 * plane + i] = (pixels[p + 2] / 255 - mean[2]) / std[2];
    }

    const { ort, model } = await session();
    const result = await model.run({
      [model.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, 320, 320])
    });
    const values = result[model.outputNames[0]].data;

    let low = Infinity;
    let high = -Infinity;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (value < low) low = value;
      if (value > high) high = value;
    }

    const alpha = new Uint8ClampedArray(plane);
    let coverage = 0;
    for (let i = 0; i < values.length; i++) {
      const strength = Math.max(0, Math.min(1, (values[i] - low) / (high - low || 1)));
      const opacity = Math.round(255 * Math.max(0, Math.min(1, (strength - .18) / .65)));
      alpha[i] = opacity;
      if (opacity > 120) coverage++;
    }

    if (coverage < plane * .035 || coverage > plane * .78) {
      throw new Error('Δεν μπόρεσα να ξεχωρίσω τον ήρωα αυτής της εικόνας. Δοκίμασε άλλη AI εικόνα.');
    }

    self.postMessage({ id, alphaBuffer: alpha.buffer }, [alpha.buffer]);
  } catch (error) {
    self.postMessage({
      id,
      error: error?.message || 'Δεν μπόρεσε να κινηθεί αυτή η εικόνα. Δοκίμασε ξανά.'
    });
  }
};
