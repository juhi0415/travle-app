const CACHE_NAME = 'travel-app-cache-v1';
const FILES_TO_CACHE = [
  '/travle-app/',
  '/travle-app/index.html',
  '/travle-app/style.css',
  '/travle-app/app.js',
  '/travle-app/manifest.json',
  '/travle-app/service-worker.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
