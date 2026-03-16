import { useState, useEffect, useCallback } from 'react'
import {
  getFamily, getKids, getSettings, getActivities,
  getTodayTime, getWeeklyData,
  addKid as fbAddKid, updateKid as fbUpdateKid, deleteKid as fbDeleteKid,
  updateSettings as fbUpdateSettings,
  logActivity as fbLogActivity, addDailyTime as fbAddDailyTime,
  listenKids, listenActivities, listenSettings,
} from '@/lib/firebase'

/* ─────────────────────────────────────────────
   useFamily — All family data from Firestore
   Real-time listeners via onSnapshot
   ───────────────────────────────────────────── */

export function useFamily(uid) {
  const [family,     setFamily]     = useState(null)
  const [kids,       setKids]       = useState([])
  const [settings,   setSettings]   = useState(null)
  const [activities, setActivities] = useState([])
  const [todayTime,  setTodayTime]  = useState({})
  const [weeklyData, setWeeklyData] = useState([0,0,0,0,0,0,0])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [activeKidId, setActiveKidId] = useState(null)

  // Level progress & badges — localStorage per user
  const [levelProgress, setLevelProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_lp_' + uid) || '{}') } catch { return {} }
  })
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_badges_' + uid) || '{}') } catch { return {} }
  })

  useEffect(() => {
    if (!uid) return
    try { localStorage.setItem('ks_lp_' + uid, JSON.stringify(levelProgress)) } catch {}
  }, [levelProgress, uid])

  useEffect(() => {
    if (!uid) return
    try { localStorage.setItem('ks_badges_' + uid, JSON.stringify(earnedBadges)) } catch {}
  }, [earnedBadges, uid])

  // ── Initial load ──
  useEffect(() => {
    if (!uid) return
    setLoading(true)

    Promise.all([
      getFamily(uid),
      getTodayTime(uid),
      getWeeklyData(uid),
    ]).then(([fam, today, weekly]) => {
      setFamily(fam)
      setTodayTime(today)
      setWeeklyData(weekly)
    }).catch(err => {
      console.error('[useFamily] init error:', err)
      setError(err.message)
    }).finally(() => setLoading(false))
  }, [uid])

  // ── Real-time listeners ──
  useEffect(() => {
    if (!uid) return

    const unsubKids = listenKids(uid, data => {
      setKids(data)
      setActiveKidId(prev => prev || data.find(k => k.active)?.id || null)
    })

    const unsubActs = listenActivities(uid, data => setActivities(data))

    const unsubSettings = listenSettings(uid, data => setSettings(data))

    return () => { unsubKids(); unsubActs(); unsubSettings() }
  }, [uid])

  // ── Kids ──
  const addKid = useCallback(async (kidData) => {
    const newKid = await fbAddKid(uid, kidData)
    setActiveKidId(prev => prev || newKid.id)
    return newKid
  }, [uid])

  const updateKid = useCallback(async (kidId, patch) => {
    await fbUpdateKid(uid, kidId, patch)
    // listener will update kids state automatically
  }, [uid])

  const blockKid = useCallback((kidId) => updateKid(kidId, { active: false }), [updateKid])

  const removeKid = useCallback(async (kidId) => {
    await fbDeleteKid(uid, kidId)
    setActiveKidId(prev => prev === kidId ? null : prev)
  }, [uid])

  // ── Settings ──
  const updateSettings = useCallback((patch) => {
    return fbUpdateSettings(uid, patch)
    // listener will update settings state automatically
  }, [uid])

  const updatePattern = useCallback((pattern) => {
    return fbUpdateSettings(uid, { lockPattern: pattern })
  }, [uid])

  // ── Activity ──
  const logActivity = useCallback(async (entry) => {
    try {
      return await fbLogActivity(uid, entry)
    } catch (err) { console.error('[useFamily] logActivity:', err) }
  }, [uid])

  const addTime = useCallback(async (kidId, minutes) => {
    try {
      await fbAddDailyTime(uid, kidId, minutes)
      setTodayTime(prev => ({ ...prev, [kidId]: (prev[kidId] || 0) + minutes }))
    } catch (err) { console.error('[useFamily] addTime:', err) }
  }, [uid])

  // ── Level progress & badges (localStorage) ──
  const updateLevelProgress = useCallback((kidId, gameId, patch) => {
    setLevelProgress(prev => ({
      ...prev,
      [kidId]: {
        ...(prev[kidId] || {}),
        [gameId]: {
          ...(prev[kidId]?.[gameId] ?? { level: 1, xp: 0, questionsAnswered: 0, bestStreak: 0 }),
          ...patch,
        },
      },
    }))
  }, [])

  const awardBadge = useCallback((kidId, badgeId) => {
    setEarnedBadges(prev => {
      const current = prev[kidId] || []
      if (current.includes(badgeId)) return prev
      return { ...prev, [kidId]: [...current, badgeId] }
    })
  }, [])

  // Settings are stored in camelCase in Firestore directly
  const normSettings = settings ? {
    youtubeEnabled:       settings.youtubeEnabled       ?? true,
    dailyLimitEnabled:    settings.dailyLimitEnabled     ?? true,
    dailyLimitMinutes:    settings.dailyLimitMinutes     ?? 120,
    notificationsEnabled: settings.notificationsEnabled  ?? true,
    gamesOnlyMode:        settings.gamesOnlyMode         ?? false,
    pattern:              settings.lockPattern           ?? [0,1,4,7,8],
    notifyLockAttempt:    settings.notifyLockAttempt     ?? true,
    notifyTimeLimit:      settings.notifyTimeLimit       ?? true,
    notifySessionStart:   settings.notifySessionStart    ?? false,
    notifyGameComplete:   settings.notifyGameComplete     ?? false,
  } : null

  return {
    family, kids, settings: normSettings,
    activities, todayTime, weeklyData,
    loading, error, activeKidId, levelProgress, earnedBadges,
    setActiveKidId, addKid, updateKid, blockKid, removeKid,
    updateSettings, updatePattern, logActivity, addTime,
    updateLevelProgress, awardBadge,
    reload: () => {},
  }
}
