/* ─────────────────────────────────────────────
   KidSpark — i18n (Español / English)
   Bilingual UI strings + game question sets
   ───────────────────────────────────────────── */

export const LANGS = [
  { code: 'es', label: 'Español', flag: '🇪🇸', speechLang: 'es-ES' },
  { code: 'en', label: 'English', flag: '🇺🇸', speechLang: 'en-US' },
]

/* ── UI Strings ──────────────────────────────── */
export const UI = {
  es: {
    greeting:       (name) => `¡Hola, ${name}! 🌈`,
    subGreeting:    '¿Qué vamos a aprender hoy?',
    gamesTitle:     '🎮 Juegos',
    videosTitle:    '📺 Videos de Aprendizaje',
    videosLocked:   '📵 Los videos están desactivados por tus papás',
    videosSafe:     'Solo contenido de YouTube Kids — supervisado y seguro',
    levelBadge:     (n) => `Nv.${n}`,
    correct:        '🎉 ¡Correcto!',
    wrong:          '😅 ¡Inténtalo de nuevo!',
    excellent:      '🌟 ¡Excelente!',
    tryAgain:       '💪 ¡Tú puedes!',
    instruction:    '¿Qué palabra es?',
    writeInstruct:  'Escribe el nombre:',
    logicInstruct:  '¿Qué sigue en la secuencia?',
    countInstruct:  '¿Cuántos hay? ¡Cuenta!',
    colorInstruct:  '¿De qué color es?',
    memoryInstruct: '¡Encuentra las parejas!',
    pairsFound:     (n, t) => `✅ Pareja encontrada! (${n}/${t})`,
    youWon:         (m) => `🏆 ¡Ganaste en ${m} movimientos!`,
    hint:           'Pista',
    close:          'Cerrar',
    playAgain:      '🔄 Jugar de nuevo',
    language:       'Idioma',
    goodMorning:    '¡Buenos días',
    goodAfternoon:  '¡Buenas tardes',
    goodEvening:    '¡Buenas noches',
  },
  en: {
    greeting:       (name) => `Hello, ${name}! 🌈`,
    subGreeting:    'What shall we learn today?',
    gamesTitle:     '🎮 Games',
    videosTitle:    '📺 Learning Videos',
    videosLocked:   '📵 Videos are disabled by your parents',
    videosSafe:     'Only curated educational content — safe for kids',
    levelBadge:     (n) => `Lv.${n}`,
    correct:        '🎉 Correct!',
    wrong:          '😅 Try again!',
    excellent:      '🌟 Excellent!',
    tryAgain:       '💪 You can do it!',
    instruction:    'What word is this?',
    writeInstruct:  'Write the name:',
    logicInstruct:  'What comes next in the sequence?',
    countInstruct:  'How many are there? Count!',
    colorInstruct:  'What color is it?',
    memoryInstruct: 'Find the matching pairs!',
    pairsFound:     (n, t) => `✅ Pair found! (${n}/${t})`,
    youWon:         (m) => `🏆 You won in ${m} moves!`,
    hint:           'Hint',
    close:          'Close',
    playAgain:      '🔄 Play again',
    language:       'Language',
    goodMorning:    'Good morning',
    goodAfternoon:  'Good afternoon',
    goodEvening:    'Good evening',
  },
}

