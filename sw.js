/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@4.3.1/build/workbox-sw.min.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "7f7f1f9f529ef39967246c57a33069c7"
  },
  {
    "url": "index.webmanifest",
    "revision": "2da5a04a4fab8b469fe091d413c0c871"
  },
  {
    "url": "src.1ec23c2c.js",
    "revision": "3bc0481217dfdf76efaa230d922d6d81"
  },
  {
    "url": "src.8da01cba.css",
    "revision": "1fa5c4ab4dbf807be5fc3051b1962966"
  },
  {
    "url": "WebCell-0.f1ffd28b.png",
    "revision": "8097ecfd687ded98721d28d6823561c1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.precaching.cleanupOutdatedCaches();
