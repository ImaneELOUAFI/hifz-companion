const CACHE_NAME = 'hifz-companion-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './image_0.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // STRATÉGIE "NETWORK FIRST" : Toujours chercher la nouvelle version en ligne d'abord !
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si on a internet, on met à jour la mémoire locale au passage
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Si on est HORS-LIGNE (mode avion), on utilise la mémoire
                return caches.match(event.request);
            })
    );
});