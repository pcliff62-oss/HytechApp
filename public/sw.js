// minimal no-op service worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {});
