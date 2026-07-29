const CACHE_NAME = "sri-saradha-mart-v99";

const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/logo.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );

});

// Activate Service Worker
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cache) => {

                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }

                })

            );

        })

    );

});

// Fetch Files
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
            .then((response) => {

                return response || fetch(event.request);

            })

    );

});
