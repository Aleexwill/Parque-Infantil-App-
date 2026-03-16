/* ═══════════════════════════════════════════════════════════
   KidSpark — Game Content Database
   Niveles progresivos para los 6 juegos
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   📖 APRENDO LETRAS — 4 niveles
   Nivel 1: 3-4 letras | Nivel 2: 5-6 letras
   Nivel 3: 7-8 letras | Nivel 4: 9+ / difícil
   ───────────────────────────────────────── */
export const LETRAS_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { hint: '🐱', answer: 'GATO',  category: 'Animal' },
      { hint: '🐶', answer: 'PERRO', category: 'Animal' },
      { hint: '🌙', answer: 'LUNA',  category: 'Naturaleza' },
      { hint: '🏠', answer: 'CASA',  category: 'Lugar' },
      { hint: '☀️', answer: 'SOL',   category: 'Naturaleza' },
      { hint: '🌊', answer: 'MAR',   category: 'Naturaleza' },
      { hint: '🌲', answer: 'ARBOL', category: 'Naturaleza' },
      { hint: '🍞', answer: 'PAN',   category: 'Comida' },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { hint: '🍎', answer: 'MANZANA',  category: 'Fruta' },
      { hint: '🐘', answer: 'ELEFANTE', category: 'Animal' },
      { hint: '🦋', answer: 'MARIPOSA', category: 'Insecto' },
      { hint: '🌸', answer: 'FLORES',   category: 'Planta' },
      { hint: '🐬', answer: 'DELFIN',   category: 'Animal' },
      { hint: '🍓', answer: 'FRESA',    category: 'Fruta' },
      { hint: '🎈', answer: 'GLOBO',    category: 'Juguete' },
      { hint: '🚂', answer: 'TREN',     category: 'Vehículo' },
      { hint: '🌈', answer: 'ARCOIRIS', category: 'Naturaleza' },
      { hint: '🐙', answer: 'PULPO',    category: 'Animal' },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { hint: '🦁', answer: 'LEON',       category: 'Animal' },
      { hint: '🐊', answer: 'COCODRILO',  category: 'Reptil' },
      { hint: '🌋', answer: 'VOLCAN',     category: 'Naturaleza' },
      { hint: '🚀', answer: 'COHETE',     category: 'Ciencia' },
      { hint: '🦅', answer: 'AGUILA',     category: 'Ave' },
      { hint: '🌵', answer: 'CACTUS',     category: 'Planta' },
      { hint: '🐢', answer: 'TORTUGA',    category: 'Reptil' },
      { hint: '🎸', answer: 'GUITARRA',   category: 'Música' },
      { hint: '🏔️', answer: 'MONTANA',   category: 'Naturaleza' },
      { hint: '🦒', answer: 'JIRAFA',     category: 'Animal' },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { hint: '🦖', answer: 'DINOSAURIO',  category: 'Prehistórico' },
      { hint: '🌍', answer: 'CONTINENTE',  category: 'Geografía' },
      { hint: '🦈', answer: 'TIBURON',     category: 'Animal' },
      { hint: '🎭', answer: 'TEATRO',      category: 'Arte' },
      { hint: '🔭', answer: 'TELESCOPIO',  category: 'Ciencia' },
      { hint: '🦩', answer: 'FLAMENCO',    category: 'Ave' },
      { hint: '🌺', answer: 'HIBISCO',     category: 'Planta' },
      { hint: '🐉', answer: 'DRAGON',      category: 'Fantasía' },
      { hint: '🏛️', answer: 'PIRAMIDE',   category: 'Historia' },
      { hint: '🧬', answer: 'CIENCIA',     category: 'Educación' },
    ]
  },
]

/* ─────────────────────────────────────────
   ✏️ ESCRITURA FUN — 4 niveles
   ───────────────────────────────────────── */
