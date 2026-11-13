const CACHE_NAME = 'fitcoach-v3.4.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './src/styles/main.css',
  './src/styles/tokens.css',
  './src/styles/layout.css',
  './src/styles/components.css',
  './src/styles/views-workout.css',
  './src/styles/views-v3.css',
  './src/core/modals.js',
  './src/data/exercises-db.js',
  './src/core/store.js',
  './src/data/thai-foods-db.js',
  './src/data/supplements-db.js',
  './src/views/dashboard-view.js',
  './src/views/workout-player-view.js',
  './src/views/stats-inbody-view.js',
  './src/core/cloud-sync.js',
  './src/core/router.js',
  './src/components/quick-action-sheet.js',
  './src/components/muscle-heatmap.js',
  './src/components/inbody-radar.js',
  './src/components/fasting-stages.js',
  './src/components/onboarding-wizard.js',
  './src/core/app.js'
];

// Install: Pre-cache core shell + modular files & activate immediately
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
// - HTML & App Code Modules (src/*.js, src/*.css): NETWORK-FIRST (Always fetch latest code if online, fallback to cache if offline)
// - Media & Static Assets: STALE-WHILE-REVALIDATE (Fast load + background refresh)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Navigation / HTML / Modular Source Code Requests: NETWORK-FIRST
  const isAppCode = req.mode === 'navigate' || 
                 req.headers.get('accept')?.includes('text/html') || 
                 url.pathname.endsWith('index.html') || 
                 url.pathname === '/' || 
                 url.pathname.endsWith('/') ||
                 url.pathname.includes('/src/');

  if (isAppCode) {
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

  // 3. Static media assets (Images, Videos, Icons): Stale-While-Revalidate
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
