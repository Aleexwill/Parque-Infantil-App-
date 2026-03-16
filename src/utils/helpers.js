/* ─────────────────────────────────────────────
   KidSpark — Utility helpers
   ───────────────────────────────────────────── */

/** Format minutes → "1h 24m" or "45 min" */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Format timestamp → relative "Hace 5 min" */
export function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60)   return 'Justo ahora'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`
  return `Hace ${Math.floor(diff / 86400)}d`
}

/** Activity type → icon + color */
export const ACTIVITY_META = {
  game:  { icon: '🎮', label: 'Juego',  color: '#38BDF8', bg: '#0C2340' },
  video: { icon: '📺', label: 'Video',  color: '#A78BFA', bg: '#1A0F30' },
  lock:  { icon: '🔒', label: 'Bloqueo',color: '#FBBF24', bg: '#2A1E00' },
  login: { icon: '👋', label: 'Sesión', color: '#34D399', bg: '#062014' },
}

/** Days of week in Spanish */
export const DAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

/** Games catalog */
export const GAMES = [
  {
    id: 'letras',
    title: 'Aprendo Letras',
    titleEn: 'Learn Letters',
    category: 'Lectura',
    categoryEn: 'Reading',
    icon: '📖',
    gradient: ['#FFF9C4', '#FFF176'],
    maxLevels: 8,
    badge: null,
  },
  {
    id: 'escritura',
    title: 'Escritura Fun',
    titleEn: 'Fun Writing',
    category: 'Escritura',
    categoryEn: 'Writing',
    icon: '✏️',
    gradient: ['#E1F5FE', '#B3E5FC'],
    maxLevels: 8,
    badge: null,
  },
  {
    id: 'logica',
    title: 'Lógica Genio',
    titleEn: 'Logic Genius',
    category: 'Lógica',
    categoryEn: 'Logic',
    icon: '🧩',
    gradient: ['#F3E5F5', '#E1BEE7'],
    maxLevels: 8,
    badge: '🆕',
  },
  {
    id: 'numeros',
    title: 'Números Mágicos',
    titleEn: 'Magic Numbers',
    category: 'Matemáticas',
    categoryEn: 'Math',
    icon: '🔢',
    gradient: ['#E8F5E9', '#C8E6C9'],
    maxLevels: 8,
    badge: null,
  },
  {
    id: 'colores',
    title: 'Colores y Formas',
    titleEn: 'Colors & Shapes',
    category: 'Creatividad',
    categoryEn: 'Creativity',
    icon: '🎨',
    gradient: ['#FBE9E7', '#FFCCBC'],
    maxLevels: 4,
    badge: null,
  },
  {
    id: 'memoria',
    title: 'Juego de Memoria',
    titleEn: 'Memory Game',
    category: 'Concentración',
    categoryEn: 'Focus',
    icon: '🃏',
    gradient: ['#E8EAF6', '#C5CAE9'],
    maxLevels: 4,
    badge: null,
  },
  {
    id: 'silabas',
    title: 'Sílabas',
    titleEn: 'Syllables',
    category: 'Lectura',
    categoryEn: 'Reading',
    icon: '📝',
    gradient: ['#E0F7FA', '#B2EBF2'],
    maxLevels: 4,
    badge: '🆕',
  },
  {
    id: 'lectura',
    title: 'Comprensión Lectora',
    titleEn: 'Reading Comprehension',
    category: 'Lectura',
    categoryEn: 'Reading',
    icon: '📚',
    gradient: ['#FCE4EC', '#F8BBD0'],
    maxLevels: 4,
    badge: '🆕',
  },
]

/** Generate star string */
export function stars(n) {
  return '⭐'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))
}