export const ESCRITURA_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { hint: '🐱', answer: 'gato',    clue: 'Animal que maúlla 🐾' },
      { hint: '🐶', answer: 'perro',   clue: 'Animal que ladra 🦴' },
      { hint: '☀️', answer: 'sol',     clue: 'Nos da calor y luz ☀️' },
      { hint: '🌙', answer: 'luna',    clue: 'Brilla de noche 🌃' },
      { hint: '🌊', answer: 'mar',     clue: 'Agua salada 🌊' },
      { hint: '🌲', answer: 'arbol',   clue: 'Tiene ramas y hojas 🍃' },
      { hint: '🍎', answer: 'manzana', clue: 'Fruta roja o verde 🍎' },
      { hint: '🏠', answer: 'casa',    clue: 'Donde vivimos 🏡' },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { hint: '🦋', answer: 'mariposa', clue: 'Insecto con alas de colores 🌸' },
      { hint: '🐘', answer: 'elefante', clue: 'Animal enorme con trompa 🐘' },
      { hint: '🌈', answer: 'arcoiris', clue: 'Aparece después de la lluvia 🌧️' },
      { hint: '🚀', answer: 'cohete',   clue: 'Va al espacio 🌌' },
      { hint: '🎈', answer: 'globo',    clue: 'Vuela con aire 🎉' },
      { hint: '🐬', answer: 'delfin',   clue: 'Mamífero del océano 🌊' },
      { hint: '🍓', answer: 'fresa',    clue: 'Fruta roja pequeña 🍓' },
      { hint: '🎸', answer: 'guitarra', clue: 'Instrumento de cuerdas 🎵' },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { hint: '🦒', answer: 'jirafa',     clue: 'Animal de cuello muy largo 🌿' },
      { hint: '🌋', answer: 'volcan',     clue: 'Montaña que lanza lava 🔥' },
      { hint: '🐊', answer: 'cocodrilo',  clue: 'Reptil con muchos dientes 🦷' },
      { hint: '🎭', answer: 'teatro',     clue: 'Donde actúan los actores 🎬' },
      { hint: '🏔️', answer: 'montana',   clue: 'Elevación de tierra muy alta ⛰️' },
      { hint: '🦅', answer: 'aguila',     clue: 'Ave grande que vuela alto 🌬️' },
      { hint: '🐢', answer: 'tortuga',    clue: 'Reptil con caparazón 🐢' },
      { hint: '🔭', answer: 'telescopio', clue: 'Para ver las estrellas 🌟' },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { hint: '🦖', answer: 'dinosaurio',  clue: 'Vivió hace millones de años 🦕' },
      { hint: '🦈', answer: 'tiburon',     clue: 'Pez depredador del mar 🌊' },
      { hint: '🧲', answer: 'magnetismo',  clue: 'Fuerza que atrae el hierro 🔩' },
      { hint: '🌍', answer: 'hemisferio',  clue: 'Mitad del planeta Tierra 🗺️' },
      { hint: '🦩', answer: 'flamenco',    clue: 'Ave rosada de patas largas 🌺' },
      { hint: '🏛️', answer: 'piramide',   clue: 'Construcción de Egipto 🏜️' },
      { hint: '🦋', answer: 'metamorfosis',clue: 'Transformación de oruga a mariposa 🐛' },
      { hint: '🌌', answer: 'galaxia',     clue: 'Sistema de millones de estrellas ✨' },
    ]
  },
]

/* ─────────────────────────────────────────
   🧩 LÓGICA GENIO — 4 niveles
   ───────────────────────────────────────── */
