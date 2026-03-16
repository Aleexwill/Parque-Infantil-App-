import { useState, useCallback } from 'react'
import { useApp } from '@/lib/AppContext'
import { useAudio } from '@/hooks/useAudio'
import { SILABAS_LEVELS } from '@/utils/gameContent'
import styles from './SilabasGame.module.css'

/* ─────────────────────────────────────────────
   SilabasGame — tap syllables in correct order
   Self-contained: manages its own level/XP
   ───────────────────────────────────────────── */

export default function SilabasGame({ kidId, lang = 'es' }) {
  const { levelProgress, updateLevelProgress, logActivity, awardBadge } = useApp()
  const audio = useAudio({ lang: lang === 'es' ? 'es-ES' : 'en-US' })

  const saved    = levelProgress?.[kidId]?.silabas ?? { level: 1, xp: 0 }
  const levels   = SILABAS_LEVELS
  const maxLevel = levels.length

  const [level,   setLevel]   = useState(saved.level ?? 1)
  const [xp,      setXp]      = useState(saved.xp ?? 0)
  const [score,   setScore]   = useState(0)
  const [lvUp,    setLvUp]    = useState(false)

  const levelData  = levels[Math.min(level - 1, levels.length - 1)]
  const xpForNext  = level * 80
  const progress   = Math.min(100, Math.round((xp / xpForNext) * 100))

  const questions = levelData.questions
  const [qi,      setQi]      = useState(0)
  const [chosen,  setChosen]  = useState([])
  const [result,  setResult]  = useState(null)
  const [used,    setUsed]    = useState([])

  const current  = questions[qi % questions.length]
  const [shuffled] = useState(() =>
    current.syllables.map((v, i) => ({ v, i })).sort(() => Math.random() - 0.5)
  )

  function onCorrect() {
    const gained = 12
    const nXp    = xp + gained
    const nScore = score + gained
    setXp(nXp); setScore(nScore)
    audio.playCorrect()
    if (nXp >= xpForNext && level < maxLevel) {
      const next = level + 1
      setTimeout(() => {
        setLevel(next); setXp(0)
        setLvUp(true); audio.playLevelUp()
        setTimeout(() => setLvUp(false), 1800)
        updateLevelProgress(kidId, 'silabas', { level: next, xp: 0 })
        if (next >= 2) awardBadge(kidId, 'level_2')
        if (next >= 3) awardBadge(kidId, 'level_3')
      }, 1000)
    } else {
      updateLevelProgress(kidId, 'silabas', { level, xp: nXp })
    }
    awardBadge(kidId, 'silabas_win')
    logActivity({ kidId, type: 'game', label: 'Sílabas', detail: `Nv.${level} +${gained}` })
  }

  const pick = useCallback((syllable, idx) => {
    if (result || used.includes(idx)) return
    const next = [...chosen, syllable]
    setChosen(next)
    setUsed(u => [...u, idx])
    audio.playClick()

    if (next.length === current.correct.length) {
      const ok = next.join('') === current.correct.join('')
      setResult(ok ? 'correct' : 'wrong')
      if (ok) {
        onCorrect()
        audio.speak(current.word)
        setTimeout(() => {
          setQi(q => q + 1)
          setChosen([]); setUsed([]); setResult(null)
        }, 1100)
      } else {
        audio.playWrong()
        setTimeout(() => { setChosen([]); setUsed([]); setResult(null) }, 800)
      }
    }
  }, [chosen, result, used, current, audio])

  return (
    <div className={styles.root}>
      {/* Score bar */}
      <div className={styles.scoreBar}>
        <span className={styles.scoreNum}>⭐ {score}</span>
        <span className={styles.levelLabel}>
          {lang === 'es' ? `Nv.${level}` : `Lv.${level}`}
          {level < maxLevel ? `→${level+1}` : ' MAX'}
        </span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.xpLabel}>{xp}/{xpForNext}</span>
      </div>

      {/* Level up banner */}
      {lvUp && (
        <div className={styles.levelUpBanner}>
          🎉 {lang === 'es' ? `¡Subiste al nivel ${level}!` : `Level ${level} reached!`}
        </div>
      )}

      {/* Hint */}
      <div className={styles.hintRow}>
        <span className={styles.hintEmoji}>{current.hint}</span>
        <button className={styles.speakBtn} onClick={() => audio.speak(current.word.toLowerCase())} title="Escuchar">
          🔊
        </button>
      </div>

      <p className={styles.instruction}>
        {lang === 'es' ? 'Toca las sílabas en orden:' : 'Tap syllables in order:'}
      </p>

      {/* Answer slots */}
      <div className={styles.slots}>
        {current.correct.map((_, i) => (
          <div key={i} className={`${styles.slot}
            ${chosen[i] ? styles.slotFilled : ''}
            ${result === 'correct' ? styles.slotCorrect : ''}
            ${result === 'wrong' && chosen[i] ? styles.slotWrong : ''}`}>
            {chosen[i] || '—'}
          </div>
        ))}
      </div>

      {/* Syllable buttons */}
      <div className={styles.syllableRow}>
        {shuffled.map(({ v, i }) => (
          <button key={i}
            className={`${styles.sylBtn} ${used.includes(i) ? styles.sylUsed : ''}`}
            onClick={() => pick(v, i)}
            disabled={!!result || used.includes(i)}>
            {v}
          </button>
        ))}
      </div>

      {chosen.length > 0 && !result && (
        <button className={styles.clearBtn} onClick={() => { setChosen([]); setUsed([]) }}>
          {lang === 'es' ? '↺ Borrar' : '↺ Clear'}
        </button>
      )}

      <div className={`${styles.feedback}
        ${result === 'correct' ? styles.fbOk : result === 'wrong' ? styles.fbErr : ''}`}>
        {result === 'correct' ? (lang === 'es' ? '🎉 ¡Correcto!' : '🎉 Correct!') :
         result === 'wrong'   ? (lang === 'es' ? '😅 Inténtalo de nuevo' : '😅 Try again') :
         `${chosen.length} / ${current.correct.length}`}
      </div>
    </div>
  )
}
