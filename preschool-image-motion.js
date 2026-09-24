/* The image and the model stay on the visitor's device. U2NetP weights: Apache-2.0,
   https://huggingface.co/edgetools/u2netp (U²-Net, Qin et al., 2020). */
(() => {
  const MODEL = '/assets/preschool-motion/u2netp.onnx';
  const RUNTIME = '/assets/preschool-motion/ort.wasm.min.mjs';
  let sessionPromise;

  async function session() {
    if (!sessionPromise) sessionPromise = (async () => {
      const ort = await import(RUNTIME);
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.wasmPaths = '/assets/preschool-motion/';
      const response = await fetch(MODEL);
      if (!response.ok) throw new Error('Δεν μπόρεσε να φορτωθεί η κίνηση. Δοκίμασε ξανά αργότερα.');
      const bytes = await response.arrayBuffer();
      return {ort, model: await ort.InferenceSession.create(bytes, {executionProviders:['wasm']})};
    })().catch(error => { sessionPromise = null; throw error; });
    return sessionPromise;
  }

  function canvas(width, height) {
    const element = document.createElement('canvas');
    element.width = width;
    element.height = height;
    return element;
  }

  async function cutout(source) {
    const image = new Image();
    image.src = source;
    await image.decode();
    const width = image.naturalWidth, height = image.naturalHeight;
    const small = canvas(320, 320);
    const smallContext = small.getContext('2d', {willReadFrequently:true});
    smallContext.drawImage(image, 0, 0, 320, 320);
    const pixels = smallContext.getImageData(0, 0, 320, 320).data;
    const input = new Float32Array(3 * 320 * 320);
    const mean = [.485,.456,.406], std = [.229,.224,.225];
    for (let i = 0; i < 320 * 320; i++) {
      for (let channel = 0; channel < 3; channel++)
        input[channel * 320 * 320 + i] = (pixels[4 * i + channel] / 255 - mean[channel]) / std[channel];
    }
    const {ort, model} = await session();
    const result = await model.run({[model.inputNames[0]]:new ort.Tensor('float32',input,[1,3,320,320])});
    const values = result[model.outputNames[0]].data;
    let low = Infinity, high = -Infinity;
    for (const value of values) { if (value < low) low = value; if (value > high) high = value; }
    const alpha = smallContext.createImageData(320,320);
    let coverage = 0;
    for (let i = 0; i < values.length; i++) {
      const strength = Math.max(0,Math.min(1,(values[i]-low)/(high-low || 1)));
      const opacity = Math.round(255 * Math.max(0,Math.min(1,(strength-.18)/.65)));
      alpha.data[4*i+3] = opacity;
      if (opacity > 120) coverage++;
    }
    // Do not present a mangled cutout as a successful animation.
    if (coverage < 320*320*.035 || coverage > 320*320*.78)
      throw new Error('Δεν μπόρεσα να ξεχωρίσω τον ήρωα αυτής της εικόνας. Δοκίμασε άλλη AI εικόνα.');
    smallContext.putImageData(alpha,0,0);
    const mask = canvas(width,height);
    mask.getContext('2d').drawImage(small,0,0,width,height);
    const foreground = canvas(width,height);
    const foregroundContext = foreground.getContext('2d');
    foregroundContext.drawImage(image,0,0);
    foregroundContext.globalCompositeOperation = 'destination-in';
    foregroundContext.drawImage(mask,0,0);

    return {foreground:foreground.toDataURL('image/png'), width,height};
  }
  window.PreschoolImageMotion = {cutout};
})();
