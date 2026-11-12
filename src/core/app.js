/* FitCoach v3.0 — Application Bootstrap & PWA Auto-Update Lifecycle */
render();
updateIFUI();
renderAuthUI();

/* ============ PWA AUTO-UPDATE LIFECYCLE ============ */
        let newWorkerWaiting = null;

function showAppUpdateNotification(worker) {
    newWorkerWaiting = worker;
    const toast = document.getElementById('appUpdateToast');
    if (toast) {
        toast.innerHTML = `<span>✨ มีเวอร์ชันใหม่ (v${APP_VERSION})!</span> <button class="btn sm" onclick="applyAppUpdateNow()" style="padding:4px 10px;font-size:12px;margin:0;">อัปเดตทันที</button>`;
        toast.classList.add('on');
    }
}

function applyAppUpdateNow() {
    if (newWorkerWaiting) {
        newWorkerWaiting.postMessage('SKIP_WAITING');
    } else {
        forceAppUpdate();
    }
}

async function forceAppUpdate() {
    msg('กำลังล้างแคชและโหลดเวอร์ชันล่าสุด...');
    try {
        if ('caches' in window) {
            const keys = await caches.keys();
            for (let k of keys) {
                await caches.delete(k);
            }
        }
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let reg of registrations) {
                await reg.update();
            }
        }
    } catch (e) {
        console.error('Update error:', e);
    }
    // Reload with cache-busting timestamp without deleting localStorage or auth
    window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=' + APP_VERSION, { updateViaCache: 'none' }).then(reg => {
            // Force check for updates every time app opens
            reg.update();

            if (reg.waiting) {
                showAppUpdateNotification(reg.waiting);
            }

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showAppUpdateNotification(newWorker);
                    }
                });
            });
        }).catch(err => console.log('SW reg error:', err));

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}
