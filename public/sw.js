// Vampiro: A Idade das Trevas â€” Service Worker v1103
const CACHE_NAME = 'vampiro-dark-ages-v1103';

const STATIC_ASSETS = [
  '/favicon.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/vampire-dark-ages-logo.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith('http')) return;
  if (request.method !== 'GET') return;

  // API, version.json, sw.js e manifest sempre vÃ£o direto Ã  rede (nunca cacheados)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname === '/version.json' ||
    url.pathname === '/sw.js' ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-First para HTML, JS e CSS: garante versÃ£o mais recente instantaneamente quando online
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok && url.origin === self.location.origin) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});



