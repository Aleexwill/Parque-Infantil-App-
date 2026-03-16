import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import { useAudio } from '@/hooks/useAudio'
import { LECTURA_LEVELS } from '@/utils/gameContent'
import styles from './LecturaGame.module.css'

/* ─────────────────────────────────────────────
   LecturaGame — Reading comprehension
   Self-contained: manages its own level/XP
   ───────────────────────────────────────────── */

export default function LecturaGame({ kidId, lang = 'es' }) {
  const { levelProgress, updateLevelProgress, logActivity, awardBadge } = useApp()
  const audio = useAudio({ lang: lang === 'es' ? 'es-ES' : 'en-US' })

  const saved    = levelProgress?.[kidId]?.lectura ?? { level: 1, xp: 0 }
  const levels   = LECTURA_LEVELS
  const maxLevel = levels.length

  const [level,  setLevel]  = useState(saved.level ?? 1)
  const [xp,     setXp]     = useState(saved.xp ?? 0)
  const [score,  setScore]  = useState(0)
  const [lvUp,   setLvUp]   = useState(false)

  const levelData = levels[Math.min(level - 1, levels.length - 1)]
  const xpForNext = level * 80
  const progress  = Math.min(100, Math.round((xp / xpForNext) * 100))

  const passages = levelData.passages
  const [pi,       setPi]       = useState(0)
  const [phase,    setPhase]    = useState('read')
  const [qi,       setQi]       = useState(0)
  const [chosen,   setChosen]   = useState(null)
  const [result,   setResult]   = useState(null)
  const [quizDone, setQuizDone] = useState(false)

  const passage  = passages[pi % passages.length]
  const question = passage.questions[qi]

  function onCorrect(pts = 15) {
    const nXp   = xp + pts
    const nSc   = score + pts
    setXp(nXp); setScore(nSc)
    audio.playCorrect()
    if (nXp >= xpForNext && level < maxLevel) {
      const next = level + 1
      setTimeout(() => {
        setLevel(next); setXp(0)
        setLvUp(true); audio.playLevelUp()
        setTimeout(() => setLvUp(false), 1800)
        updateLevelProgress(kidId, 'lectura', { level: next, xp: 0 })
        if (next >= 2) { awardBadge(kidId, 'lector'); awardBadge(kidId, 'level_2') }
        if (next >= 3) awardBadge(kidId, 'level_3')
      }, 1000)
    } else {
      updateLevelProgress(kidId, 'lectura', { level, xp: nXp })
    }
    logActivity({ kidId, type: 'game', label: 'Comprensión Lectora', detail: `Nv.${level} +${pts}` })
  }

  function startQuiz() { audio.stop(); setPhase('quiz') }

  function pick(idx) {
    if (chosen !== null) return
    setChosen(idx)
    const ok = idx === question.correct
    setResult(ok ? 'correct' : 'wrong')
    if (ok) onCorrect(); else audio.playWrong()
    setTimeout(() => {
      if (qi + 1 < passage.questions.length) {
        setQi(q => q + 1); setChosen(null); setResult(null)
      } else {
        setQuizDone(true)
        onCorrect(10) // passage completion bonus
      }
    }, 900)
  }

  function nextPassage() {
    setPi(p => p + 1); setPhase('read')
    setQi(0); setChosen(null); setResult(null); setQuizDone(false)
  }

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
      </div>

      {lvUp && (
        <div className={styles.levelUpBanner}>
          🎉 {lang === 'es' ? `¡Nivel ${level}!` : `Level ${level}!`}
        </div>
      )}

      {phase === 'read' ? (
        <>
          <div className={styles.passageCard}>
            <span className={styles.passageIcon}>{passage.icon}</span>
            <p className={styles.passageText}>{passage.text}</p>
          </div>
          <div className={styles.readControls}>
            <button className={styles.btnSpeak} onClick={() => audio.speak(passage.text)}>
              🔊 {lang === 'es' ? 'Escuchar' : 'Listen'}
            </button>
            <button className={styles.btnReady} onClick={startQuiz}>
              ✅ {lang === 'es' ? '¡Listo! Responder' : 'Ready! Answer'}
            </button>
          </div>
        </>
      ) : quizDone ? (
        <div className={styles.doneCard}>
          <span className={styles.doneIcon}>🏆</span>
          <p className={styles.doneText}>
            {lang === 'es' ? '¡Completaste esta lectura!' : 'You completed this passage!'}
          </p>
          <button className={styles.btnNext} onClick={nextPassage}>
            {lang === 'es' ? '📖 Siguiente' : '📖 Next'}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.progress}>
            {passage.questions.map((_, i) => (
              <div key={i} className={`${styles.pip}
                ${i < qi ? styles.pipDone : i === qi ? styles.pipActive : ''}`} />
            ))}
          </div>
          <p className={styles.questionText}>{question.q}</p>
          <div className={styles.options}>
            {question.options.map((opt, i) => (
              <button key={i} disabled={chosen !== null}
                className={`${styles.optBtn}
                  ${chosen === i && i === question.correct ? styles.optOk  : ''}
                  ${chosen === i && i !== question.correct ? styles.optErr : ''}
                  ${chosen !== null && i === question.correct ? styles.optOk : ''}`}
                onClick={() => pick(i)}>
                {opt}
              </button>
            ))}
          </div>
          {result && (
            <div className={`${styles.feedback} ${result === 'correct' ? styles.fbOk : styles.fbErr}`}>
              {result === 'correct'
                ? (lang === 'es' ? '🎉 ¡Correcto!' : '🎉 Correct!')
                : `💡 ${question.options[question.correct]}`}
            </div>
          )}
        </>
      )}
    </div>
  )
}
