const CACHE_NAME = 'tweaks-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/profile.html',
  '/css/style.css',
  '/css/auth.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/feed.js',
  '/js/profile.js',
  '/js/upload.js',
  '/js/firebase-config.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700;14..32,900&display=swap'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch and cache strategy - Network first, then cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline uploads
self.addEventListener('sync', event => {
  if (event.tag === 'upload-video') {
    event.waitUntil(uploadPendingVideos());
  }
});

async function uploadPendingVideos() {
  const db = await openIndexedDB();
  const pendingVideos = await getPendingVideos(db);
  
  for (const video of pendingVideos) {
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: video.data,
        headers: { 'Content-Type': 'video/mp4' }
      });
      await markVideoAsUploaded(db, video.id);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
}
