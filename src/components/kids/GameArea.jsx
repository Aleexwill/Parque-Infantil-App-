import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/AppContext'
import { useAudio } from '@/hooks/useAudio'
import {
  LETRAS_LEVELS, ESCRITURA_LEVELS, LOGICA_LEVELS,
  NUMEROS_LEVELS, COLORES_LEVELS, MEMORIA_LEVELS, BADGES,
  LETRAS_EXTRA, LOGICA_EXTRA, NUMEROS_EXTRA,
  SILABAS_LEVELS, LECTURA_LEVELS, BADGES_EXTRA,
} from '@/utils/gameContent'
import { LETRAS_EN, LOGICA_EN, NUMEROS_EN, ESCRITURA_EN, UI, LANGS } from '@/utils/i18n'
import SilabasGame from './SilabasGame'
import LecturaGame from './LecturaGame'
import styles from './GameArea.module.css'

// Merge base + extra levels
const ALL_LETRAS  = [...LETRAS_LEVELS,  ...LETRAS_EXTRA]
const ALL_LOGICA  = [...LOGICA_LEVELS,  ...LOGICA_EXTRA]
const ALL_NUMEROS = [...NUMEROS_LEVELS, ...NUMEROS_EXTRA]
const ALL_BADGES  = [...BADGES, ...BADGES_EXTRA]

/* ═══════════════════════════════════════════════
   Shared engine hook
   ═══════════════════════════════════════════════ */
function useGameEngine({ kidId, gameId, levels, lang = 'es' }) {
  const { levelProgress, updateLevelProgress, logActivity, awardBadge, earnedBadges } = useApp()
  const audio = useAudio({ lang: lang === 'es' ? 'es-ES' : 'en-US' })

  const getLevelProgress = (kid, game) =>
    levelProgress?.[kid]?.[game] ?? { level: 1, xp: 0, questionsAnswered: 0, bestStreak: 0 }
  const getEarnedBadges = (kid) => earnedBadges?.[kid] || []

  const saved   = getLevelProgress(kidId, gameId)
  const [level, setLevel]   = useState(saved.level ?? 1)
  const [xp, setXp]         = useState(saved.xp ?? 0)
  const [streak, setStreak] = useState(0)
  const [score, setScore]   = useState(0)
  const [answered, setAnswered] = useState(0)
  const [newBadge, setNewBadge] = useState(null)

  const levelData  = levels[Math.min(level - 1, levels.length - 1)]
  const maxLevel   = levels.length
  const xpForNext  = level * 80
  const progress   = Math.min(100, Math.round((xp / xpForNext) * 100))

  function tryBadge(id) {
    const already = getEarnedBadges(kidId)
    if (!already.includes(id)) {
      awardBadge(kidId, id)
      const badge = ALL_BADGES.find(b => b.id === id)
      if (badge) { setNewBadge(badge); audio.playBadge(); setTimeout(() => setNewBadge(null), 2500) }
    }
  }

  function onCorrect(pts = 10) {
    const ns     = streak + 1
    const bonus  = ns >= 3 ? 5 : 0
    const gained = pts + bonus
    const nXp    = xp + gained
    const nScore = score + gained
    const nAns   = answered + 1
    setStreak(ns); setXp(nXp); setScore(nScore); setAnswered(nAns)
    audio.playCorrect()
    if (ns === 3)  tryBadge('streak_3')
    if (ns === 5)  tryBadge('streak_5')
    if (ns === 10) tryBadge('perfect')
    if (nScore >= 50)  tryBadge('score_50')
    if (nScore >= 100) tryBadge('score_100')
    if (nAns === 1)    tryBadge('first_game')
    if (nXp >= xpForNext && level < maxLevel) {
      const nextLvl = level + 1
      setTimeout(() => {
        setLevel(nextLvl); setXp(0)
        audio.playLevelUp()
        if (nextLvl >= 2) tryBadge('level_2')
        if (nextLvl >= 3) tryBadge('level_3')
        if (nextLvl >= 4) tryBadge('level_4')
        if (nextLvl >= 5) tryBadge('level_5')
        if (nextLvl >= 8) tryBadge('level_8')
        updateLevelProgress(kidId, gameId, { level: nextLvl, xp: 0, questionsAnswered: nAns, bestStreak: Math.max(ns, saved.bestStreak || 0) })
      }, 1200)
    } else {
      updateLevelProgress(kidId, gameId, { level, xp: nXp, questionsAnswered: nAns, bestStreak: Math.max(ns, saved.bestStreak || 0) })
    }
    logActivity({ kidId, type: 'game', label: gameId, detail: `Nv.${level} +${gained} pts` })
  }

  function onWrong() {
    setStreak(0)
    audio.playWrong()
  }

  return { level, levelData, maxLevel, xp, xpForNext, progress, streak, score, onCorrect, onWrong, newBadge, tryBadge, audio }
}

