import { useState, useEffect, useCallback, useRef } from 'react'
import {
  messaging, getFcmToken, saveFcmToken,
  onForegroundMessage, db,
} from '@/lib/firebase'
import {
  collection, query, where, orderBy, limit,
  getDocs, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from 'firebase/app'

/* ─────────────────────────────────────────────
   usePushNotifications — FCM-based push
   Much simpler than VAPID manual:
   1. Request notification permission
   2. Get FCM token
   3. Save token to Firestore
   4. Call Cloud Function to send notifications
   ───────────────────────────────────────────── */

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

export function usePushNotifications({ familyId, userId, enabled = true }) {
  const [status,    setStatus]    = useState('idle')
  const [fcmToken,  setFcmToken]  = useState(null)
  const [devices,   setDevices]   = useState([])
  const [logs,      setLogs]      = useState([])
  const [error,     setError]     = useState(null)
  const [deviceLabel, setDeviceLabel] = useState('')
  const functionsRef = useRef(null)

  // Init Firebase Functions
  useEffect(() => {
    try {
      functionsRef.current = getFunctions(getApp())
    } catch { /* functions not initialized yet */ }
  }, [])

  // Check initial permission + existing token
  useEffect(() => {
    if (!enabled || !messaging) {
      setStatus('unsupported'); return
    }
    const perm = Notification.permission
    if (perm === 'denied') { setStatus('denied'); return }
    if (perm === 'granted') {
      // Try to get existing token silently
      getFcmToken(VAPID_KEY).then(token => {
        if (token) { setFcmToken(token); setStatus('subscribed') }
        else setStatus('idle')
      }).catch(() => setStatus('idle'))
    } else {
      setStatus('idle')
    }
  }, [enabled])

  // Listen for foreground messages (app is open)
  useEffect(() => {
    if (!messaging) return
    const unsub = onForegroundMessage((payload) => {
      // Show as browser notification if app is in foreground
      const { title, body } = payload.notification || {}
      if (title && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/pwa-192x192.png' })
      }
    })
    return unsub
  }, [])

  // Load devices
  useEffect(() => {
    if (!familyId || !userId) return
    loadDevices()
    loadLogs()
  }, [familyId, userId])

  const loadDevices = useCallback(async () => {
    if (!familyId) return
    try {
      const snap = await getDocs(
        collection(db, 'families', familyId, 'pushTokens')
      )
      setDevices(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) { console.error('[push] loadDevices:', err) }
  }, [familyId])

  const loadLogs = useCallback(async () => {
    if (!familyId) return
    try {
      const snap = await getDocs(
        query(
          collection(db, 'families', familyId, 'pushLogs'),
          orderBy('createdAt', 'desc'),
          limit(20)
        )
      )
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) { console.error('[push] loadLogs:', err) }
  }, [familyId])

  // ── Subscribe ──────────────────────────────
  const subscribe = useCallback(async () => {
    if (!messaging || !VAPID_KEY) {
      setStatus('unsupported')
      setError('FCM no configurado. Agrega VITE_FIREBASE_VAPID_KEY en .env')
      return { ok: false }
    }

    try {
      setStatus('asking')
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); return { ok: false } }

      setStatus('subscribing')
      const token = await getFcmToken(VAPID_KEY)
      if (!token) throw new Error('No se pudo obtener el token FCM')

      setFcmToken(token)
      const label = deviceLabel || guessDeviceLabel(navigator.userAgent)
      await saveFcmToken(familyId, userId, token, label)

      setStatus('subscribed')
      await loadDevices()
      return { ok: true }
    } catch (err) {
      console.error('[push] subscribe:', err)
      setStatus('error'); setError(err.message)
      return { ok: false, reason: err.message }
    }
  }, [familyId, userId, deviceLabel, loadDevices])

  // ── Unsubscribe ────────────────────────────
  const unsubscribe = useCallback(async () => {
    try {
      if (familyId && userId) {
        await updateDoc(
          doc(db, 'families', familyId, 'pushTokens', userId),
          { active: false }
        )
      }
      setFcmToken(null); setStatus('idle')
      await loadDevices()
    } catch (err) { setError(err.message) }
  }, [familyId, userId, loadDevices])

  const removeDevice = useCallback(async (deviceId) => {
    try {
      await updateDoc(
        doc(db, 'families', familyId, 'pushTokens', deviceId),
        { active: false }
      )
      await loadDevices()
    } catch (err) { console.error('[push] removeDevice:', err) }
  }, [familyId, loadDevices])

  // ── Send via Cloud Function ────────────────
  const sendNotification = useCallback(async (event, payload = {}) => {
    if (!familyId) return { ok: false }
    try {
      const sendPush = httpsCallable(functionsRef.current, 'sendPush')
      const result   = await sendPush({ familyId, event, payload })

      // Log to Firestore
      await addDoc(collection(db, 'families', familyId, 'pushLogs'), {
        event, payload,
        sent:      result.data?.sent || 0,
        failed:    result.data?.failed || 0,
        createdAt: serverTimestamp(),
      })

      await loadLogs()
      return { ok: true, ...result.data }
    } catch (err) {
      console.error('[push] sendNotification:', err)
      return { ok: false, reason: err.message }
    }
  }, [familyId, loadLogs])

  // ── Convenience triggers ──────────────────
  const notifyLockAttempt  = useCallback((kidName) => sendNotification('lock_attempt',  { kid_name: kidName }), [sendNotification])
  const notifyTimeLimit    = useCallback((kidName) => sendNotification('time_limit',    { kid_name: kidName }), [sendNotification])
  const notifySessionStart = useCallback((kidName) => sendNotification('session_start', { kid_name: kidName }), [sendNotification])
  const notifyGameComplete = useCallback((kidName, game) => sendNotification('game_complete', { kid_name: kidName, game }), [sendNotification])
  const sendTestNotification = useCallback(() => sendNotification('test'), [sendNotification])

  return {
    isSupported:  !!messaging && 'Notification' in window,
    status,
    fcmToken,
    devices,
    logs,
    error,
    isSubscribed: status === 'subscribed',
    deviceLabel,
    setDeviceLabel,
    subscribe,
    unsubscribe,
    removeDevice,
    sendNotification,
    notifyLockAttempt,
    notifyTimeLimit,
    notifySessionStart,
    notifyGameComplete,
    sendTestNotification,
    loadDevices,
    loadLogs,
  }
}

function guessDeviceLabel(ua) {
  const isAndroid = /Android/i.test(ua)
  const isIOS     = /iPhone|iPad/i.test(ua)
  const isChrome  = /Chrome/i.test(ua) && !/Edge/i.test(ua)
  const isFirefox = /Firefox/i.test(ua)
  const isSafari  = /Safari/i.test(ua) && !/Chrome/i.test(ua)
  const isEdge    = /Edge/i.test(ua)
  const browser = isEdge ? 'Edge' : isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : 'Navegador'
  const device  = isAndroid ? 'Android' : isIOS ? 'iOS' : 'PC'
  return `${browser} en ${device}`
}
