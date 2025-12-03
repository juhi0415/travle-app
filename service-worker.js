const CACHE_NAME = 'travel-app-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/style.css',
    '/manifest.json'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('앱 쉘 캐싱 완료');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== CACHE_NAME){
                        console.log('이전 캐시 삭제', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(resp => {
            return resp || fetch(evt.request);
        })
    );
});
