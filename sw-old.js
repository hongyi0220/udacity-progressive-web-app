var cacheName = 'weatherPWA_v';
var cacheVersion = 1.14;
var dataCacheName = 'weatherData_v';
var dataCacheVersion = 1.00;
var filesToCache = ['/index.html', '/styles/ud811.css', '/favicon.ico', '/scripts/app.js', '/scripts/lib/require.js', '/scripts/lib/localforage.min.js', '/' ];
var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName + cacheVersion)
      .then(cache =>
        cache.addAll(filesToCache)
      ).catch(err => console.log('Failed to cache files', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName + cacheVersion && key !== dataCacheName + dataCacheVersion) {
          return caches.delete(key);
        }
      }));
    }).catch(err => console.log('Updating cache failed because', err))
  );
});

self.addEventListener('fetch', e => {
  console.log('[serviceWorker] fetch', e.request.url);

  if (e.request.url.startsWith(weatherAPIUrlBase)) {
    e.respondWith(
      fetch(e.request).then(res => {
        let clonedRes = res.clone();
        return caches.open(dataCacheName + dataCacheVersion).then(cache => {
          cache.put(e.request.url, clonedRes);
          console.log('[ServiceWorker] fetched and cached data');
          return res;
        });
      }).catch(err => console.log('Fetch failed (weatherAPI)', err))
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      }).catch(err => console.log('Fetch failed', err))
    );
  }
});