export const LOGICA_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { prompt: '¿Cuál sigue?',   sequence: '🔴 🔵 🔴 🔵 ❓',  options: ['🟡','🔴','🟢'], correct: 1, hint: 'Rojo y azul se alternan' },
      { prompt: '¿Cuál sigue?',   sequence: '1 — 2 — 3 — 4 — ❓', options: ['6','5','7'],   correct: 1, hint: 'Sumas 1 cada vez' },
      { prompt: '¿Cuál igual?',   sequence: '🐶 🐶 🐶 ❓',      options: ['🐱','🐶','🐸'], correct: 1, hint: 'Busca el mismo animal' },
      { prompt: '¿Cuál sigue?',   sequence: '🌑 🌒 🌓 ❓',      options: ['🌔','🌕','🌙'], correct: 0, hint: 'La luna va creciendo' },
      { prompt: '¿Cuántos hay?',  sequence: '⭐ + ⭐⭐ = ❓',   options: ['4','3','2'],    correct: 1, hint: '1 más 2 es...' },
      { prompt: '¿Cuál sigue?',   sequence: '🟥 🟦 🟩 🟥 🟦 ❓', options: ['🟥','🟩','🟦'],  correct: 1, hint: 'Sigue el patrón de 3' },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { prompt: '¿Cuál sigue?',   sequence: '2 — 4 — 6 — 8 — ❓',  options: ['9','10','11'],   correct: 1, hint: 'Sumas 2 cada vez' },
      { prompt: '¿Qué falta?',    sequence: '🐣 → 🐤 → ❓ → 🐔',   options: ['🥚','🐥','🦅'],  correct: 1, hint: 'El pollito crece' },
      { prompt: '¿Cuál sigue?',   sequence: '⬛ ⬜ ⬛ ⬜ ⬛ ❓',  options: ['⬛','⬜','🟥'],   correct: 1, hint: 'Negro y blanco se alternan' },
      { prompt: '¿Cuántos hay?',  sequence: '🍎🍎🍎 + 🍎🍎 = ❓',  options: ['6','5','4'],     correct: 1, hint: '3 más 2 es...' },
      { prompt: '¿Cuál es mayor?',sequence: '🐭 🐇 🐘',            options: ['El ratón','El conejo','El elefante'], correct: 2, hint: 'Piensa en su tamaño' },
      { prompt: '¿Cuál sigue?',   sequence: '🌱 → 🌿 → 🌳 → ❓',   options: ['🌻','🪵','🍂'],  correct: 1, hint: 'El árbol va creciendo' },
      { prompt: '¿Cuál falta?',   sequence: 'A B C ❓ E',           options: ['D','F','B'],     correct: 0, hint: 'Es el abecedario' },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { prompt: '¿Cuál sigue?',   sequence: '1 — 3 — 5 — 7 — ❓',   options: ['8','9','10'],   correct: 1, hint: 'Son los números impares' },
      { prompt: '¿Qué falta?',    sequence: '🔺 🔷 🔺 🔷 ❓',       options: ['🔷','🔺','🔶'],  correct: 0, hint: 'Triángulo y diamante se alternan' },
      { prompt: '¿Cuánto es?',    sequence: '10 − 3 = ❓',           options: ['6','7','8'],    correct: 1, hint: 'Resta del 10' },
      { prompt: '¿Cuál sigue?',   sequence: '🌤️ → ☁️ → 🌧️ → ⛈️ → ❓', options: ['🌈','❄️','💨'], correct: 0, hint: 'Después de la tormenta...' },
      { prompt: '¿Cuál es menor?',sequence: '🦏 🐦 🦊',             options: ['El rinoceronte','El pájaro','El zorro'], correct: 1, hint: '¿Cuál pesa menos?' },
      { prompt: '¿Cuál sigue?',   sequence: '5 — 10 — 15 — 20 — ❓', options: ['22','25','30'], correct: 1, hint: 'Sumas 5 cada vez' },
      { prompt: '¿Qué viene antes?', sequence: '❓ → Huevo → Gallina', options: ['Gallo','Pollito','Nada'], correct: 1, hint: '¿Qué sale del huevo primero?' },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { prompt: '¿Cuánto es?',    sequence: '7 × 3 = ❓',            options: ['18','21','24'],  correct: 1, hint: 'Suma 7 tres veces' },
      { prompt: '¿Cuál sigue?',   sequence: '1 — 1 — 2 — 3 — 5 — ❓',options: ['7','8','6'],    correct: 1, hint: 'Suma los dos anteriores' },
      { prompt: '¿Qué falta?',    sequence: 'Sol → Tierra → ❓ → Marte',options: ['Mercurio','Venus','Júpiter'], correct: 1, hint: 'Planetas del sistema solar' },
      { prompt: '¿Cuánto es?',    sequence: '100 ÷ 4 = ❓',           options: ['20','25','30'],  correct: 1, hint: 'Divide 100 en 4 partes' },
      { prompt: '¿Qué sigue?',    sequence: 'I II III IV ❓',         options: ['V','VI','IV'],   correct: 0, hint: 'Son números romanos' },
      { prompt: '¿Cuánto es?',    sequence: '13 + 17 = ❓',           options: ['28','30','32'],  correct: 1, hint: 'Suma las decenas y las unidades' },
      { prompt: '¿Qué falta?',    sequence: '🧊 → 💧 → ❓ → ☁️',    options: ['🌬️','♨️','🌊'], correct: 1, hint: 'El ciclo del agua' },
    ]
  },
]

/* ─────────────────────────────────────────
   🔢 NÚMEROS MÁGICOS — 4 niveles
   Nivel 1: Contar hasta 5
   Nivel 2: Contar hasta 10, sumas simples
   Nivel 3: Restas, sumas mayores
   Nivel 4: Multiplicación, división
   ───────────────────────────────────────── */
export const NUMEROS_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { type: 'count', items: '🍎🍎🍎',          count: 3,  options: ['2','3','4']  },
      { type: 'count', items: '⭐⭐',             count: 2,  options: ['1','2','3']  },
      { type: 'count', items: '🌟🌟🌟🌟🌟',      count: 5,  options: ['4','5','6']  },
      { type: 'count', items: '🐶🐶🐶🐶',        count: 4,  options: ['3','4','5']  },
      { type: 'count', items: '🍓',               count: 1,  options: ['1','2','3']  },
      { type: 'count', items: '🌈🌈🌈🌈🌈🌈',   count: 6,  options: ['5','6','7']  },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { type: 'count', items: '🍕🍕🍕🍕🍕🍕🍕', count: 7,  options: ['6','7','8']  },
      { type: 'sum',   display: '3 + 4 = ?',       count: 7,  options: ['6','7','8']  },
      { type: 'sum',   display: '5 + 3 = ?',       count: 8,  options: ['7','8','9']  },
      { type: 'count', items: '🏀🏀🏀🏀🏀🏀🏀🏀🏀', count: 9, options: ['8','9','10'] },
      { type: 'sum',   display: '2 + 6 = ?',       count: 8,  options: ['7','8','9']  },
      { type: 'count', items: '🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺', count: 10, options: ['9','10','11'] },
      { type: 'sum',   display: '4 + 5 = ?',       count: 9,  options: ['8','9','10'] },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { type: 'sub',  display: '10 − 4 = ?',  count: 6,  options: ['5','6','7']  },
      { type: 'sum',  display: '7 + 8 = ?',   count: 15, options: ['14','15','16'] },
      { type: 'sub',  display: '15 − 7 = ?',  count: 8,  options: ['7','8','9']  },
      { type: 'sum',  display: '12 + 9 = ?',  count: 21, options: ['20','21','22'] },
      { type: 'sub',  display: '20 − 6 = ?',  count: 14, options: ['13','14','15'] },
      { type: 'sum',  display: '16 + 7 = ?',  count: 23, options: ['22','23','24'] },
      { type: 'sub',  display: '30 − 15 = ?', count: 15, options: ['14','15','16'] },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { type: 'mul',  display: '3 × 4 = ?',   count: 12, options: ['11','12','13'] },
      { type: 'mul',  display: '5 × 5 = ?',   count: 25, options: ['24','25','26'] },
      { type: 'div',  display: '20 ÷ 4 = ?',  count: 5,  options: ['4','5','6']   },
      { type: 'mul',  display: '6 × 7 = ?',   count: 42, options: ['40','42','44'] },
      { type: 'div',  display: '36 ÷ 6 = ?',  count: 6,  options: ['5','6','7']   },
      { type: 'mul',  display: '8 × 9 = ?',   count: 72, options: ['70','72','74'] },
      { type: 'div',  display: '100 ÷ 5 = ?', count: 20, options: ['15','20','25'] },
    ]
  },
]

