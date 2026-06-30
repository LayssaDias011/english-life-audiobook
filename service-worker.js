const CACHE_NAME = "english-life-v2";

const STATIC_ASSETS = [
  "./",
  "index.html",
  "dashboard.html",
  "lesson.html",
  "flashcards.html",
  "speaking.html",
  "review.html",
  "interview.html",
  "css/styles.css",
  "js/app.js",
  "js/config.js",
  "js/progress-service.js",
  "js/lesson-engine.js",
  "js/flashcard-engine.js",
  "js/speaking-recorder.js",
  "js/roadmap-engine.js",
  "js/storage-service.js",
  "data/roadmap.json",
  "data/lessons/1A.json",
  "data/glossary/unit1.json",
  "images/icon-192.png",
  "images/icon-512.png",
  "manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.includes("/data/") || event.request.url.includes("/audio/")) {
            cache.put(event.request, copy);
          }
        });
        return response;
      });
    })
  );
});
