const CACHE_NAME = 'hifz-companion-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './image_0.png'
];

// 1. Installation du Service Worker et mise en cache de l'interface
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Mise en cache des ressources UI réussie');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 2. Nettoyage des anciens caches lors des mises à jour
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Interception des requêtes réseau (Fetch)
self.addEventListener('fetch', (event) => {
    // Si c'est l'API Quran ou de l'audio, on essaie le réseau en priorité (Network First)
    if (event.request.url.includes('api.quran.com') || event.request.url.includes('everyayah.com')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Pour l'interface (HTML, CSS, JS), on cherche dans le cache d'abord (Cache First pour la vitesse)
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});