/* ── LETRAS — bilingual word sets per level ──── */
export const LETRAS_EN = [
  {
    level: 1, name: 'Beginner', color: '#34D399',
    questions: [
      { hint: '🐱', answer: 'CAT',    category: 'Animal', speak: 'cat' },
      { hint: '🐶', answer: 'DOG',    category: 'Animal', speak: 'dog' },
      { hint: '🌙', answer: 'MOON',   category: 'Nature', speak: 'moon' },
      { hint: '🏠', answer: 'HOUSE',  category: 'Place',  speak: 'house' },
      { hint: '☀️', answer: 'SUN',    category: 'Nature', speak: 'sun' },
      { hint: '🌊', answer: 'SEA',    category: 'Nature', speak: 'sea' },
      { hint: '🍞', answer: 'BREAD',  category: 'Food',   speak: 'bread' },
      { hint: '🌲', answer: 'TREE',   category: 'Nature', speak: 'tree' },
    ]
  },
  {
    level: 2, name: 'Explorer', color: '#38BDF8',
    questions: [
      { hint: '🍎', answer: 'APPLE',     category: 'Fruit',   speak: 'apple' },
      { hint: '🐘', answer: 'ELEPHANT',  category: 'Animal',  speak: 'elephant' },
      { hint: '🦋', answer: 'BUTTERFLY', category: 'Insect',  speak: 'butterfly' },
      { hint: '🌸', answer: 'FLOWER',    category: 'Plant',   speak: 'flower' },
      { hint: '🐬', answer: 'DOLPHIN',   category: 'Animal',  speak: 'dolphin' },
      { hint: '🍓', answer: 'BERRY',     category: 'Fruit',   speak: 'berry' },
      { hint: '🎈', answer: 'BALLOON',   category: 'Toy',     speak: 'balloon' },
      { hint: '🚂', answer: 'TRAIN',     category: 'Vehicle', speak: 'train' },
      { hint: '🌈', answer: 'RAINBOW',   category: 'Nature',  speak: 'rainbow' },
    ]
  },
  {
    level: 3, name: 'Adventurer', color: '#A78BFA',
    questions: [
      { hint: '🦁', answer: 'LION',       category: 'Animal',  speak: 'lion' },
      { hint: '🐊', answer: 'CROCODILE',  category: 'Reptile', speak: 'crocodile' },
      { hint: '🌋', answer: 'VOLCANO',    category: 'Nature',  speak: 'volcano' },
      { hint: '🚀', answer: 'ROCKET',     category: 'Science', speak: 'rocket' },
      { hint: '🦅', answer: 'EAGLE',      category: 'Bird',    speak: 'eagle' },
      { hint: '🌵', answer: 'CACTUS',     category: 'Plant',   speak: 'cactus' },
      { hint: '🐢', answer: 'TURTLE',     category: 'Reptile', speak: 'turtle' },
      { hint: '🎸', answer: 'GUITAR',     category: 'Music',   speak: 'guitar' },
    ]
  },
  {
    level: 4, name: 'Champion', color: '#FBBF24',
    questions: [
      { hint: '🦒', answer: 'GIRAFFE',    category: 'Animal',  speak: 'giraffe' },
      { hint: '🐙', answer: 'OCTOPUS',    category: 'Animal',  speak: 'octopus' },
      { hint: '🌺', answer: 'HIBISCUS',   category: 'Plant',   speak: 'hibiscus' },
      { hint: '🎭', answer: 'THEATER',    category: 'Arts',    speak: 'theater' },
      { hint: '🦜', answer: 'PARROT',     category: 'Bird',    speak: 'parrot' },
      { hint: '🏔️', answer: 'MOUNTAIN',  category: 'Nature',  speak: 'mountain' },
    ]
  },
]

