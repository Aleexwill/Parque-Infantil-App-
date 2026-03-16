import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import styles from './AuthScreen.module.css'

/* ─────────────────────────────────────────────
   AuthScreen — Login / Register
   ───────────────────────────────────────────── */

export default function AuthScreen() {
  const { signIn, signUp, resetPassword, authError, clearAuthError, authLoading } = useApp()
  const [mode,   setMode]   = useState('login')   // login | register | reset
  const [form,   setForm]   = useState({ email: '', password: '', familyName: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [busy,   setBusy]   = useState(false)

  function field(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: null }))
    clearAuthError?.()
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'

    if (mode !== 'reset') {
      if (!form.password) e.password = 'La contraseña es requerida'
      else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    }

    if (mode === 'register') {
      if (!form.familyName.trim()) e.familyName = 'Escribe el nombre de tu familia'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    setNotice(null)

    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password })
      } else if (mode === 'register') {
        await signUp({ email: form.email, password: form.password, familyName: form.familyName })
        setNotice('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
        setMode('login')
      } else if (mode === 'reset') {
        await resetPassword(form.email)
        setNotice('Te enviamos un email con instrucciones para restablecer tu contraseña.')
        setMode('login')
      }
    } catch (err) {
      // Error already in authError from useAuth
    } finally {
      setBusy(false)
    }
  }

  const TITLES = {
    login:    { h: 'Bienvenido de nuevo', sub: 'Inicia sesión en el portal de padres' },
    register: { h: 'Crear cuenta familiar', sub: 'Configura KidSpark para tu familia' },
    reset:    { h: 'Recuperar contraseña', sub: 'Te enviaremos un enlace a tu email' },
  }

  const t = TITLES[mode]

  return (
    <div className={styles.root}>
      {/* Animated background */}
      <div className={styles.bg}>
        <div className={styles.blob1} /><div className={styles.blob2} /><div className={styles.blob3} />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌟</span>
          <span className={styles.logoText}>KidSpark</span>
        </div>

        <h1 className={styles.title}>{t.h}</h1>
        <p  className={styles.sub}>{t.sub}</p>

        {/* Notice / success message */}
        {notice && (
          <div className={styles.notice}>✅ {notice}</div>
        )}

        {/* Server error */}
        {authError && (
          <div className={styles.errorBanner}>
            ⚠️ {translateError(authError)}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Family name (register only) */}
          {mode === 'register' && (
            <Field label="Nombre de la familia" error={errors.familyName}
              icon="👨‍👩‍👧">
              <input type="text" placeholder="Ej: Familia García"
                value={form.familyName} onChange={e => field('familyName', e.target.value)}
                className={errors.familyName ? styles.inputError : ''} autoComplete="organization" />
            </Field>
          )}

          {/* Email */}
          <Field label="Email" error={errors.email} icon="📧">
            <input type="email" placeholder="padre@email.com"
              value={form.email} onChange={e => field('email', e.target.value)}
              className={errors.email ? styles.inputError : ''} autoComplete="email" />
          </Field>

          {/* Password */}
          {mode !== 'reset' && (
            <Field label="Contraseña" error={errors.password} icon="🔑">
              <input type="password" placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                value={form.password} onChange={e => field('password', e.target.value)}
                className={errors.password ? styles.inputError : ''} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
            </Field>
          )}

          {/* Confirm password */}
          {mode === 'register' && (
            <Field label="Confirmar contraseña" error={errors.confirmPassword} icon="🔒">
              <input type="password" placeholder="Repite la contraseña"
                value={form.confirmPassword} onChange={e => field('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? styles.inputError : ''} autoComplete="new-password" />
            </Field>
          )}

          {/* Forgot password */}
          {mode === 'login' && (
            <button type="button" className={styles.linkBtn} onClick={() => setMode('reset')}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={busy || authLoading}>
            {busy ? <span className={styles.spinner} /> : null}
            {mode === 'login'    && (busy ? 'Entrando...'  : '🚀 Entrar')}
            {mode === 'register' && (busy ? 'Creando...'   : '✨ Crear cuenta')}
            {mode === 'reset'    && (busy ? 'Enviando...'  : '📬 Enviar email')}
          </button>
        </form>

        {/* Mode switcher */}
        <div className={styles.footer}>
          {mode === 'login' && (
            <p>¿No tienes cuenta?{' '}
              <button className={styles.linkBtn} onClick={() => { setMode('register'); clearAuthError?.() }}>
                Crear cuenta gratis
              </button>
            </p>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <p>¿Ya tienes cuenta?{' '}
              <button className={styles.linkBtn} onClick={() => { setMode('login'); clearAuthError?.() }}>
                Iniciar sesión
              </button>
            </p>
          )}
        </div>

        <p className={styles.securityNote}>
          🔒 Tus datos están protegidos con cifrado de extremo a extremo
        </p>
      </div>
    </div>
  )
}

/* ─── Field wrapper ─── */
function Field({ label, error, icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon} {label}
      </label>
      {children}
      {error && <span style={{ fontSize: '0.7rem', color: '#F87171', fontWeight: 600 }}>⚠ {error}</span>}
    </div>
  )
}

/* Translate Supabase English errors to Spanish */
function translateError(msg) {
  if (!msg) return msg
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos'
  if (msg.includes('Email not confirmed'))        return 'Confirma tu email antes de entrar'
  if (msg.includes('User already registered'))    return 'Ya existe una cuenta con ese email'
  if (msg.includes('Password should be'))         return 'La contraseña debe tener al menos 6 caracteres'
  if (msg.includes('rate limit'))                 return 'Demasiados intentos. Espera unos minutos.'
  if (msg.includes('network'))                    return 'Error de conexión. Verifica tu internet.'
  return msg
}