/* ─── ScoreBar ─── */
function ScoreBar({ score, progress, streak, level, maxLevel, xp, xpForNext }) {
  return (
    <div className={styles.scoreBar}>
      <div className={styles.scoreLeft}>
        <span className={styles.scoreNum}>⭐ {score}</span>
        {streak >= 2 && <span className={styles.streakPill}>🔥 ×{streak}</span>}
      </div>
      <div className={styles.progressSection}>
        <span className={styles.levelLabel}>Nv.{level}{level < maxLevel ? `→${level+1}` : ' MAX'}</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.xpLabel}>{xp}/{xpForNext}</span>
      </div>
    </div>
  )
}

/* ─── Level selector ─── */
function LevelSelector({ currentLevel, maxLevel, levelData, onSelect, selectedLevel }) {
  return (
    <div className={styles.levelRow}>
      <span className={styles.lvlTag}>Nivel:</span>
      {Array.from({ length: maxLevel }, (_, i) => i + 1).map(l => (
        <button key={l}
          className={`${styles.lvlBtn} ${l === selectedLevel ? styles.lvlBtnActive : ''} ${l > currentLevel ? styles.lvlBtnLocked : ''}`}
          onClick={() => l <= currentLevel && onSelect(l)}>
          {l > currentLevel ? '🔒' : l}
        </button>
      ))}
      <span className={styles.lvlName} style={{ color: levelData.color }}>· {levelData.name}</span>
    </div>
  )
}

/* ─── Badge toast ─── */
function BadgeToast({ badge }) {
  if (!badge) return null
  return (
    <div className={styles.badgeToast}>
      <span>{badge.icon}</span>
      <div>
        <div className={styles.badgeTitle}>¡Logro desbloqueado!</div>
        <div className={styles.badgeName}>{badge.label}</div>
      </div>
    </div>
  )
}

/* ─── Level-up banner ─── */
function LevelUpBanner({ level }) {
  return <div className={styles.levelUpBanner}>🎉 ¡Subiste al nivel {level}! 🚀</div>
}

