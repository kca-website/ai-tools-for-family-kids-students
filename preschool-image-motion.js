/* The image and the model stay on the visitor's device. U2NetP weights: Apache-2.0,
   https://huggingface.co/edgetools/u2netp (U²-Net, Qin et al., 2020).
   Heavy segmentation runs in a Web Worker so mobile UI stays responsive. */
(() => {
  const WORKER = '/preschool-motion-worker.js';
  let worker;
  let nextId = 0;
  const pending = new Map();

  function getWorker() {
    if (worker) return worker;
    worker = new Worker(WORKER, { type: 'module' });
    worker.onmessage = event => {
      const { id, alphaBuffer, error } = event.data || {};
      const request = pending.get(id);
      if (!request) return;
      pending.delete(id);
      if (error) request.reject(new Error(error));
      else request.resolve(new Uint8ClampedArray(alphaBuffer));
    };
    worker.onerror = () => {
      const error = new Error('Δεν μπόρεσε να ξεκινήσει η κίνηση σε αυτή τη συσκευή. Δοκίμασε ξανά.');
      for (const request of pending.values()) request.reject(error);
      pending.clear();
      worker.terminate();
      worker = null;
    };
    return worker;
  }

  function segment(pixels) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      const copy = new Uint8ClampedArray(pixels);
      getWorker().postMessage({ id, pixelsBuffer: copy.buffer }, [copy.buffer]);
    });
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

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const maxSide = matchMedia('(max-width: 700px)').matches ? 640 : 900;
    const scale = Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    const small = canvas(320, 320);
    const smallContext = small.getContext('2d', { willReadFrequently: true });
    smallContext.drawImage(image, 0, 0, 320, 320);
    const pixels = smallContext.getImageData(0, 0, 320, 320).data;

    // Yield once before handing off the expensive work. This lets the loading
    // message/button state paint immediately on slower phones.
    await new Promise(resolve => requestAnimationFrame(() => resolve()));

    const alphaValues = await segment(pixels);
    const alpha = smallContext.createImageData(320, 320);
    for (let i = 0; i < alphaValues.length; i++) {
      alpha.data[4 * i + 3] = alphaValues[i];
    }
    smallContext.putImageData(alpha, 0, 0);

    const mask = canvas(width, height);
    mask.getContext('2d').drawImage(small, 0, 0, width, height);

    const foreground = canvas(width, height);
    const foregroundContext = foreground.getContext('2d');
    foregroundContext.drawImage(image, 0, 0, width, height);
    foregroundContext.globalCompositeOperation = 'destination-in';
    foregroundContext.drawImage(mask, 0, 0);

    const foregroundData = foreground.toDataURL('image/png');

    // Explicitly release the large canvas backing stores after export.
    small.width = small.height = 1;
    mask.width = mask.height = 1;
    foreground.width = foreground.height = 1;

    return { foreground: foregroundData, width, height };
  }

  window.PreschoolImageMotion = { cutout };
})();
