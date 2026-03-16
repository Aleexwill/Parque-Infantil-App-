# 🌟 KidSpark — App Educativa con Control Parental

PWA educativa para niños con portal de administración para padres. Construida con React + Vite + Zustand.

---

## 📁 Estructura del proyecto

```
kidspark/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── kids/
│   │   │   ├── KidsView.jsx          ← Vista principal del niño
│   │   │   ├── KidsView.module.css
│   │   │   ├── GameArea.jsx          ← Motor de los 6 mini-juegos
│   │   │   └── GameArea.module.css
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx    ← Portal de padres (4 tabs)
│   │   │   ├── AdminDashboard.module.css
│   │   │   ├── PatternEditor.jsx     ← Modal para cambiar patrón
│   │   │   └── PatternEditor.module.css
│   │   └── lock/
│   │       ├── LockScreen.jsx        ← Pantalla de bloqueo por patrón
│   │       └── LockScreen.module.css
│   ├── hooks/
│   │   └── usePatternLock.js         ← Hook reutilizable de patrón
│   ├── store/
│   │   └── useStore.js               ← Estado global (Zustand + persist)
│   ├── utils/
│   │   └── helpers.js                ← Helpers, catálogo de juegos
│   ├── styles/
│   │   └── globals.css               ← Variables CSS, animaciones
│   ├── App.jsx                       ← Router principal
│   └── main.jsx                      ← Entry point
├── index.html
├── vite.config.js                    ← Config Vite + PWA plugin
├── package.json
└── README.md
```

---

## 🚀 Instalación y arranque

### Requisitos
- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Entra al directorio
cd kidspark

# 2. Instala dependencias
npm install

# 3. Arranca en desarrollo
npm run dev
# → Abre http://localhost:5173

# 4. Build de producción
npm run build

# 5. Preview del build
npm run preview
```

---

## 📱 Instalar como PWA (Android / iOS)

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Añadir a pantalla de inicio"
3. Confirma → aparece el ícono en el launcher

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir → "Añadir a inicio"
3. Confirma → aparece el ícono en la pantalla de inicio

---

## ☁️ Deploy gratuito en Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Build y deploy (desde la raíz del proyecto)
npm run build
vercel --prod

# La app estará en: https://kidspark-xxx.vercel.app
```

También puedes conectar tu repositorio de GitHub a Vercel para deploy automático en cada push.

---

## 🗝️ Patrón de bloqueo por defecto

El patrón inicial para acceder al panel de padres es:

```
[1] [2] [ ]
[ ] [3] [ ]
[ ] [4] [5]
```

**Secuencia: puntos 0 → 1 → 4 → 7 → 8** (esquina superior izquierda, arriba, centro, abajo-centro, abajo-derecha)

Puedes cambiarlo desde: **Admin → ⚙️ Config → Cambiar patrón**

---

## 🎮 Juegos incluidos

| ID         | Nombre           | Categoría      | Descripción                          |
|------------|------------------|----------------|--------------------------------------|
| `letras`   | Aprendo Letras   | Lectura        | Forma palabras eligiendo letras      |
| `escritura`| Escritura Fun    | Escritura      | Escribe el nombre del animal/objeto  |
| `logica`   | Lógica Genio     | Lógica         | Completa la secuencia                |
| `numeros`  | Números Mágicos  | Matemáticas    | Cuenta y elige el número correcto    |
| `colores`  | Colores y Formas | Creatividad    | Identifica colores y formas          |
| `memoria`  | Juego de Memoria | Concentración  | Encuentra las parejas de emojis      |

---

## 🛡️ Funciones del portal de padres

- **📊 Resumen** — Estadísticas del día: tiempo total, actividades, videos, intentos de bloqueo
- **👨‍👩‍👧 Perfiles** — Gestión de niños: activar, bloquear, ver estadísticas por hijo
- **📋 Historial** — Log completo de toda la actividad (juegos, videos, intentos de salida)
- **⚙️ Config** — Toggles de YouTube, límite de tiempo diario, notificaciones, modo solo-juegos
- **🔐 Patrón** — Visual del patrón actual + editor para cambiarlo con confirmación

---

## 🗺️ Roadmap — Próximas funcionalidades

### Fase 2 (Backend real)
- [ ] Autenticación de padres con email/contraseña (Supabase Auth)
- [ ] Base de datos en la nube (Supabase PostgreSQL)
- [ ] API REST para guardar historial por dispositivo
- [ ] Múltiples dispositivos sincronizados

### Fase 3 (Contenido)
- [ ] Más niveles de juegos (10+ niveles por juego)
- [ ] Sistema de recompensas y badges
- [ ] Modo lección (texto + audio)
- [ ] Integración YouTube Data API para playlists curadas

### Fase 4 (Control avanzado)
- [ ] Notificaciones push a padres (Web Push API)
- [ ] Límites de tiempo configurables por día de semana
- [ ] Bloqueo automático por horario (ej. solo 3pm-6pm)
- [ ] Reportes semanales por email
- [ ] Modo quiosco (kiosk mode) para tablets dedicadas

---

## 🛠️ Stack técnico

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Framework  | React 18 + Vite 5                   |
| Estado     | Zustand (persist en localStorage)   |
| Estilos    | CSS Modules + Variables CSS         |
| PWA        | vite-plugin-pwa + Workbox           |
| Fonts      | Google Fonts (Nunito + Baloo 2)     |
| Deploy     | Vercel (recomendado)                |
| BD futura  | Supabase (PostgreSQL + Auth)        |

---

## 📌 Notas importantes

### YouTube Kids
La app embebe YouTube con una playlist curada. Para integración real con YouTube Kids:
- Opción A: Usar YouTube Data API v3 con playlists verificadas manualmente
- Opción B: Redirigir a la app nativa de YouTube Kids (deep link)
- Opción C: Usar plataformas con API abierta: Khan Academy, PBS Kids

### Persistencia de datos
El estado se guarda en `localStorage` del navegador. Para múltiples dispositivos o respaldo en la nube, se necesita backend (Supabase recomendado).

### Seguridad del patrón
El patrón se guarda en localStorage como array de índices. Para producción, considera:
- Hashear el patrón antes de guardarlo
- Agregar PIN numérico como respaldo
- Limitar intentos fallidos (ya implementado: 5 intentos → bloqueo 30s)

---

## 📄 Licencia
MIT — Úsalo libremente para uso personal y comercial.
