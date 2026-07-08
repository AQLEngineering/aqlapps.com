// AQL APPS - Universal Service Worker
console.log('🔔 AQL Service Worker v1.3.2 loaded (Public)');

const VERSION = 'v1.3.2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('📬 Push received');
  
  let data = {
    title: 'AQL APPS',
    body: 'Nova notificação do sistema',
    icon: '/assets/aql-fisio-icon.svg',
    badge: '/assets/aql-fisio-icon.svg'
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data = Object.assign({}, data, json);
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: data.vibrate || [100, 50, 100],
    data: data.data || { url: '/fisio' },
    actions: data.actions || [
      { action: 'open', title: 'Abrir App' },
      { action: 'close', title: 'Fechar' }
    ],
    tag: data.tag || 'aql-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/fisio';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