/* ─── Multi-choice options ─── */
function Options({ options, chosen, correct, onChoose }) {
  return (
    <div className={styles.optGrid}>
      {options.map((opt, i) => (
        <button key={i} disabled={chosen !== null}
          className={`${styles.optBtn}
            ${chosen === i && i === correct ? styles.optOk  : ''}
            ${chosen === i && i !== correct ? styles.optErr : ''}
            ${chosen !== null && i === correct ? styles.optOk : ''}
          `}
          onClick={() => onChoose(i)}>{opt}
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   📖 LETRAS
   ═══════════════════════════════════════════════ */
function LetrasGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Aprendo Letras', levels: LETRAS_LEVELS })
  const [sel, setSel]   = useState(engine.level)
  const [qIdx, setQIdx] = useState(0)
  const [picked, setPicked] = useState([])
  const [result, setResult] = useState(null)
  const [pool, setPool] = useState([])
  const [lvUp, setLvUp] = useState(false)

  const ld = LETRAS_LEVELS[sel - 1]
  const q  = ld.questions[qIdx % ld.questions.length]
  const ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  useEffect(() => {
    const needed = [...new Set([...q.answer])]
    const extra  = [...ALL].filter(l => !needed.includes(l)).sort(() => Math.random()-.5).slice(0, 9 - needed.length)
    setPool([...needed, ...extra].sort(() => Math.random()-.5))
    setPicked([]); setResult(null)
  }, [qIdx, sel])

  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  const pick = (l) => {
    if (result) return
    const next = [...picked, l]
    setPicked(next)
    if (next.join('') === q.answer) {
      setResult('ok'); engine.onCorrect()
      setTimeout(() => setQIdx(i=>i+1), 900)
    } else if (next.length >= q.answer.length) {
      setResult('err'); engine.onWrong()
      setTimeout(() => { setPicked([]); setResult(null) }, 700)
    }
  }

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <p className={styles.instr}>¿Qué {q.category.toLowerCase()} es esta?</p>
      <span className={styles.bigEmoji}>{q.hint}</span>
      <div className={styles.wordRow}>
        {q.answer.split('').map((_,i) => (
          <div key={i} className={`${styles.slot} ${picked[i]?styles.slotFilled:''} ${result==='ok'?styles.slotOk:result==='err'&&picked[i]?styles.slotErr:''}`}>
            {picked[i]||'·'}
          </div>
        ))}
      </div>
      <div className={styles.letterPool}>
        {pool.map((l,i) => (
          <button key={i} className={`${styles.letterBtn} ${picked.includes(l)?styles.letterUsed:''}`}
            onClick={() => pick(l)} disabled={!!result}>{l}</button>
        ))}
      </div>
      <p className={`${styles.resultMsg} ${result==='ok'?styles.msgOk:result==='err'?styles.msgErr:''}`}>
        {result==='ok'?'🎉 ¡Correcto!':result==='err'?'😅 ¡Inténtalo de nuevo!':`Categoría: ${q.category}`}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ✏️ ESCRITURA
   ═══════════════════════════════════════════════ */
function EscrituraGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Escritura Fun', levels: ESCRITURA_LEVELS })
  const [sel, setSel]     = useState(engine.level)
  const [qIdx, setQIdx]   = useState(0)
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [lvUp, setLvUp]   = useState(false)
  const inputRef = useRef(null)

  const ld = ESCRITURA_LEVELS[sel - 1]
  const q  = ld.questions[qIdx % ld.questions.length]

  useEffect(() => { setValue(''); setResult(null); setTimeout(()=>inputRef.current?.focus(), 100) }, [qIdx, sel])
  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  const check = (v) => {
    setValue(v)
    if (v.toLowerCase().trim() === q.answer) {
      setResult('ok'); engine.onCorrect()
      setTimeout(() => setQIdx(i=>i+1), 900)
    } else setResult(v.length>0 ? 'try' : null)
  }

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <p className={styles.instr}>Escribe el nombre de lo que ves:</p>
      <span className={styles.bigEmoji}>{q.hint}</span>
      <p className={styles.clue}>💡 {q.clue}</p>
      <input ref={inputRef}
        className={`${styles.writeInput} ${result==='ok'?styles.writeOk:''}`}
        value={value} onChange={e=>check(e.target.value)}
        placeholder="Escribe aquí..." autoComplete="off" autoCorrect="off" spellCheck="false"
      />
      <div className={styles.hintRow}>
        {q.answer.split('').map((c,i) => (
          <span key={i} className={`${styles.hintChar} ${value[i]?.toLowerCase()===c?styles.hintOk:value.length>i?styles.hintWrong:''}`}>
            {i===0 ? c.toUpperCase() : '·'}
          </span>
        ))}
      </div>
      <p className={`${styles.resultMsg} ${result==='ok'?styles.msgOk:result==='try'?styles.msgTry:''}`}>
        {result==='ok'?'🎉 ¡Perfecto!':result==='try'?'💪 ¡Casi!':'\u00A0'}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   🧩 LÓGICA
   ═══════════════════════════════════════════════ */
function LogicGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Lógica Genio', levels: LOGICA_LEVELS })
  const [sel, setSel]     = useState(engine.level)
  const [qIdx, setQIdx]   = useState(0)
  const [chosen, setChosen] = useState(null)
  const [lvUp, setLvUp]   = useState(false)

  const ld = LOGICA_LEVELS[sel - 1]
  const q  = ld.questions[qIdx % ld.questions.length]

  useEffect(() => { setChosen(null) }, [qIdx, sel])
  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  const choose = (i) => {
    if (chosen !== null) return
    setChosen(i)
    if (i===q.correct) engine.onCorrect(12); else engine.onWrong()
    setTimeout(() => setQIdx(n=>n+1), 950)
  }

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <p className={styles.instr}>{q.prompt}</p>
      <div className={styles.sequenceBox}>{q.sequence}</div>
      <Options options={q.options} chosen={chosen} correct={q.correct} onChoose={choose} />
      {chosen !== null && (
        <p className={`${styles.resultMsg} ${chosen===q.correct?styles.msgOk:styles.msgErr}`}>
          {chosen===q.correct ? '🎉 ¡Correcto!' : `💡 Pista: ${q.hint}`}
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   🔢 NÚMEROS
   ═══════════════════════════════════════════════ */
function NumerosGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Números Mágicos', levels: NUMEROS_LEVELS })
  const [sel, setSel]       = useState(engine.level)
  const [qIdx, setQIdx]     = useState(0)
  const [chosen, setChosen] = useState(null)
  const [lvUp, setLvUp]     = useState(false)

  const ld = NUMEROS_LEVELS[sel - 1]
  const q  = ld.questions[qIdx % ld.questions.length]

  useEffect(() => { setChosen(null) }, [qIdx, sel])
  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  const choose = (opt) => {
    if (chosen !== null) return
    setChosen(opt)
    if (parseInt(opt)===q.count) engine.onCorrect(); else engine.onWrong()
    setTimeout(() => setQIdx(n=>n+1), 950)
  }

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <p className={styles.instr}>{q.type==='count' ? '¿Cuántos hay? ¡Cuenta!' : '¿Cuánto es?'}</p>
      {q.type==='count'
        ? <div className={styles.countBox}>{q.items}</div>
        : <div className={styles.mathBox}>{q.display}</div>
      }
      <div className={styles.optGrid}>
        {q.options.map(opt => (
          <button key={opt} disabled={chosen !== null}
            className={`${styles.optBtn} ${styles.numBtn}
              ${chosen===opt && parseInt(opt)===q.count ? styles.optOk : ''}
              ${chosen===opt && parseInt(opt)!==q.count ? styles.optErr : ''}
              ${chosen!==null && parseInt(opt)===q.count ? styles.optOk : ''}
            `}
            onClick={() => choose(opt)}>{opt}
          </button>
        ))}
      </div>
      {chosen !== null && (
        <p className={`${styles.resultMsg} ${parseInt(chosen)===q.count?styles.msgOk:styles.msgErr}`}>
          {parseInt(chosen)===q.count ? '🎉 ¡Exacto!' : `✅ Era: ${q.count}`}
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   🎨 COLORES
   ═══════════════════════════════════════════════ */
function ColoresGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Colores y Formas', levels: COLORES_LEVELS })
  const [sel, setSel]       = useState(engine.level)
  const [qIdx, setQIdx]     = useState(0)
  const [chosen, setChosen] = useState(null)
  const [lvUp, setLvUp]     = useState(false)

  const ld = COLORES_LEVELS[sel - 1]
  const q  = ld.questions[qIdx % ld.questions.length]

  useEffect(() => { setChosen(null) }, [qIdx, sel])
  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  const choose = (i) => {
    if (chosen !== null) return
    setChosen(i)
    if (i===q.correct) engine.onCorrect(); else engine.onWrong()
    setTimeout(() => setQIdx(n=>n+1), 950)
  }

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <p className={styles.instr}>{q.question}</p>
      <span className={styles.bigEmoji} style={{fontSize:'3.8rem'}}>{q.hint}</span>
      <Options options={q.options} chosen={chosen} correct={q.correct} onChoose={choose} />
      {chosen !== null && (
        <p className={`${styles.resultMsg} ${chosen===q.correct?styles.msgOk:styles.msgErr}`}>
          {chosen===q.correct ? '🎉 ¡Bien visto!' : `✅ Era: ${q.options[q.correct]}`}
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   🃏 MEMORIA
   ═══════════════════════════════════════════════ */
function createBoard(pairs) {
  return [...pairs,...pairs].sort(()=>Math.random()-.5).map((e,i)=>({id:i,emoji:e,revealed:false,matched:false}))
}

function MemoriaGame({ kidId }) {
  const engine = useGameEngine({ kidId, gameId: 'Juego de Memoria', levels: MEMORIA_LEVELS })
  const [sel, setSel]         = useState(engine.level)
  const [board, setBoard]     = useState(() => createBoard(MEMORIA_LEVELS[0].pairs))
  const [open, setOpen]       = useState([])
  const [moves, setMoves]     = useState(0)
  const [won, setWon]         = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [lvUp, setLvUp]       = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (engine.level > sel) { setLvUp(true); setSel(engine.level); setTimeout(()=>setLvUp(false),1800) }
  }, [engine.level])

  useEffect(() => { reset() }, [sel])

  function reset() {
    const ld = MEMORIA_LEVELS[sel-1]
    clearInterval(timerRef.current)
    setBoard(createBoard(ld.pairs))
    setOpen([]); setMoves(0); setWon(false)
    setTimeLeft(ld.timeLimit ?? null)
  }

  useEffect(() => {
    const ld = MEMORIA_LEVELS[sel-1]
    if (!ld.timeLimit || won) return
    timerRef.current = setInterval(() => setTimeLeft(t => t>1 ? t-1 : 0), 1000)
    return () => clearInterval(timerRef.current)
  }, [sel, won])

  const flip = (card) => {
    if (card.revealed||card.matched||open.length>=2||won) return
    const ld = MEMORIA_LEVELS[sel-1]
    if (ld.timeLimit && timeLeft===0) return
    const nb = board.map(c=>c.id===card.id?{...c,revealed:true}:c)
    const no = [...open,card]
    setBoard(nb); setOpen(no)
    if (no.length===2) {
      setMoves(m=>m+1)
      if (no[0].emoji===no[1].emoji) {
        setTimeout(()=>{
          const ub = nb.map(c=>no.some(o=>o.id===c.id)?{...c,matched:true}:c)
          setBoard(ub); setOpen([])
          if (ub.every(c=>c.matched)) {
            setWon(true); clearInterval(timerRef.current)
            engine.onCorrect(20)
            engine.tryBadge('memory_win')
          }
        },500)
      } else {
        setTimeout(()=>{ setBoard(b=>b.map(c=>no.some(o=>o.id===c.id)?{...c,revealed:false}:c)); setOpen([]) },700)
      }
    }
  }

  const ld      = MEMORIA_LEVELS[sel-1]
  const pairs   = ld.pairs.length
  const matched = board.filter(c=>c.matched).length/2
  const cols    = pairs<=4?4:pairs<=6?4:5
  const timeOut = ld.timeLimit && timeLeft===0 && !won

  return (
    <div className={styles.game}>
      <BadgeToast badge={engine.newBadge} />
      {lvUp && <LevelUpBanner level={engine.level} />}
      <LevelSelector currentLevel={engine.level} maxLevel={engine.maxLevel} levelData={ld} onSelect={setSel} selectedLevel={sel} />
      <ScoreBar {...engine} />
      <div className={styles.memMeta}>
        <span>🃏 {matched}/{pairs}</span>
        <span>🎯 {moves} mov.</span>
        {ld.timeLimit && <span className={`${styles.timer} ${timeLeft<=10?styles.timerUrgent:''}`}>⏱️ {timeLeft}s</span>}
        <button className={styles.resetBtn} onClick={reset}>🔄</button>
      </div>
      <div className={styles.memGrid} style={{'--cols':cols}}>
        {board.map(card=>(
          <button key={card.id}
            className={`${styles.memCard} ${card.revealed||card.matched?styles.memOpen:''} ${card.matched?styles.memMatched:''}`}
            onClick={()=>flip(card)}>
            <span className={styles.memFront}>❓</span>
            <span className={styles.memBack}>{card.emoji}</span>
          </button>
        ))}
      </div>
      {won && <div className={styles.winBanner}>🏆 ¡Ganaste en {moves} movimientos! 🎉</div>}
      {timeOut && (
        <div className={styles.loseBanner}>
          ⏰ ¡Se acabó el tiempo!
          <button className={styles.tryAgainBtn} onClick={reset}>🔄 Reintentar</button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   WRAPPER
   ═══════════════════════════════════════════════ */
const GAME_LEVELS = {
  letras:    (lang) => lang === 'en' ? LETRAS_EN    : ALL_LETRAS,
  escritura: (lang) => lang === 'en' ? ESCRITURA_EN : ESCRITURA_LEVELS,
  logica:    (lang) => lang === 'en' ? LOGICA_EN    : ALL_LOGICA,
  numeros:   (lang) => lang === 'en' ? NUMEROS_EN   : ALL_NUMEROS,
  colores:   ()     => COLORES_LEVELS,
  memoria:   ()     => MEMORIA_LEVELS,
  silabas:   ()     => SILABAS_LEVELS,
  lectura:   ()     => LECTURA_LEVELS,
}

const GAME_COMPONENTS = {
  letras: LetrasGame, escritura: EscrituraGame,
  logica: LogicGame,  numeros: NumerosGame,
  colores: ColoresGame, memoria: MemoriaGame,
  silabas: SilabasGame, lectura: LecturaGame,
}

export default function GameArea({ game, onClose, kidId, lang = 'es' }) {
  const levels    = (GAME_LEVELS[game.id] || (() => []))(lang)
  const Component = GAME_COMPONENTS[game.id]
  const { levelProgress } = useApp()
  const prog = levelProgress?.[kidId]?.[game.id] ?? { level: 1, xp: 0 }
  const title = lang === 'en' ? (game.titleEn || game.title) : game.title

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.gameTitle}>{game.icon} {title}</h2>
        <div className={styles.headerRight}>
          <span className={styles.headerLevel}>
            {lang === 'es' ? 'Nv.' : 'Lv.'} {prog.level} / {game.maxLevels || levels.length}
          </span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
      </div>
      <div className={styles.body}>
        {Component
          ? <Component kidId={kidId} lang={lang} />
          : <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>Juego no disponible</p>
        }
      </div>
    </div>
  )
}
