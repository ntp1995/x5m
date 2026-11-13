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

/* ============================================================================
   FITCOACH CLOUD PUSH & NOTIFICATION HANDLER (v3.5.0)
   ============================================================================ */
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'FitCoach', body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || '🌅 ได้เวลาชั่งน้ำหนักยามเช้า (FitCoach)';
  const body = data.body || data.notification?.body || 'ชั่งน้ำหนักหลังตื่นนอนและปัสสาวะ เพื่อบันทึกสถิติที่แม่นยำที่สุด';
  const actionType = data.action || data.data?.action || 'weigh';

  const options = {
    body: body,
    icon: './icon.svg',
    badge: './icon.svg',
    vibrate: [100, 50, 100],
    data: {
      action: actionType,
      url: `./index.html?action=${actionType}`
    },
    actions: [
      { action: 'open', title: '✍️ บันทึกทันที' },
      { action: 'snooze', title: '⏰ เลื่อน 15 นาที' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const clickedAction = event.action;
  const notifData = event.notification.data || {};
  const targetAction = notifData.action || 'weigh';

  if (clickedAction === 'snooze') {
    // Snooze 15 minutes
    setTimeout(() => {
      self.registration.showNotification('⏰ เตือนซ้ำ: ' + event.notification.title, {
        body: event.notification.body,
        icon: './icon.svg',
        badge: './icon.svg',
        data: notifData,
        actions: [{ action: 'open', title: '✍️ บันทึกทันที' }]
      });
    }, 15 * 60 * 1000);
    return;
  }

  const targetUrl = new URL(`./index.html?action=${targetAction}`, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'TRIGGER_DEEP_LINK', action: targetAction });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
