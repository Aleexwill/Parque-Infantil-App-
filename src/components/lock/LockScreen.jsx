import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import { usePatternLock } from '@/hooks/usePatternLock'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import styles from './LockScreen.module.css'

/* ─────────────────────────────────────────────
   LockScreen — Pattern lock to enter Admin
   ───────────────────────────────────────────── */

export default function LockScreen({ onUnlock }) {
  const { settings, logActivity, activeKidId, kids, family, user } = useApp()
  const [showHint, setShowHint] = useState(false)

  const pattern = settings?.pattern ?? [0, 1, 4, 7, 8]
  const kidName = kids?.find(k => k.id === activeKidId)?.name ?? 'Un niño'
  const push    = usePushNotifications({ familyId: family?.id, userId: user?.id })

  const { sequence, status, attempts, locked, lockUntil, tap } = usePatternLock({
    correctPattern: pattern,
    onSuccess: () => {
      onUnlock?.()
    },
    onFail: (n) => {
      logActivity({ kidId: activeKidId, type: 'lock', label: 'Intento de salida', detail: `Patrón incorrecto (intento ${n})` })
      // Push notification to parents if enabled
      if (settings?.notificationsEnabled && settings?.notifyLockAttempt !== false) {
        push.notifyLockAttempt(kidName)
      }
    },
  })

  const remainingSecs = lockUntil ? Math.ceil((lockUntil - Date.now()) / 1000) : 0

  function dotState(idx) {
    const pos = sequence.indexOf(idx)
    if (pos === -1) return 'idle'
    if (status === 'success') return 'success'
    if (status === 'fail')    return 'fail'
    return 'active'
  }

  return (
    <div className={styles.root}>
      {/* Animated background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <div className={styles.card}>
        {/* Icon */}
        <div className={`${styles.lockIcon} ${status === 'success' ? styles.iconSuccess : status === 'fail' ? styles.iconFail : ''}`}>
          {status === 'success' ? '✅' : locked ? '🚫' : '🔐'}
        </div>

        <h2 className={styles.title}>
          {locked ? 'Demasiados intentos' : 'Acceso para padres'}
        </h2>
        <p className={styles.subtitle}>
          {locked
            ? `Espera ${remainingSecs}s para intentar de nuevo`
            : 'Dibuja el patrón para acceder al panel'}
        </p>

        {/* Pattern grid */}
        <div className={styles.patternGrid} aria-label="Patrón de desbloqueo">
          {Array.from({ length: 9 }, (_, i) => {
            const state  = dotState(i)
            const order  = sequence.indexOf(i)
            return (
              <button
                key={i}
                className={`${styles.dot} ${styles['dot_' + state]}`}
                onClick={() => tap(i)}
                disabled={locked}
                aria-label={`Punto ${i + 1}`}
              >
                {order > -1 && (
                  <span className={styles.dotNum}>{order + 1}</span>
                )}
                <span className={styles.dotRing} />
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        <div className={`${styles.feedback} ${styles['fb_' + status]}`}>
          {status === 'idle'    && (sequence.length === 0 ? '\u00A0' : `${sequence.length} de ${pattern.length} puntos...`)}
          {status === 'drawing' && `${sequence.length} de ${pattern.length} puntos...`}
          {status === 'success' && '✅ ¡Acceso concedido!'}
          {status === 'fail'    && `❌ Patrón incorrecto${attempts > 1 ? ` (${attempts} intentos)` : ''}`}
          {locked               && `🔒 Bloqueado ${remainingSecs}s`}
        </div>

        {/* Attempts warning */}
        {attempts >= 3 && !locked && (
          <p className={styles.warning}>
            ⚠️ {5 - attempts} intentos restantes antes del bloqueo temporal
          </p>
        )}

        {/* Hint toggle (demo purposes) */}
        <button className={styles.hintBtn} onClick={() => setShowHint(v => !v)}>
          {showHint ? 'Ocultar pista' : '¿Olvidaste el patrón?'}
        </button>
        {showHint && (
          <p className={styles.hintText}>
            Patrón actual configurado en el panel de administración. Por seguridad, contacta al otro padre/madre.
          </p>
        )}
      </div>
    </div>
  )
}
