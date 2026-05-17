const CACHE_NAME = 'nsn-garden-v1';
const ASSETS = [
  './',
  './index.html',
  './kontakt.html',
  './sadrzaj.html',
  './manifest.json',
  './css/tptpstil.css',
  './js/tptpskripte.js',
  './images/icon.jpg'
];

// Instalacija service workera i keširanje osnovnih fajlova
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Keširanje fajlova...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Aktivacija i čišćenje starih verzija keša
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Brisanje starog keša:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategija: Mreža na prvom mjestu, keš kao rezerva (Network First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
