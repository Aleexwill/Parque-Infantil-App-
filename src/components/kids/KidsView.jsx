import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import { GAMES } from '@/utils/helpers'
import { UI, LANGS } from '@/utils/i18n'
import GameArea from './GameArea'
import styles from './KidsView.module.css'

/* ─────────────────────────────────────────────
   KidsView — Main kids interface
   ───────────────────────────────────────────── */

export default function KidsView() {
  const { kids, activeKidId, setActiveKidId, settings, logActivity, levelProgress } = useApp()
  const [lang,       setLang]       = useState('es')
  const [activeGame, setActiveGame] = useState(null)

  const ui         = UI[lang] || UI.es
  const activeKids = kids.filter(k => k.active)
  const currentKid = kids.find(k => k.id === activeKidId) || activeKids[0]

  const getLvl = (gameId) =>
    levelProgress?.[activeKidId]?.[gameId]?.level ?? 1

  function handleGameOpen(game) {
    setActiveGame(game)
    logActivity({ kidId: activeKidId, type: 'game', label: game.title, detail: 'Iniciado' })
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (lang === 'en') {
      if (h < 12) return 'Good morning'
      if (h < 18) return 'Good afternoon'
      return 'Good evening'
    }
    if (h < 12) return '¡Buenos días'
    if (h < 18) return '¡Buenas tardes'
    return '¡Buenas noches'
  }

  return (
    <div className={styles.root}>
      <div className={styles.cloud1}>☁️</div>
      <div className={styles.cloud2}>☁️</div>
      <div className={styles.sun}>☀️</div>

      <div className={styles.content}>

        {/* ── Header ── */}
        <div className={styles.header}>
          {/* Lang toggle */}
          <div className={styles.langRow}>
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`${styles.langBtn} ${lang === l.code ? styles.langBtnActive : ''}`}
                onClick={() => { setLang(l.code); setActiveGame(null) }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <h1 className={styles.greeting}>
            {greeting()}, {currentKid?.name}! 🌈
          </h1>
          <p className={styles.subGreeting}>{ui.subGreeting}</p>

          {/* Kid selector */}
          <div className={styles.kidRow}>
            {activeKids.map(kid => (
              <button
                key={kid.id}
                className={`${styles.kidBtn} ${kid.id === activeKidId ? styles.kidBtnActive : ''}`}
                onClick={() => setActiveKidId(kid.id)}
                style={{ '--kid-color': kid.color }}
              >
                <span className={styles.kidEmoji}>{kid.avatar}</span>
                <span className={styles.kidName}>{kid.name}</span>
                {kid.id === activeKidId && <span className={styles.activeIndicator} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Games grid ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{ui.gamesTitle}</h2>
          <div className={styles.gamesGrid}>
            {GAMES.map((game, i) => {
              const lvl = getLvl(game.id)
              const title = lang === 'en' ? (game.titleEn || game.title) : game.title
              const cat   = lang === 'en' ? (game.categoryEn || game.category) : game.category
              return (
                <button
                  key={game.id}
                  className={`${styles.gameCard} ${activeGame?.id === game.id ? styles.gameCardActive : ''}`}
                  onClick={() => handleGameOpen(game)}
                  style={{ '--g1': game.gradient[0], '--g2': game.gradient[1], animationDelay: `${i * 0.06}s` }}
                >
                  {game.badge && <span className={styles.badge}>{game.badge}</span>}
                  <span className={styles.levelBadge}>{ui.levelBadge(lvl)}</span>
                  <span className={styles.gameIcon}>{game.icon}</span>
                  <strong className={styles.gameTitle}>{title}</strong>
                  <span className={styles.gameCategory}>{cat}</span>
                  {/* mini level bar */}
                  <div className={styles.miniBar}>
                    <div
                      className={styles.miniBarFill}
                      style={{ width: `${Math.min(100, (lvl / (game.maxLevels || 8)) * 100)}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Active game ── */}
        {activeGame && (
          <section className={styles.section}>
            <GameArea
              game={activeGame}
              onClose={() => setActiveGame(null)}
              kidId={activeKidId}
              lang={lang}
            />
          </section>
        )}

        {/* ── YouTube ── */}
        {settings?.youtubeEnabled && !settings?.gamesOnlyMode && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{ui.videosTitle}</h2>
            <div className={styles.ytWrapper}>
              <iframe
                src="https://www.youtube.com/embed/videoseries?list=PLvFQJa8SB4bk_7JYUVU_NXJ1z4zPHJAMN&controls=1&rel=0&modestbranding=1&iv_load_policy=3"
                title="YouTube Kids Educational Content"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.ytFrame}
                onLoad={() => logActivity({ kidId: activeKidId, type: 'video', label: 'Videos educativos', detail: 'YouTube Kids' })}
              />
            </div>
            <div className={styles.ytNote}>
              <span>🔒</span>
              <span>{ui.videosSafe}</span>
            </div>
          </section>
        )}

        {settings?.gamesOnlyMode && (
          <div className={styles.modeNotice}>{ui.videosLocked}</div>
        )}

      </div>
    </div>
  )
}
