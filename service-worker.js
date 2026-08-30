const CACHE_NAME = 'dti224-utilities-v3';
const APP_FILES = [
    './',
    './index.html',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './assignment_6/index.html',
    './assignment_6/style.css',
    './assignment_6/unit_converter.html',
    './assignment_6/change_calculator.html',
    './assignment_6/distance_calculator.html',
    './assignment_6/grading.html'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            return response;
        }))
    );
});
