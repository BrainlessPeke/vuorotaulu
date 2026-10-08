// Sovellus on siirtynyt osoitteeseen https://nrtyokalut.github.io/
// Tämä service worker poistaa itsensä ja vanhat välimuistit ja lataa avoimet ikkunat uudelleen,
// jolloin ne saavat uudelleenohjaussivun.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(clients.map((c) => (c.navigate ? c.navigate(c.url).catch(() => {}) : null)));
    })()
  );
});

// Ei välimuistia: kaikki pyynnöt suoraan verkkoon.
self.addEventListener("fetch", () => {});
