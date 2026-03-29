// service-worker.js

const CACHE_NAME = "pickpal-v1";
const ASSETS_TO_CACHE = [
  "/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/ui.js",
  "/js/storage.js",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  // Add any icons/images here
];

// Install: cache all static assets
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching all assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Optional: cache new requests dynamically
          // But for now we can skip dynamic caching
          return response;
        })
        .catch(() => {
          // Offline fallback if needed
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});