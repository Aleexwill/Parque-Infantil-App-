// public/firebase-messaging-sw.js
// FCM Service Worker — must be at root

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

// Config will be injected at build time via vite-plugin-pwa
// For now we read from the SW scope's self.__WB_MANIFEST or hardcode
// The actual config comes from the main app's initialization
firebase.initializeApp({
  apiKey:            self.FIREBASE_API_KEY            || '__VITE_FIREBASE_API_KEY__',
  authDomain:        self.FIREBASE_AUTH_DOMAIN        || '__VITE_FIREBASE_AUTH_DOMAIN__',
  projectId:         self.FIREBASE_PROJECT_ID         || '__VITE_FIREBASE_PROJECT_ID__',
  storageBucket:     self.FIREBASE_STORAGE_BUCKET     || '__VITE_FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID|| '__VITE_FIREBASE_MESSAGING_SENDER_ID__',
  appId:             self.FIREBASE_APP_ID             || '__VITE_FIREBASE_APP_ID__',
})

const messaging = firebase.messaging()

const NOTIF_META = {
  lock_attempt:  { title: '⚠️ KidSpark — Intento de salida',    tag: 'lock',    vibrate: [200,100,200] },
  time_limit:    { title: '⏰ KidSpark — Tiempo límite',         tag: 'time',    vibrate: [200] },
  session_start: { title: '👋 KidSpark — Sesión iniciada',       tag: 'session', vibrate: [100] },
  game_complete: { title: '🎉 KidSpark — ¡Logro desbloqueado!', tag: 'game',    vibrate: [100,50,100] },
  test:          { title: '🌟 KidSpark — Prueba',                tag: 'test',    vibrate: [100] },
}

// Background push handler
messaging.onBackgroundMessage(payload => {
  const data  = payload.data || {}
  const meta  = NOTIF_META[data.event] || NOTIF_META.test
  const notif = payload.notification || {}

  return self.registration.showNotification(notif.title || meta.title, {
    body:    notif.body || data.body || '',
    icon:    '/pwa-192x192.png',
    badge:   '/pwa-192x192.png',
    tag:     meta.tag,
    vibrate: meta.vibrate,
    data:    { url: '/', event: data.event },
    actions: [
      { action: 'open',    title: '📱 Abrir app' },
      { action: 'dismiss', title: 'Cerrar' },
    ],
    requireInteraction: data.event === 'lock_attempt',
  })
})

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.action === 'dismiss') return

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      for (const w of wins) {
        if (w.url.startsWith(self.location.origin) && 'focus' in w) return w.focus()
      }
      return clients.openWindow(self.location.origin)
    })
  )
})
