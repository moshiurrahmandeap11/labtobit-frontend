// Service Worker using Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (self.workbox) {
  console.log('Workbox is loaded successfully.');

  // Force activation immediately on new install
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

  // 1. Cache Videos using CacheFirst and RangeRequestsPlugin (support HTTP 206 partial content)
  self.workbox.routing.registerRoute(
    ({ request, url }) => {
      return request.destination === 'video' || url.pathname.endsWith('.mp4');
    },
    new self.workbox.strategies.CacheFirst({
      cacheName: 'videos-cache',
      plugins: [
        new self.workbox.rangeRequests.RangeRequestsPlugin(),
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 2. Cache Images using CacheFirst strategy
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new self.workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 3. Cache Styles and Fonts
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font' || request.destination === 'style',
    new self.workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 4. Cache JS Files and Pages (StaleWhileRevalidate strategy for faster re-visits)
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'document',
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: 'js-and-pages',
    })
  );
} else {
  console.log('Workbox failed to load.');
}