/* ── LÓGICA bilingual sets ────────────────────── */
export const LOGICA_EN = [
  {
    level: 1, name: 'Beginner', color: '#34D399',
    questions: [
      { prompt: "What's next?", sequence: '🔴 🔵 🔴 🔵 ❓', options: ['🟡','🔴','🟢'], correct: 1, hint: 'Alternating red and blue' },
      { prompt: "What's next?", sequence: '⭐ ⭐ 🌙 ⭐ ⭐ ❓', options: ['🌙','⭐','☀️'], correct: 0, hint: 'After two stars comes the moon' },
      { prompt: "What's next?", sequence: '🐱 🐶 🐱 🐶 ❓', options: ['🐸','🐱','🐶'], correct: 2, hint: 'Cat-dog alternating' },
    ]
  },
  {
    level: 2, name: 'Explorer', color: '#38BDF8',
    questions: [
      { prompt: "What's next?", sequence: '1  2  3  4  ❓', options: ['6','5','7'], correct: 1, hint: 'Count up by one' },
      { prompt: "What's next?", sequence: '2  4  6  8  ❓', options: ['9','10','11'], correct: 1, hint: 'Even numbers: +2 each time' },
      { prompt: "What's next?", sequence: '🌱 🌿 🌲 ❓', options: ['🌳','🌱','🍀'], correct: 0, hint: 'Plants grow bigger' },
    ]
  },
  {
    level: 3, name: 'Adventurer', color: '#A78BFA',
    questions: [
      { prompt: 'Which is different?', sequence: '🐶 🐶 🐱 🐶', options: ['🐶','🐱','🐰'], correct: 1, hint: 'Find the odd one out' },
      { prompt: "What's next?",        sequence: '10 20 30 40 ❓', options: ['45','50','55'], correct: 1, hint: '+10 each time' },
      { prompt: 'What fits the rule?', sequence: '🔴🔴 🔵🔵 🟢🟢 ❓', options: ['🟡','🟡🟡','🟡🟡🟡'], correct: 1, hint: 'Pairs of colors' },
    ]
  },
]

/* ── NUMBERS bilingual ───────────────────────── */
export const NUMEROS_EN = [
  {
    level: 1, name: 'Beginner', color: '#34D399',
    questions: [
      { items: '🍎🍎🍎', count: 3, options: ['2','3','4'], speak: 'three apples' },
      { items: '⭐⭐',    count: 2, options: ['1','2','3'], speak: 'two stars' },
      { items: '🐱🐱🐱🐱', count: 4, options: ['3','4','5'], speak: 'four cats' },
    ]
  },
  {
    level: 2, name: 'Explorer', color: '#38BDF8',
    questions: [
      { items: '🍎🍎🍎🍎🍎', count: 5,  options: ['4','5','6'],   speak: 'five apples' },
      { items: '🐢🐢🐢🐢🐢🐢', count: 6, options: ['5','6','7'],  speak: 'six turtles' },
      { items: '⭐⭐⭐⭐⭐⭐⭐', count: 7, options: ['6','7','8'],   speak: 'seven stars' },
    ]
  },
  {
    level: 3, name: 'Adventurer', color: '#A78BFA',
    questions: [
      { items: '🌸🌸🌸🌸🌸🌸🌸🌸', count: 8,  options: ['7','8','9'],    speak: 'eight flowers' },
      { items: '🚗🚗🚗🚗🚗🚗🚗🚗🚗', count: 9, options: ['8','9','10'],   speak: 'nine cars' },
      { items: '🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋', count: 10, options: ['9','10','11'], speak: 'ten butterflies' },
    ]
  },
]

/* ── WRITING bilingual ────────────────────────── */
export const ESCRITURA_EN = [
  {
    level: 1, name: 'Beginner', color: '#34D399',
    questions: [
      { hint: '🐱', answer: 'cat',  clue: 'It meows', speak: 'cat' },
      { hint: '🐶', answer: 'dog',  clue: 'It barks', speak: 'dog' },
      { hint: '☀️', answer: 'sun',  clue: 'Shines in the sky', speak: 'sun' },
    ]
  },
  {
    level: 2, name: 'Explorer', color: '#38BDF8',
    questions: [
      { hint: '🍎', answer: 'apple', clue: 'A red fruit',     speak: 'apple' },
      { hint: '🌊', answer: 'wave',  clue: 'In the ocean',    speak: 'wave' },
      { hint: '🌙', answer: 'moon',  clue: 'Shines at night', speak: 'moon' },
    ]
  },
  {
    level: 3, name: 'Adventurer', color: '#A78BFA',
    questions: [
      { hint: '🦋', answer: 'butterfly', clue: 'Beautiful flying insect', speak: 'butterfly' },
      { hint: '🌈', answer: 'rainbow',   clue: 'Appears after rain',      speak: 'rainbow' },
      { hint: '🚀', answer: 'rocket',    clue: 'Goes to space',           speak: 'rocket' },
    ]
  },
]
