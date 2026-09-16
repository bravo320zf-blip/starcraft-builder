const CACHE_NAME = 'sctmg-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/Logo.png',
  './images/Icon192.png',
  './images/Icon512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Safe add: will not abort install if an asset is temporarily unreachable
      return Promise.allSettled(
        ASSETS.map((url) => cache.add(url).catch((err) => console.warn('PWA Cache skip:', url)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