/* ─────────────────────────────────────────
   🎨 COLORES Y FORMAS — 4 niveles
   ───────────────────────────────────────── */
export const COLORES_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { hint: '🌤️',  question: '¿De qué color es el cielo?',    options: ['🟡 Amarillo','🔵 Azul','🔴 Rojo'],     correct: 1 },
      { hint: '🌿',  question: '¿De qué color es la hierba?',   options: ['🟢 Verde','🟣 Morado','⚫ Negro'],     correct: 0 },
      { hint: '🍌',  question: '¿De qué color es el plátano?',  options: ['⚫ Negro','🔴 Rojo','🟡 Amarillo'],    correct: 2 },
      { hint: '🍅',  question: '¿De qué color es el tomate?',   options: ['🔴 Rojo','🔵 Azul','🟢 Verde'],       correct: 0 },
      { hint: '🐻',  question: '¿De qué color es el oso?',      options: ['🟢 Verde','🟤 Marrón','🔵 Azul'],     correct: 1 },
      { hint: '❄️',  question: '¿De qué color es la nieve?',    options: ['⚪ Blanco','🔴 Rojo','🟡 Amarillo'],  correct: 0 },
      { hint: '🍊',  question: '¿De qué color es la naranja?',  options: ['🟡 Amarillo','🔴 Rojo','🟠 Naranja'], correct: 2 },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { hint: '▲',   question: '¿Cómo se llama esta figura?',      options: ['Cuadrado','Triángulo','Círculo'],   correct: 1 },
      { hint: '●',   question: '¿Cómo se llama esta figura?',      options: ['Círculo','Triángulo','Rectángulo'], correct: 0 },
      { hint: '■',   question: '¿Cómo se llama esta figura?',      options: ['Cuadrado','Óvalo','Hexágono'],      correct: 0 },
      { hint: '🟣',  question: '¿Cómo se llama este color?',       options: ['Azul','Morado','Rosado'],           correct: 1 },
      { hint: '🟠',  question: '¿Cómo se llama este color?',       options: ['Rojo','Amarillo','Naranja'],        correct: 2 },
      { hint: '⬭',   question: '¿Cómo se llama esta figura?',      options: ['Círculo','Óvalo','Rombo'],          correct: 1 },
      { hint: '🔷',  question: '¿Cómo se llama esta figura?',      options: ['Triángulo','Diamante','Cuadrado'],  correct: 1 },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { hint: '⬡',   question: '¿Cuántos lados tiene un hexágono?',  options: ['5','6','7'],              correct: 1 },
      { hint: '⬠',   question: '¿Cuántos lados tiene un pentágono?', options: ['4','5','6'],              correct: 1 },
      { hint: '🔺🔺', question: '¿Cuántos ángulos tienen 2 triángulos?', options: ['4','6','8'],          correct: 1 },
      { hint: '🎨',   question: 'Rojo + Azul =',                      options: ['Morado','Verde','Naranja'], correct: 0 },
      { hint: '🎨',   question: 'Rojo + Amarillo =',                  options: ['Morado','Naranja','Verde'], correct: 1 },
      { hint: '🎨',   question: 'Azul + Amarillo =',                  options: ['Naranja','Morado','Verde'], correct: 2 },
      { hint: '🔲',   question: '¿Cuántos lados tiene un cuadrado?',  options: ['3','4','5'],              correct: 1 },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { hint: '📐',   question: '¿Cuántos grados tiene un triángulo?',    options: ['90°','180°','360°'],    correct: 1 },
      { hint: '🔵',   question: '¿Cómo se llama el punto central del círculo?', options: ['Radio','Centro','Diámetro'], correct: 1 },
      { hint: '🎨',   question: 'Rojo + Blanco =',                         options: ['Rosado','Naranja','Beige'], correct: 0 },
      { hint: '⬛',   question: '¿Cuántos vértices tiene un cubo?',        options: ['6','8','12'],           correct: 1 },
      { hint: '📐',   question: '¿Cuántos grados tiene un ángulo recto?',  options: ['45°','90°','180°'],     correct: 1 },
      { hint: '🎨',   question: 'Negro + Blanco =',                         options: ['Gris','Azul','Beige'],  correct: 0 },
      { hint: '🔷',   question: '¿Cuántos lados tiene un rombo?',           options: ['3','4','5'],            correct: 1 },
    ]
  },
]

