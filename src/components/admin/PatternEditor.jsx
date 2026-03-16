import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import styles from './PatternEditor.module.css'

/* ─────────────────────────────────────────────
   PatternEditor — Modal to set a new pattern
   ───────────────────────────────────────────── */

export default function PatternEditor({ onClose }) {
  const { updatePattern, settings } = useApp()
  const [phase, setPhase]     = useState('draw')    // draw | confirm | success
  const [first, setFirst]     = useState([])
  const [second, setSecond]   = useState([])
  const [error, setError]     = useState(null)

  const current = phase === 'confirm' ? second : first
  const setCurrent = phase === 'confirm' ? setSecond : setFirst

  const tap = (idx) => {
    if (current.includes(idx)) return
    const next = [...current, idx]
    setCurrent(next)
    setError(null)
  }

  const confirm = () => {
    if (first.length < 4) { setError('Selecciona al menos 4 puntos'); return }
    setPhase('confirm')
  }

  const save = () => {
    if (second.length < 4) { setError('Selecciona al menos 4 puntos'); return }
    if (JSON.stringify(first) !== JSON.stringify(second)) {
      setError('Los patrones no coinciden. Intenta de nuevo.')
      setSecond([])
      return
    }
    updatePattern(first)
    setPhase('success')
    setTimeout(onClose, 1200)
  }

  const reset = () => {
    if (phase === 'confirm') { setSecond([]); setError(null) }
    else { setFirst([]); setError(null) }
  }

  function dotState(idx) {
    const pos = current.indexOf(idx)
    if (pos === -1) return 'idle'
    return 'active'
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>🔐 {phase === 'confirm' ? 'Confirmar patrón' : 'Nuevo patrón'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {phase === 'success' ? (
          <div className={styles.successState}>
            <span className={styles.successIcon}>✅</span>
            <p>¡Patrón guardado exitosamente!</p>
          </div>
        ) : (
          <>
            <p className={styles.desc}>
              {phase === 'draw'
                ? 'Toca los puntos para crear tu nuevo patrón (mín. 4 puntos)'
                : 'Repite el mismo patrón para confirmar'}
            </p>

            <div className={styles.progress}>
              <div className={`${styles.step} ${styles.stepDone}`}>1. Dibujar</div>
              <div className={styles.stepLine} />
              <div className={`${styles.step} ${phase === 'confirm' ? styles.stepDone : ''}`}>2. Confirmar</div>
            </div>

            <div className={styles.grid}>
              {Array.from({ length: 9 }, (_, i) => {
                const state = dotState(i)
                const order = current.indexOf(i)
                return (
                  <button key={i} className={`${styles.dot} ${state === 'active' ? styles.dotActive : ''}`}
                    onClick={() => tap(i)}>
                    {order > -1 && <span>{order + 1}</span>}
                  </button>
                )
              })}
            </div>

            <p className={styles.dotCount}>{current.length} puntos seleccionados</p>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button className={styles.btnReset} onClick={reset}>↺ Limpiar</button>
              {phase === 'draw'
                ? <button className={styles.btnNext} onClick={confirm} disabled={first.length < 4}>
                    Siguiente →
                  </button>
                : <button className={styles.btnSave} onClick={save} disabled={second.length < 4}>
                    💾 Guardar
                  </button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
}
