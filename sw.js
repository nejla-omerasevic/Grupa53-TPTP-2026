const CACHE_NAME = 'nsn-garden-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/tptpstilovi.css',
  '/tptpskripte.js',
  '/manifest.json',
  '/images/icon.jpg'
];

// Instalacija service workera i kesiranje fajlova
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivacija i ciscenje starog kesa
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strategija: Cache First / Network Fallback za offline rad
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});