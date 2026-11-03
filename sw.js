const CACHE_NAME = 'fitcoach-v2.6.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Install: Pre-cache core shell & activate immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate: Clean up all older cache versions & claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) {
          console.log('[SW] Deleting old cache version:', k);
          return caches.delete(k);
        }
      })
    )).then(() => self.clients.claim()).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(c => c.postMessage({ type: 'VERSION_UPDATED', version: CACHE_NAME }));
      });
    })
  );
});

// Fetch: Smart Strategy
// - HTML/Navigation: NETWORK-FIRST (Always fetch latest code if online, fallback to cache if offline)
// - Static assets: STALE-WHILE-REVALIDATE (Fast load + background refresh)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Navigation / HTML Requests: NETWORK-FIRST
  const isHtml = req.mode === 'navigate' || 
                 req.headers.get('accept')?.includes('text/html') || 
                 url.pathname.endsWith('index.html') || 
                 url.pathname === '/' || 
                 url.pathname.endsWith('/');

  if (isHtml) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, resClone));
          }
          return res;
        })
        .catch(() => {
          return caches.match(req).then(cRes => cRes || caches.match('./index.html'));
        })
    );
    return;
  }

  // 2. Bypass non-GET, Firebase API, Firestore, and External APIs
  if (req.method !== 'GET' || 
      url.origin.includes('firestore') || 
      url.origin.includes('googleapis') || 
      url.origin.includes('firebase')) {
    return;
  }

  // 3. Static assets (Images, Videos, Styles): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req).then(fresh => {
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          const freshClone = fresh.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, freshClone));
        }
        return fresh;
      }).catch(() => null);

      return cached || networkFetch;
    })
  );
});

// Message listener to trigger immediate skip waiting
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