/* ─────────────────────────────────────────
   🃏 MEMORIA — 4 niveles por dificultad
   Nivel 1: 8 cartas (4 pares)
   Nivel 2: 12 cartas (6 pares)
   Nivel 3: 16 cartas (8 pares) — temática
   Nivel 4: 20 cartas (10 pares) — tiempos
   ───────────────────────────────────────── */
export const MEMORIA_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    pairs: ['🐶','🐱','🐸','🐻'],
    timeLimit: null,
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    pairs: ['🦊','🐼','🐨','🦁','🐯','🐺'],
    timeLimit: null,
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    pairs: ['🍎','🍊','🍋','🍇','🍓','🍒','🍑','🍍'],
    timeLimit: 60,   // segundos
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    pairs: ['🚀','🛸','🌍','🌙','⭐','☀️','🪐','🌠','🌌','🔭'],
    timeLimit: 90,
  },
]

/* ─────────────────────────────────────────
   🏆 Sistema de logros (badges)
   ───────────────────────────────────────── */
export const BADGES = [
  { id: 'first_game',  icon: '🌱', label: 'Primera partida',    condition: 'Juega cualquier juego por primera vez' },
  { id: 'streak_3',    icon: '🔥', label: 'Racha de 3',         condition: '3 respuestas correctas seguidas' },
  { id: 'streak_5',    icon: '⚡', label: 'Racha de 5',         condition: '5 respuestas correctas seguidas' },
  { id: 'score_50',    icon: '⭐', label: '50 puntos',           condition: 'Alcanzar 50 puntos en una sesión' },
  { id: 'score_100',   icon: '🌟', label: '100 puntos',          condition: 'Alcanzar 100 puntos en una sesión' },
  { id: 'level_2',     icon: '📈', label: 'Nivel 2',             condition: 'Completar el nivel 1 de cualquier juego' },
  { id: 'level_3',     icon: '🚀', label: 'Nivel 3',             condition: 'Completar el nivel 2 de cualquier juego' },
  { id: 'level_4',     icon: '👑', label: 'Campeón',             condition: 'Alcanzar el nivel 4 en algún juego' },
  { id: 'memory_win',  icon: '🧠', label: 'Súper memoria',       condition: 'Ganar el juego de memoria en nivel 3+' },
  { id: 'all_games',   icon: '🎮', label: 'Gamer total',         condition: 'Jugar los 6 juegos al menos una vez' },
]

/* ═══════════════════════════════════════════════════════════
   EXPANDED CONTENT — Extra levels + 2 new games
   ═══════════════════════════════════════════════════════════ */

/* ── LETRAS extra levels (5-8) ────────────────────────────── */
export const LETRAS_EXTRA = [
  {
    level: 5, name: 'Sabio', color: '#F472B6',
    questions: [
      { hint: '🦒', answer: 'JIRAFA',      category: 'Animal',    speak: 'jirafa' },
      { hint: '🐙', answer: 'PULPO',       category: 'Animal',    speak: 'pulpo' },
      { hint: '🌺', answer: 'HIBISCO',     category: 'Planta',    speak: 'hibisco' },
      { hint: '🎭', answer: 'TEATRO',      category: 'Arte',      speak: 'teatro' },
      { hint: '🦜', answer: 'LORO',        category: 'Ave',       speak: 'loro' },
      { hint: '🏔️', answer: 'MONTANA',    category: 'Naturaleza',speak: 'montaña' },
      { hint: '🦈', answer: 'TIBURON',     category: 'Animal',    speak: 'tiburón' },
      { hint: '🌻', answer: 'GIRASOL',     category: 'Planta',    speak: 'girasol' },
    ]
  },
  {
    level: 6, name: 'Genio', color: '#34D399',
    questions: [
      { hint: '🦩', answer: 'FLAMENCO',    category: 'Ave',       speak: 'flamenco' },
      { hint: '🐝', answer: 'ABEJA',       category: 'Insecto',   speak: 'abeja' },
      { hint: '🌊', answer: 'TSUNAMI',     category: 'Fenómeno',  speak: 'tsunami' },
      { hint: '🎺', answer: 'TROMPETA',    category: 'Música',    speak: 'trompeta' },
      { hint: '🦔', answer: 'ERIZO',       category: 'Animal',    speak: 'erizo' },
      { hint: '🌿', answer: 'EUCALIPTO',   category: 'Planta',    speak: 'eucalipto' },
      { hint: '🐋', answer: 'BALLENA',     category: 'Animal',    speak: 'ballena' },
    ]
  },
  {
    level: 7, name: 'Maestro', color: '#60A5FA',
    questions: [
      { hint: '🦕', answer: 'DINOSAURIO',  category: 'Prehistoria',speak: 'dinosaurio' },
      { hint: '🌠', answer: 'CONSTELACION',category: 'Astronomía', speak: 'constelación' },
      { hint: '🎻', answer: 'VIOLIN',      category: 'Música',     speak: 'violín' },
      { hint: '🐉', answer: 'DRAGON',      category: 'Mítico',     speak: 'dragón' },
      { hint: '🌍', answer: 'CONTINENTE',  category: 'Geografía',  speak: 'continente' },
      { hint: '🧬', answer: 'CELULA',      category: 'Ciencia',    speak: 'célula' },
    ]
  },
  {
    level: 8, name: 'Leyenda', color: '#FBBF24',
    questions: [
      { hint: '🔭', answer: 'TELESCOPIO',  category: 'Ciencia',   speak: 'telescopio' },
      { hint: '🧪', answer: 'LABORATORIO', category: 'Ciencia',   speak: 'laboratorio' },
      { hint: '🏛️', answer: 'ARQUITECTURA',category: 'Arte',      speak: 'arquitectura' },
      { hint: '🌋', answer: 'ERUPCION',    category: 'Naturaleza',speak: 'erupción' },
      { hint: '🦠', answer: 'MICROORGANISMO', category: 'Ciencia',speak: 'microorganismo' },
    ]
  },
]

