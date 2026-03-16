// firebase/functions/src/index.ts
// Firebase Cloud Functions v2 — KidSpark push notifications

import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore }  from 'firebase-admin/firestore'
import { getMessaging }  from 'firebase-admin/messaging'

initializeApp()
const db  = getFirestore()
const fcm = getMessaging()

/* ─────────────────────────────────────────────
   sendPush — Called from the React app via
   httpsCallable(functions, 'sendPush')
   ───────────────────────────────────────────── */
export const sendPush = onCall(async (request) => {
  const { familyId, event, payload = {} } = request.data

  if (!familyId || !event) {
    throw new HttpsError('invalid-argument', 'familyId and event are required')
  }

  // Fetch active FCM tokens for this family
  const tokensSnap = await db
    .collection('families').doc(familyId)
    .collection('pushTokens')
    .where('active', '==', true)
    .get()

  if (tokensSnap.empty) {
    return { sent: 0, failed: 0, message: 'No active tokens' }
  }

  const tokens = tokensSnap.docs
    .map(d => d.data().token as string)
    .filter(Boolean)

  // Build notification payload per event type
  type NotifMeta = { title: string; body: string }
  const EVENTS: Record<string, NotifMeta> = {
    lock_attempt: {
      title: '⚠️ KidSpark — Intento de salida',
      body:  payload.kid_name
        ? `${payload.kid_name} intentó salir de la app`
        : 'Un niño intentó salir de la app',
    },
    time_limit: {
      title: '⏰ KidSpark — Tiempo límite',
      body:  payload.kid_name
        ? `${payload.kid_name} alcanzó su límite diario`
        : 'Se alcanzó el límite de tiempo diario',
    },
    session_start: {
      title: '👋 KidSpark — Sesión iniciada',
      body:  payload.kid_name
        ? `${payload.kid_name} comenzó a usar KidSpark`
        : 'Un niño comenzó a usar la app',
    },
    game_complete: {
      title: '🎉 KidSpark — ¡Logro desbloqueado!',
      body:  payload.kid_name && payload.game
        ? `${payload.kid_name} completó: ${payload.game}`
        : '¡Un niño desbloqueó un logro!',
    },
    test: {
      title: '🌟 KidSpark — Notificación de prueba',
      body:  '¡Las notificaciones push están funcionando!',
    },
  }

  const notif = EVENTS[event] || EVENTS.test

  // Send multicast to all tokens
  let sent = 0
  let failed = 0
  const invalidTokenIds: string[] = []

  if (tokens.length > 0) {
    const response = await fcm.sendEachForMulticast({
      tokens,
      notification: {
        title: notif.title,
        body:  notif.body,
      },
      data: {
        event,
        familyId,
        kid_name: payload.kid_name || '',
        timestamp: String(Date.now()),
      },
      webpush: {
        notification: {
          icon:  '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          requireInteraction: event === 'lock_attempt',
          vibrate: event === 'lock_attempt' ? [200, 100, 200] : [100],
        },
        fcmOptions: { link: '/' },
      },
    })

    sent   = response.successCount
    failed = response.failureCount

    // Mark expired tokens as inactive
    response.responses.forEach((resp, i) => {
      if (!resp.success) {
        const code = resp.error?.code
        if (code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token') {
          const docId = tokensSnap.docs[i]?.id
          if (docId) invalidTokenIds.push(docId)
        }
      }
    })
  }

  // Clean up invalid tokens
  for (const id of invalidTokenIds) {
    await db
      .collection('families').doc(familyId)
      .collection('pushTokens').doc(id)
      .update({ active: false })
  }

  return { sent, failed }
})
