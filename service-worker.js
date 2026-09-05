/* AI Tools 4 Kids PWA service worker: v1.1.1 */
const CACHE_NAME = "aitools4kids-pwa-v3";
const CORE = [
  "/",
  "/styles.css",
  "/manifest.webmanifest",
  "/assets/icons/app-icon.svg"
];

/*
 * These files are large, mostly-static datasets. Serving a cached copy first on
 * repeat visits removes a large amount of avoidable network wait, while a
 * background request refreshes the cache for the next navigation.
 *
 * App/runtime files intentionally remain network-first so behavioural fixes are
 * picked up immediately after a deployment.
 */
const HEAVY_DATA_PATHS = new Set([
  "/quiz-data.js",
  "/learning-paths-data.js",
  "/official-curriculum-data.js",
  "/curriculum-2026-2027-expansion.js",
  "/gel-2026-2027-update.js"
]);

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

  // Large, mostly-static curriculum/quiz datasets: instant cached response on
  // repeat visits, refreshed silently in the background.
  if (HEAVY_DATA_PATHS.has(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Runtime JS/CSS/data: prefer the newest deployment, with offline fallback.
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