/* ── LÓGICA extra levels (5-8) ───────────────── */
export const LOGICA_EXTRA = [
  {
    level: 5, name: 'Sabio', color: '#F472B6',
    questions: [
      { prompt: '¿Qué sigue?', sequence: '5  10 15 20 ❓', options: ['22','25','30'], correct: 1, hint: 'Múltiplos de 5' },
      { prompt: '¿Cuál es diferente?', sequence: '🐟 🐠 🦈 🐝 🐡', options: ['🐝','🐟','🐠'], correct: 0, hint: 'No es un pez' },
      { prompt: '¿Qué sigue?', sequence: '🌑 🌒 🌓 🌔 ❓', options: ['🌑','🌕','🌙'], correct: 1, hint: 'Fases de la luna' },
      { prompt: '¿Qué falta?', sequence: '100 ÷ 10 = ❓', options: ['5','10','20'], correct: 1, hint: 'División entre 10' },
    ]
  },
  {
    level: 6, name: 'Genio', color: '#34D399',
    questions: [
      { prompt: '¿Qué número falta?', sequence: '3  6  12 24 ❓', options: ['36','48','30'], correct: 1, hint: 'Se duplica cada vez' },
      { prompt: 'Completa el patrón', sequence: 'A B A B ❓', options: ['B','A','C'], correct: 0, hint: 'Alterna A y B' },
      { prompt: '¿Qué sigue?', sequence: '🌱 🌿 🌳 🌱 🌿 ❓', options: ['🌿','🌳','🌱'], correct: 1, hint: 'Ciclo de 3 elementos' },
    ]
  },
  {
    level: 7, name: 'Maestro', color: '#60A5FA',
    questions: [
      { prompt: '¿Qué número sigue?', sequence: '1  1  2  3  5  ❓', options: ['6','7','8'], correct: 2, hint: 'Fibonacci: suma los 2 anteriores' },
      { prompt: 'Analogía', sequence: 'Día : Sol :: Noche : ❓', options: ['Cielo','Luna','Estrella'], correct: 1, hint: 'Lo que ilumina la noche' },
      { prompt: '¿Cuál pertenece?', sequence: 'Azul Rojo Verde ❓', options: ['Grande','Amarillo','Rápido'], correct: 1, hint: 'Todos son colores' },
    ]
  },
  {
    level: 8, name: 'Leyenda', color: '#FBBF24',
    questions: [
      { prompt: 'Si A>B y B>C, entonces:', sequence: 'A ? C', options: ['A < C','A = C','A > C'], correct: 2, hint: 'Razonamiento transitivo' },
      { prompt: '¿Cuánto es 2³?', sequence: '2 × 2 × 2 = ❓', options: ['6','8','12'], correct: 1, hint: 'Potencias: 2 elevado a 3' },
      { prompt: 'Siguiente primo', sequence: '2  3  5  7  ❓', options: ['8','9','11'], correct: 2, hint: 'Números primos en orden' },
    ]
  },
]

