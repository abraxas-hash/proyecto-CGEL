self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Un service worker básico solo necesita escuchar el evento fetch.
  // Podríamos cachear respuestas aquí, pero dejaremos que la PWA sea online-first por ahora.
});
