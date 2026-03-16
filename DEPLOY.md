# 🚀 Guía de Deploy — GitHub + Firebase + Vercel

Tiempo estimado: **30-40 minutos** (primera vez)

---

## Paso 1 — Crear proyecto Firebase

1. Ve a **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Agregar proyecto"**
3. Nombre: `kidspark` → Siguiente
4. Desactiva Google Analytics (opcional) → **Crear proyecto**

---

## Paso 2 — Configurar servicios en Firebase Console

### Authentication
1. **Build → Authentication → Comenzar**
2. Pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**

### Firestore Database
1. **Build → Firestore Database → Crear base de datos**
2. Elige **Modo producción** (las reglas ya están en el código)
3. Región: `southamerica-east1` (São Paulo) para menor latencia

### Cloud Messaging (push notifications)
1. **Project Settings ⚙️ → Cloud Messaging**
2. En "Web configuration" → **Generate key pair**
3. Copia la clave VAPID → es tu `VITE_FIREBASE_VAPID_KEY`

---

## Paso 3 — Obtener las credenciales de tu app web

1. **Project Settings ⚙️ → General → Your apps**
2. Click **"</>"** (agregar app web)
3. Nombre: `kidspark-web` → Registrar app
4. Copia el objeto `firebaseConfig`:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "kidspark-xxx.firebaseapp.com",
  projectId:         "kidspark-xxx",
  storageBucket:     "kidspark-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
  measurementId:     "G-XXXXXXXXXX"
}
```

---

## Paso 4 — Crear tu archivo .env local

```bash
cd kidspark
cp .env.example .env
```

Edita `.env` con los valores del paso anterior:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=kidspark-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kidspark-xxx
VITE_FIREBASE_STORAGE_BUCKET=kidspark-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FIREBASE_VAPID_KEY=BEl62iU...
```

---

## Paso 5 — Subir a GitHub

```bash
cd kidspark

# Inicializar git
git init
git add .
git commit -m "feat: KidSpark v1.0 — Firebase + PWA"

# Crear repo en github.com → New repository → kidspark
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/kidspark.git
git branch -M main
git push -u origin main
```

---

## Paso 6 — Conectar Vercel con GitHub

1. Ve a **[vercel.com](https://vercel.com)** → New Project
2. Importa tu repo `kidspark` de GitHub
3. En **Environment Variables**, agrega todas las del `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_FIREBASE_VAPID_KEY`
4. Click **Deploy** → tu app estará en `https://kidspark.vercel.app`

---

## Paso 7 — Configurar GitHub Secrets para CI/CD automático

En tu repo GitHub → **Settings → Secrets and variables → Actions → New repository secret**

Agrega estos secrets (uno por uno):

| Secret | Cómo obtenerlo |
|--------|----------------|
| `VITE_FIREBASE_API_KEY` | Del `.env` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Del `.env` |
| `VITE_FIREBASE_PROJECT_ID` | Del `.env` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Del `.env` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Del `.env` |
| `VITE_FIREBASE_APP_ID` | Del `.env` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Del `.env` |
| `VITE_FIREBASE_VAPID_KEY` | Del `.env` |
| `FIREBASE_TOKEN` | `firebase login:ci` en tu terminal |
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `vercel whoami --token TU_TOKEN` |
| `VERCEL_PROJECT_ID` | `vercel ls --token TU_TOKEN` |

Para obtener el `FIREBASE_TOKEN`:
```bash
npm install -g firebase-tools
firebase login:ci
# Copia el token que aparece
```

Para `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`:
```bash
npm install -g vercel
vercel link   # linkea el proyecto localmente
cat .vercel/project.json  # aquí están los IDs
```

---

## Paso 8 — Desplegar Cloud Functions (primera vez, manual)

```bash
# Instalar dependencias de functions
cd firebase/functions
npm install
cd ../..

# Login Firebase
firebase login

# Desplegar todo (rules + indexes + functions)
firebase deploy --project kidspark-xxx
```

Después de esto, el CI/CD lo hace automáticamente en cada push a `main`.

---

## ✅ Flujo automático después de configurar

```bash
# Haces un cambio
git add .
git commit -m "fix: algo"
git push origin main

# GitHub Actions automáticamente:
# ├─ npm run build
# ├─ vercel --prod       → nuevo deploy en Vercel (~30s)
# ├─ firebase deploy functions  → Cloud Functions actualizadas
# └─ firebase deploy firestore  → Reglas actualizadas
```

---

## 🧪 Probar localmente con emuladores Firebase

```bash
# Instalar emuladores (primera vez)
firebase init emulators

# Correr app + emuladores juntos
firebase emulators:start &
npm run dev

# La app usará Firestore/Auth locales — sin afectar producción
```

---

## ❓ Solución de problemas frecuentes

**"Firebase: Error (auth/...)"**
→ Verifica que Authentication → Email/Contraseña esté habilitado

**"Missing or insufficient permissions"**
→ Despliega las reglas: `firebase deploy --only firestore:rules`

**Las notificaciones no llegan**
→ Verifica que el VAPID key sea correcto y que la Cloud Function esté desplegada

**GitHub Actions falla en "build"**
→ Verifica que todos los secrets de `VITE_FIREBASE_*` estén en GitHub Secrets

**Vercel muestra pantalla en blanco**
→ Verifica en Vercel → Functions → que no haya errores de variables de entorno