/* ── NÚMEROS extra levels (5-8) ─────────────── */
export const NUMEROS_EXTRA = [
  {
    level: 5, name: 'Sabio', color: '#F472B6',
    questions: [
      { items: '🍎×3 + 🍊×2', prompt: '3 + 2 = ❓', count: 5, options: ['4','5','6'], speak: 'tres más dos es cinco' },
      { items: '🌟×8 − 🌟×3', prompt: '8 − 3 = ❓', count: 5, options: ['4','5','6'], speak: 'ocho menos tres es cinco' },
      { items: '🐣×2 × 3',    prompt: '2 × 3 = ❓', count: 6, options: ['5','6','7'], speak: 'dos por tres es seis' },
    ]
  },
  {
    level: 6, name: 'Genio', color: '#34D399',
    questions: [
      { items: '🍕 ÷ 4 porciones', prompt: '12 ÷ 4 = ❓', count: 3, options: ['3','4','5'], speak: 'doce entre cuatro es tres' },
      { items: '📚 × ❓ = 20', prompt: '4 × ❓ = 20', count: 5, options: ['4','5','6'], speak: 'cuatro por cinco es veinte' },
      { items: '🔢 completa', prompt: '7 × 8 = ❓', count: 56, options: ['54','56','58'], speak: 'siete por ocho es cincuenta y seis' },
    ]
  },
  {
    level: 7, name: 'Maestro', color: '#60A5FA',
    questions: [
      { items: '🔢', prompt: '¼ de 40 = ❓', count: 10, options: ['8','10','12'], speak: 'un cuarto de cuarenta es diez' },
      { items: '🔢', prompt: '√ de 36 = ❓', count: 6, options: ['6','7','8'], speak: 'la raíz cuadrada de treinta y seis es seis' },
      { items: '🔢', prompt: '15% de 100 = ❓', count: 15, options: ['10','15','20'], speak: 'quince por ciento de cien es quince' },
    ]
  },
  {
    level: 8, name: 'Leyenda', color: '#FBBF24',
    questions: [
      { items: '🔢', prompt: '2⁴ = ❓', count: 16, options: ['12','16','18'], speak: 'dos a la cuarta es dieciséis' },
      { items: '🔢', prompt: '∛ de 27 = ❓', count: 3, options: ['3','4','5'], speak: 'la raíz cúbica de veintisiete es tres' },
      { items: '🔢', prompt: 'Si x+5=12, x=❓', count: 7, options: ['6','7','8'], speak: 'si equis más cinco es doce, equis es siete' },
    ]
  },
]

/* ─────────────────────────────────────────
   🆕 JUEGO 7: SÍLABAS
   Divide palabras en sílabas, arrastra al orden correcto
   ───────────────────────────────────────── */
