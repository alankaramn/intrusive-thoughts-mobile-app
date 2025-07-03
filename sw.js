const CACHE_NAME = 'intrusive-thoughts-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Cache the Elle Woods gif for offline use
  'https://tenor.com/en-GB/view/graduate-legally-blonde-we-did-it-smile-gif-17216689.gif'
];

// Install event - cache all resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
        // If external gif fails to cache, continue anyway
        return caches.open(CACHE_NAME)
          .then((cache) => cache.addAll([
            '/',
            '/index.html', 
            '/manifest.json'
          ]));
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .catch(() => {
            // If network fails and it's the gif, show a fallback
            if (event.request.url.includes('tenor.com')) {
              return new Response('🎉 We did it! 🎉', {
                headers: { 'Content-Type': 'text/plain' }
              });
            }
          });
      })
  );
});

// Activate event - clean up old caches
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
});
