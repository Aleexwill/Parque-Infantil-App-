import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ─────────────────────────────────────────────
   KidSpark — Global Store (Zustand + Persist)
   ───────────────────────────────────────────── */

const DEFAULT_KIDS = [
  { id: 'kid_1', name: 'Sofía',  age: 7, avatar: '🧒', color: '#4FC3F7', active: true,  pinEnabled: true  },
  { id: 'kid_2', name: 'Mateo',  age: 5, avatar: '👦', color: '#AB47BC', active: true,  pinEnabled: false },
  { id: 'kid_3', name: 'Luna',   age: 9, avatar: '👧', color: '#66BB6A', active: false, pinEnabled: true  },
]

const DEMO_ACTIVITY = [
  { id: 'a1', kidId: 'kid_1', type: 'game',  label: 'Lógica Genio',       detail: 'Completó nivel 3 · 8 min',       ts: Date.now() - 5*60*1000   },
  { id: 'a2', kidId: 'kid_1', type: 'video', label: 'Sistema Solar',      detail: 'YouTube Kids · 7 min',           ts: Date.now() - 20*60*1000  },
  { id: 'a3', kidId: 'kid_1', type: 'game',  label: 'Aprendo Letras',     detail: 'Nivel 4 · ⭐⭐⭐ · 12 min',      ts: Date.now() - 35*60*1000  },
  { id: 'a4', kidId: 'kid_1', type: 'lock',  label: 'Intento de salida',  detail: 'Patrón incorrecto · Bloqueado',  ts: Date.now() - 48*60*1000  },
  { id: 'a5', kidId: 'kid_2', type: 'game',  label: 'Números Mágicos',    detail: 'Nivel 2 · ⭐⭐ · 9 min',        ts: Date.now() - 3*60*60*1000 },
  { id: 'a6', kidId: 'kid_2', type: 'game',  label: 'Colores y Formas',   detail: 'Nivel 1 · ⭐ · 5 min',          ts: Date.now() - 4*60*60*1000 },
  { id: 'a7', kidId: 'kid_1', type: 'game',  label: 'Juego de Memoria',   detail: 'Completó · 6 min',              ts: Date.now() - 5*60*60*1000 },
]

const DEFAULT_SETTINGS = {
  youtubeEnabled: true,
  dailyLimitEnabled: true,
  dailyLimitMinutes: 120,
  notificationsEnabled: true,
  gamesOnlyMode: false,
  pattern: [0, 1, 4, 7, 8],  // top-left → top-center → center → bottom-center → bottom-right
}

export const useStore = create(
  persist(
    (set, get) => ({
      /* ── Auth ── */
      adminUnlocked: false,
      setAdminUnlocked: (v) => set({ adminUnlocked: v }),

      /* ── Active kid session ── */
      activeKidId: 'kid_1',
      setActiveKidId: (id) => set({ activeKidId: id }),

      /* ── Kids profiles ── */
      kids: DEFAULT_KIDS,
      addKid: (kid) => set((s) => ({ kids: [...s.kids, { ...kid, id: `kid_${Date.now()}` }] })),
      updateKid: (id, patch) => set((s) => ({ kids: s.kids.map(k => k.id === id ? { ...k, ...patch } : k) })),
      removeKid: (id) => set((s) => ({ kids: s.kids.filter(k => k.id !== id) })),
      blockKid:  (id) => set((s) => ({ kids: s.kids.map(k => k.id === id ? { ...k, active: false } : k) })),

      /* ── Activity log ── */
      activities: DEMO_ACTIVITY,
      logActivity: (entry) => set((s) => ({
        activities: [{ ...entry, id: `a_${Date.now()}`, ts: Date.now() }, ...s.activities].slice(0, 200)
      })),

      /* ── Settings ── */
      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      updatePattern: (pattern) => set((s) => ({ settings: { ...s.settings, pattern } })),

      /* ── Daily time tracking ── */
      todayTime: { kid_1: 84, kid_2: 54, kid_3: 0 },  // minutes
      addTime: (kidId, minutes) => set((s) => ({
        todayTime: { ...s.todayTime, [kidId]: (s.todayTime[kidId] || 0) + minutes }
      })),

      /* ── Weekly chart data ── */
      weeklyData: [45, 70, 35, 85, 60, 90, 75],  // minutes per day Mon-Sun

      /* ── Level progress per kid per game ── */
      // Shape: { kid_id: { game_id: { level, xp, questionsAnswered, bestStreak } } }
      levelProgress: {},
      getLevelProgress: (kidId, gameId) => {
        const s = get()
        return s.levelProgress?.[kidId]?.[gameId] ?? { level: 1, xp: 0, questionsAnswered: 0, bestStreak: 0 }
      },
      updateLevelProgress: (kidId, gameId, patch) => set((s) => ({
        levelProgress: {
          ...s.levelProgress,
          [kidId]: {
            ...(s.levelProgress[kidId] || {}),
            [gameId]: {
              ...(s.levelProgress?.[kidId]?.[gameId] ?? { level: 1, xp: 0, questionsAnswered: 0, bestStreak: 0 }),
              ...patch,
            }
          }
        }
      })),

      /* ── Badges / achievements ── */
      // Shape: { kid_id: [badgeId, ...] }
      earnedBadges: {},
      awardBadge: (kidId, badgeId) => set((s) => {
        const current = s.earnedBadges[kidId] || []
        if (current.includes(badgeId)) return s  // already earned
        return { earnedBadges: { ...s.earnedBadges, [kidId]: [...current, badgeId] } }
      }),
      getEarnedBadges: (kidId) => get().earnedBadges[kidId] || [],
    }),
    {
      name: 'kidspark-storage',
      partialize: (s) => ({
        kids: s.kids,
        settings: s.settings,
        activities: s.activities.slice(0, 50),
        todayTime: s.todayTime,
        levelProgress: s.levelProgress,
        earnedBadges: s.earnedBadges,
      })
    }
  )
)
