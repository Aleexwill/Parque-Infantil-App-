// src/lib/firebase.js
// Firebase v10 modular SDK — KidSpark client

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  doc, collection,
  getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit,
  serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

/* ─────────────────────────────────────────────
   Firebase config (from .env)
   ───────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

// Messaging is optional — only works in browsers that support it
export let messaging = null
try {
  messaging = getMessaging(app)
} catch {
  console.info('[firebase] Messaging not supported in this browser')
}

/* ─────────────────────────────────────────────
   AUTH helpers
   ───────────────────────────────────────────── */

export async function registerUser({ email, password, familyName }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  // Set display name
  await updateProfile(cred.user, { displayName: familyName || 'Mi Familia' })

  // Create family document in Firestore
  const familyRef = doc(db, 'families', cred.user.uid)
  await setDoc(familyRef, {
    name:      familyName || 'Mi Familia',
    ownerId:   cred.user.uid,
    createdAt: serverTimestamp(),
  })

  // Create default settings
  const settingsRef = doc(db, 'families', cred.user.uid, 'settings', 'main')
  await setDoc(settingsRef, {
    youtubeEnabled:       true,
    dailyLimitEnabled:    true,
    dailyLimitMinutes:    120,
    notificationsEnabled: true,
    gamesOnlyMode:        false,
    lockPattern:          [0, 1, 4, 7, 8],
    notifyLockAttempt:    true,
    notifyTimeLimit:      true,
    notifySessionStart:   false,
    notifyGameComplete:   false,
    updatedAt:            serverTimestamp(),
  })

  return cred.user
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logoutUser() {
  await fbSignOut(auth)
}

export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  })
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

/* ─────────────────────────────────────────────
   FAMILY helpers
   ───────────────────────────────────────────── */

export async function getFamily(uid) {
  const snap = await getDoc(doc(db, 'families', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/* ─────────────────────────────────────────────
   KIDS helpers
   ───────────────────────────────────────────── */

export async function getKids(familyId) {
  const snap = await getDocs(
    query(collection(db, 'families', familyId, 'kids'), orderBy('createdAt'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addKid(familyId, kidData) {
  const ref = await addDoc(collection(db, 'families', familyId, 'kids'), {
    ...kidData,
    active:     true,
    pinEnabled: false,
    createdAt:  serverTimestamp(),
  })
  return { id: ref.id, ...kidData, active: true }
}

export async function updateKid(familyId, kidId, patch) {
  await updateDoc(doc(db, 'families', familyId, 'kids', kidId), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteKid(familyId, kidId) {
  await deleteDoc(doc(db, 'families', familyId, 'kids', kidId))
}

/* ─────────────────────────────────────────────
   SETTINGS helpers
   ───────────────────────────────────────────── */

export async function getSettings(familyId) {
  const snap = await getDoc(doc(db, 'families', familyId, 'settings', 'main'))
  return snap.exists() ? snap.data() : null
}

export async function updateSettings(familyId, patch) {
  await updateDoc(doc(db, 'families', familyId, 'settings', 'main'), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

/* ─────────────────────────────────────────────
   ACTIVITIES helpers
   ───────────────────────────────────────────── */

export async function logActivity(familyId, entry) {
  const ref = await addDoc(collection(db, 'families', familyId, 'activities'), {
    ...entry,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...entry, ts: Date.now() }
}

export async function getActivities(familyId, limitCount = 100) {
  const snap = await getDocs(
    query(
      collection(db, 'families', familyId, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  )
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    ts:    d.data().createdAt?.toMillis?.() ?? Date.now(),
    kidId: d.data().kidId,
  }))
}

/* ─────────────────────────────────────────────
   DAILY TIME helpers
   ───────────────────────────────────────────── */

export async function getTodayTime(familyId) {
  const today = new Date().toISOString().split('T')[0]
  const snap  = await getDocs(
    query(collection(db, 'families', familyId, 'dailyTime'), where('date', '==', today))
  )
  const map = {}
  snap.docs.forEach(d => { map[d.data().kidId] = d.data().minutes })
  return map
}

export async function addDailyTime(familyId, kidId, minutes) {
  const today = new Date().toISOString().split('T')[0]
  const q     = query(
    collection(db, 'families', familyId, 'dailyTime'),
    where('kidId', '==', kidId),
    where('date', '==', today)
  )
  const snap = await getDocs(q)
  if (snap.empty) {
    await addDoc(collection(db, 'families', familyId, 'dailyTime'), {
      kidId, date: today, minutes, updatedAt: serverTimestamp()
    })
  } else {
    const existing = snap.docs[0]
    await updateDoc(existing.ref, {
      minutes:   (existing.data().minutes || 0) + minutes,
      updatedAt: serverTimestamp(),
    })
  }
}

export async function getWeeklyData(familyId) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  const fromDate = sevenDaysAgo.toISOString().split('T')[0]

  const snap = await getDocs(
    query(
      collection(db, 'families', familyId, 'dailyTime'),
      where('date', '>=', fromDate),
      orderBy('date')
    )
  )

  // Group by date, sum all kids
  const byDate = {}
  snap.docs.forEach(d => {
    const { date, minutes } = d.data()
    byDate[date] = (byDate[date] || 0) + minutes
  })

  // Return last 7 days in order (Mon→Sun)
  return Array.from({ length: 7 }, (_, i) => {
    const d   = new Date()
    d.setDate(d.getDate() - (6 - i))
    return byDate[d.toISOString().split('T')[0]] || 0
  })
}

/* ─────────────────────────────────────────────
   PUSH SUBSCRIPTIONS helpers (FCM)
   ───────────────────────────────────────────── */

export async function saveFcmToken(familyId, uid, token, deviceLabel) {
  const ref = doc(db, 'families', familyId, 'pushTokens', uid)
  await setDoc(ref, {
    token,
    deviceLabel: deviceLabel || 'Dispositivo',
    active:      true,
    updatedAt:   serverTimestamp(),
  }, { merge: true })
}

export async function getFcmToken(vapidKey) {
  if (!messaging) return null
  try {
    return await getToken(messaging, { vapidKey })
  } catch (err) {
    console.error('[fcm] getToken error:', err)
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!messaging) return () => {}
  return onMessage(messaging, callback)
}

/* ─────────────────────────────────────────────
   REALTIME listeners (onSnapshot)
   ───────────────────────────────────────────── */

export function listenKids(familyId, callback) {
  return onSnapshot(
    query(collection(db, 'families', familyId, 'kids'), orderBy('createdAt')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export function listenActivities(familyId, callback) {
  return onSnapshot(
    query(
      collection(db, 'families', familyId, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(100)
    ),
    snap => callback(snap.docs.map(d => ({
      id:    d.id,
      ...d.data(),
      ts:    d.data().createdAt?.toMillis?.() ?? Date.now(),
      kidId: d.data().kidId,
    })))
  )
}

export function listenSettings(familyId, callback) {
  return onSnapshot(
    doc(db, 'families', familyId, 'settings', 'main'),
    snap => snap.exists() && callback(snap.data())
  )
}
