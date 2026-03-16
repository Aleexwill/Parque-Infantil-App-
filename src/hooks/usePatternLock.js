import { useState, useCallback } from 'react'

/* ─────────────────────────────────────────────
   usePatternLock — Pattern lock state machine
   ───────────────────────────────────────────── */

export function usePatternLock({ correctPattern, onSuccess, onFail, maxAttempts = 5 }) {
  const [sequence, setSequence]   = useState([])
  const [status, setStatus]       = useState('idle')   // idle | drawing | success | fail
  const [attempts, setAttempts]   = useState(0)
  const [locked, setLocked]       = useState(false)
  const [lockUntil, setLockUntil] = useState(null)

  const tap = useCallback((idx) => {
    if (locked || status === 'success' || sequence.includes(idx)) return

    const next = [...sequence, idx]
    setSequence(next)
    setStatus('drawing')

    if (next.length === correctPattern.length) {
      const ok = next.every((v, i) => v === correctPattern[i])
      if (ok) {
        setStatus('success')
        setAttempts(0)
        setTimeout(() => { onSuccess?.(); reset(); }, 700)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setStatus('fail')
        onFail?.(newAttempts)

        if (newAttempts >= maxAttempts) {
          const until = Date.now() + 30_000  // 30s lockout
          setLocked(true)
          setLockUntil(until)
          setTimeout(() => { setLocked(false); setLockUntil(null); setAttempts(0); reset(); }, 30_000)
        } else {
          setTimeout(reset, 800)
        }
      }
    }
  }, [sequence, status, attempts, locked, correctPattern, onSuccess, onFail, maxAttempts])

  const reset = useCallback(() => {
    setSequence([])
    setStatus('idle')
  }, [])

  return { sequence, status, attempts, locked, lockUntil, tap, reset }
}
