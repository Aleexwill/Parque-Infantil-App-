/* ─────────────────────────────────────────────
   KidSpark — Push Notification Service Worker
   File: public/sw-push.js

   This SW handles incoming push events and
   notification click actions independently of
   the Vite/PWA service worker.
   ───────────────────────────────────────────── */

const APP_URL = self.location.origin

// ── Push received ──────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = {
      title: '🌟 KidSpark',
      body:  event.data.text(),
      icon:  '/pwa-192x192.png',
      tag:   'kidspark',
    }
  }

  const options = {
    body:             data.body,
    icon:             data.icon  || '/pwa-192x192.png',
    badge:            '/pwa-192x192.png',
    tag:              data.tag   || 'kidspark',
    data:             data.data  || {},
    actions:          data.actions || [
      { action: 'open',    title: '📱 Abrir app' },
      { action: 'dismiss', title: 'Cerrar' },
    ],
    requireInteraction: data.tag === 'lock-attempt', // stay visible for lock alerts
    vibrate:          data.tag === 'lock-attempt' ? [200, 100, 200, 100, 200] : [200],
    timestamp:        data.data?.timestamp || Date.now(),
    // Android BigText style
    silent:           false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// ── Notification clicked ───────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const action = event.action
  const url    = event.notification.data?.url || '/'

  if (action === 'dismiss') return

  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.startsWith(APP_URL) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(APP_URL + url)
      }
    })
  )
})

// ── Push subscription change ───────────────────
self.addEventListener('pushsubscriptionchange', (event) => {
  // Notify the app to re-subscribe
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      windowClients.forEach(client =>
        client.postMessage({ type: 'PUSH_SUBSCRIPTION_CHANGED' })
      )
    })
  )
})

// ── Activate immediately ───────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
