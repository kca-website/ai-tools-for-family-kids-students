The subject mask is produced locally in the visitor's browser. The image is never
uploaded to the segmentation model or to a separate service.

- `u2netp.onnx`: U²-Net portable model by Qin et al., 2020. Apache-2.0.
  Source: https://huggingface.co/edgetools/u2netp
  SHA-256: 309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8
- `ort.wasm.min.mjs`, `ort-wasm-simd-threaded.mjs` and
  `ort-wasm-simd-threaded.wasm`: ONNX Runtime Web 1.22.0 by Microsoft. MIT.
  Source: https://github.com/microsoft/onnxruntime

The binaries are served from the same site and fetched only after a visitor
requests motion. The original Cloudflare FLUX image generation remains separate.