export const SILABAS_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    questions: [
      { hint: '🐱', word: 'GATO',    syllables: ['GA','TO'],           correct: ['GA','TO'] },
      { hint: '🍎', word: 'MANZANA', syllables: ['MAN','ZA','NA'],     correct: ['MAN','ZA','NA'] },
      { hint: '🌙', word: 'LUNA',    syllables: ['LU','NA'],           correct: ['LU','NA'] },
      { hint: '🏠', word: 'CASA',    syllables: ['CA','SA'],           correct: ['CA','SA'] },
      { hint: '🐬', word: 'DELFIN',  syllables: ['DEL','FIN'],         correct: ['DEL','FIN'] },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    questions: [
      { hint: '🦋', word: 'MARIPOSA',  syllables: ['MA','RI','PO','SA'],    correct: ['MA','RI','PO','SA'] },
      { hint: '🐘', word: 'ELEFANTE',  syllables: ['E','LE','FAN','TE'],    correct: ['E','LE','FAN','TE'] },
      { hint: '🚀', word: 'COHETE',    syllables: ['CO','HE','TE'],         correct: ['CO','HE','TE'] },
      { hint: '🌋', word: 'VOLCAN',    syllables: ['VOL','CAN'],            correct: ['VOL','CAN'] },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    questions: [
      { hint: '🦁', word: 'COCODRILO', syllables: ['CO','CO','DRI','LO'],   correct: ['CO','CO','DRI','LO'] },
      { hint: '🎸', word: 'GUITARRA',  syllables: ['GUI','TA','RRA'],       correct: ['GUI','TA','RRA'] },
      { hint: '🌺', word: 'AMAPOLA',   syllables: ['A','MA','PO','LA'],     correct: ['A','MA','PO','LA'] },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    questions: [
      { hint: '🦒', word: 'HIPOPOTAMO', syllables: ['HI','PO','PO','TA','MO'], correct: ['HI','PO','PO','TA','MO'] },
      { hint: '🔭', word: 'TELESCOPIO', syllables: ['TE','LES','CO','PIO'],   correct: ['TE','LES','CO','PIO'] },
      { hint: '🌍', word: 'CONTINENTE', syllables: ['CON','TI','NEN','TE'],   correct: ['CON','TI','NEN','TE'] },
    ]
  },
]

/* ─────────────────────────────────────────
   🆕 JUEGO 8: COMPRENSIÓN LECTORA
   Lee el mini-texto y responde preguntas
   ───────────────────────────────────────── */
export const LECTURA_LEVELS = [
  {
    level: 1, name: 'Principiante', color: '#34D399',
    passages: [
      {
        icon: '🐱',
        text: 'El gato se llama Milo. Milo es de color naranja. Le gusta dormir y jugar con su pelota.',
        questions: [
          { q: '¿Cómo se llama el gato?',    options: ['Luna','Milo','Max'],         correct: 1 },
          { q: '¿De qué color es Milo?',      options: ['Negro','Blanco','Naranja'],  correct: 2 },
          { q: '¿Qué le gusta hacer a Milo?', options: ['Nadar','Dormir','Correr'],   correct: 1 },
        ]
      },
      {
        icon: '🌳',
        text: 'En el parque hay un árbol muy alto. Muchos pájaros viven en sus ramas. En verano tiene hojas verdes.',
        questions: [
          { q: '¿Dónde está el árbol?',              options: ['Casa','Parque','Escuela'], correct: 1 },
          { q: '¿Quiénes viven en sus ramas?',       options: ['Gatos','Pájaros','Perros'], correct: 1 },
          { q: '¿De qué color son las hojas en verano?', options: ['Rojas','Amarillas','Verdes'], correct: 2 },
        ]
      },
    ]
  },
  {
    level: 2, name: 'Explorador', color: '#38BDF8',
    passages: [
      {
        icon: '🌊',
        text: 'Los delfines son mamíferos marinos muy inteligentes. Viven en el océano y respiran aire. Pueden saltar muy alto y comunicarse con sonidos.',
        questions: [
          { q: '¿Qué tipo de animal es el delfín?',      options: ['Pez','Reptil','Mamífero'],   correct: 2 },
          { q: '¿Dónde viven los delfines?',             options: ['Río','Océano','Lago'],       correct: 1 },
          { q: '¿Cómo se comunican los delfines?',       options: ['Con colores','Con sonidos','Con señas'], correct: 1 },
        ]
      },
      {
        icon: '🌧️',
        text: 'El ciclo del agua tiene tres pasos. Primero el sol calienta el agua y se evapora. Luego forma nubes. Finalmente cae como lluvia.',
        questions: [
          { q: '¿Cuántos pasos tiene el ciclo del agua?', options: ['Dos','Tres','Cuatro'],         correct: 1 },
          { q: '¿Qué calienta el agua para que se evapore?', options: ['El viento','El sol','El fuego'], correct: 1 },
          { q: '¿Cómo regresa el agua a la tierra?',        options: ['Como nieve','Como hielo','Como lluvia'], correct: 2 },
        ]
      },
    ]
  },
  {
    level: 3, name: 'Aventurero', color: '#A78BFA',
    passages: [
      {
        icon: '🚀',
        text: 'El sistema solar tiene ocho planetas. El más grande es Júpiter y el más pequeño es Mercurio. La Tierra es el tercer planeta y es el único con vida conocida.',
        questions: [
          { q: '¿Cuántos planetas tiene el sistema solar?',  options: ['Seis','Ocho','Diez'],        correct: 1 },
          { q: '¿Cuál es el planeta más grande?',            options: ['Saturno','Júpiter','Urano'], correct: 1 },
          { q: '¿Qué lugar ocupa la Tierra en el sistema solar?', options: ['Segundo','Tercero','Cuarto'], correct: 1 },
        ]
      },
    ]
  },
  {
    level: 4, name: 'Campeón', color: '#FBBF24',
    passages: [
      {
        icon: '🦋',
        text: 'La mariposa comienza como huevo. Del huevo sale una oruga que come hojas. La oruga forma un capullo y se transforma. Al final emerge una hermosa mariposa.',
        questions: [
          { q: '¿Cómo empieza la vida de una mariposa?',    options: ['Como larva','Como huevo','Como capullo'],  correct: 1 },
          { q: '¿Qué come la oruga?',                       options: ['Flores','Insectos','Hojas'],              correct: 2 },
          { q: '¿Qué forma la oruga antes de transformarse?', options: ['Un nido','Un capullo','Una red'],       correct: 1 },
        ]
      },
    ]
  },
]

/* ── Additional badges for new content ────────── */
export const BADGES_EXTRA = [
  { id: 'level_5',     icon: '🌟', label: 'Sabio',           condition: 'Alcanzar nivel 5 en algún juego' },
  { id: 'level_8',     icon: '👑', label: 'Leyenda',         condition: 'Alcanzar nivel 8 — ¡el máximo!' },
  { id: 'bilingual',   icon: '🌍', label: 'Bilingüe',        condition: 'Completar un nivel en inglés' },
  { id: 'silabas_win', icon: '📝', label: 'Silabista',       condition: 'Completar el juego de Sílabas' },
  { id: 'lector',      icon: '📖', label: 'Gran lector',     condition: 'Completar Comprensión Lectora nivel 2' },
  { id: 'perfect',     icon: '💯', label: '¡Perfecto!',      condition: 'Responder 10 seguidas sin error' },
  { id: 'polyglot',    icon: '🗣️', label: 'Políglota',       condition: 'Jugar en ambos idiomas el mismo día' },
  { id: 'audio_fan',   icon: '🔊', label: 'Oído musical',    condition: 'Escuchar 20 pronunciaciones' },
]
