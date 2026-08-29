/* AI Tools 4 Kids PWA service worker — v1.0.0 */
const CACHE_NAME = "aitools4kids-pwa-v1";
const CORE = [
  "/",
  "/styles.css",
  "/manifest.webmanifest",
  "/assets/icons/app-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return cache.match("/");
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/service-worker.js") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // JS/CSS/data should prefer the newest deployment, with offline fallback.
  if (/\.(?:js|css|json|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images and other static same-origin assets can be reused immediately.
  event.respondWith(staleWhileRevalidate(request));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
