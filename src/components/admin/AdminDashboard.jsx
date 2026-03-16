import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import { formatDuration, timeAgo, ACTIVITY_META, DAYS_ES } from '@/utils/helpers'
import PatternEditor from './PatternEditor'
import AddKidModal from './AddKidModal'
import PushPanel from './PushPanel'
import styles from './AdminDashboard.module.css'

/* ─────────────────────────────────────────────
   AdminDashboard — Full admin portal
   ───────────────────────────────────────────── */

export default function AdminDashboard({ onLock }) {
  const { kids, activities, settings, updateSettings, todayTime, weeklyData, blockKid, updateKid, signOut } = useApp()
  const [tab, setTab]             = useState('overview')
  const [showPatternEditor, setShowPatternEditor] = useState(false)
  const [showAddKid, setShowAddKid]               = useState(false)

  const totalTodayMins  = Object.values(todayTime).reduce((a, b) => a + b, 0)
  const totalActivities = activities.length
  const lockAttempts    = activities.filter(a => a.type === 'lock').length
  const videoMins       = activities.filter(a => a.type === 'video').length * 7  // avg 7min

  const maxBar = Math.max(...weeklyData)

  return (
    <div className={styles.root}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>🛡️ Portal de Padres</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className={styles.topRight}>
          <div className={styles.liveChip}>
            <span className={styles.liveDot} />
            {kids.filter(k => k.active).length} activo(s)
          </div>
          <button className={styles.lockBtn} onClick={onLock}>🔒 Bloquear</button>
          <button className={styles.signOutBtn} onClick={signOut}>Salir</button>
        </div>
      </div>

      {/* Tab nav */}
      <div className={styles.tabNav}>
        {[
          { id: 'overview',  label: '📊 Resumen' },
          { id: 'kids',      label: '👨‍👩‍👧 Perfiles' },
          { id: 'history',   label: '📋 Historial' },
          { id: 'push',      label: '🔔 Notificaciones' },
          { id: 'settings',  label: '⚙️ Config' },
        ].map(t => (
          <button key={t.id} className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>

        {/* ══ OVERVIEW ══ */}
        {tab === 'overview' && (
          <div className={styles.fadeIn}>
            {/* Stats row */}
            <div className={styles.statsGrid}>
              <StatCard accent="#38BDF8" icon="⏱️" label="Tiempo hoy"    value={formatDuration(totalTodayMins)}   sub="de 2h límite" />
              <StatCard accent="#34D399" icon="🎮" label="Actividades"   value={totalActivities}                  sub="juegos + videos" />
              <StatCard accent="#A78BFA" icon="📺" label="Videos (min)"  value={videoMins}                        sub="aprox." />
              <StatCard accent="#F87171" icon="🔒" label="Intentos bloqueo" value={lockAttempts}                  sub="hoy" />
            </div>

            {/* Weekly chart */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Tiempo semanal (minutos)</h3>
              <div className={styles.chartRow}>
                {weeklyData.map((val, i) => (
                  <div key={i} className={styles.barWrap}>
                    <div className={styles.barValue}>{val}</div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ height: `${(val / maxBar) * 100}%` }} />
                    </div>
                    <div className={styles.barLabel}>{DAYS_ES[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🕐 Actividad reciente</h3>
              {activities.slice(0, 6).map(a => <ActivityRow key={a.id} a={a} kids={kids} />)}
            </div>
          </div>
        )}

        {/* ══ KIDS ══ */}
        {tab === 'kids' && (
          <div className={styles.fadeIn}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>👨‍👩‍👧 Perfiles de niños</h3>
                <button className={styles.addBtn} onClick={() => setShowAddKid(true)}>+ Agregar</button>
              </div>
              {kids.map(kid => (
                <div key={kid.id} className={styles.kidCard}>
                  <div className={styles.kidAvatar} style={{ background: kid.color + '22', fontSize: '2rem' }}>
                    {kid.avatar}
                  </div>
                  <div className={styles.kidInfo}>
                    <div className={styles.kidName}>{kid.name}</div>
                    <div className={styles.kidMeta}>
                      {kid.age} años · Hoy: {formatDuration(todayTime[kid.id] || 0)}
                    </div>
                    <div className={styles.kidStatusRow}>
                      <span className={`${styles.statusPill} ${kid.active ? styles.pillGreen : styles.pillGray}`}>
                        {kid.active ? '🟢 Activo' : '⚫ Inactivo'}
                      </span>
                      <span className={`${styles.statusPill} ${kid.pinEnabled ? styles.pillBlue : styles.pillGray}`}>
                        {kid.pinEnabled ? '🔒 PIN activo' : '🔓 Sin PIN'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.kidActions}>
                    <button className={`${styles.actionBtn} ${styles.actionView}`}
                      onClick={() => alert(`Ver historial de ${kid.name}`)}>Ver</button>
                    {kid.active
                      ? <button className={`${styles.actionBtn} ${styles.actionBlock}`} onClick={() => blockKid(kid.id)}>Bloquear</button>
                      : <button className={`${styles.actionBtn} ${styles.actionGreen}`} onClick={() => updateKid(kid.id, { active: true })}>Activar</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {tab === 'history' && (
          <div className={styles.fadeIn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📋 Historial completo ({activities.length} entradas)</h3>
              <div className={styles.filterRow}>
                {['todo','game','video','lock'].map(f => (
                  <button key={f} className={styles.filterBtn}>
                    {f === 'todo' ? 'Todo' : ACTIVITY_META[f]?.icon + ' ' + ACTIVITY_META[f]?.label}
                  </button>
                ))}
              </div>
              {activities.map(a => <ActivityRow key={a.id} a={a} kids={kids} showFull />)}
            </div>
          </div>
        )}

        {/* ══ PUSH NOTIFICATIONS ══ */}
        {tab === 'push' && (
          <div className={styles.fadeIn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔔 Notificaciones push</h3>
              <PushPanel />
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab === 'settings' && (
          <div className={styles.fadeIn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>⚙️ Control parental</h3>

              <ToggleRow
                label="YouTube Kids activado"
                sub="Permite acceso a videos educativos"
                value={settings?.youtubeEnabled ?? true}
                onChange={v => updateSettings({ youtubeEnabled: v })}
              />
              <ToggleRow
                label={`Límite diario (${formatDuration(settings?.dailyLimitMinutes ?? 120)})`}
                sub="La app se bloquea al alcanzar el límite"
                value={settings?.dailyLimitEnabled ?? true}
                onChange={v => updateSettings({ dailyLimitEnabled: v })}
              />
              <ToggleRow
                label="Notificaciones a padres"
                sub="Aviso cuando el niño intenta salir de la app"
                value={settings?.notificationsEnabled ?? true}
                onChange={v => updateSettings({ notificationsEnabled: v })}
              />
              <ToggleRow
                label="Modo solo juegos"
                sub="Oculta la sección de videos completamente"
                value={settings?.gamesOnlyMode ?? false}
                onChange={v => updateSettings({ gamesOnlyMode: v })}
              />
            </div>

            {/* Pattern lock config */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔐 Patrón de desbloqueo</h3>
              <p className={styles.patternDesc}>
                Patrón actual: <strong>{(settings?.pattern ?? []).length} puntos</strong>
              </p>
              <div className={styles.patternPreview}>
                {Array.from({ length: 9 }, (_, i) => {
                  const pos = (settings?.pattern ?? []).indexOf(i)
                  return (
                    <div key={i} className={`${styles.previewDot} ${pos > -1 ? styles.previewDotActive : ''}`}>
                      {pos > -1 && <span>{pos + 1}</span>}
                    </div>
                  )
                })}
              </div>
              <button className={styles.changePatternBtn} onClick={() => setShowPatternEditor(true)}>
                🔄 Cambiar patrón
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {showPatternEditor && (
        <PatternEditor onClose={() => setShowPatternEditor(false)} />
      )}
      {showAddKid && (
        <AddKidModal onClose={() => setShowAddKid(false)} />
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function StatCard({ accent, icon, label, value, sub }) {
  return (
    <div className={styles.statCard} style={{ '--accent': accent }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  )
}

function ActivityRow({ a, kids, showFull }) {
  const meta = ACTIVITY_META[a.type] || ACTIVITY_META.game
  const kid  = kids.find(k => k.id === a.kidId)

  return (
    <div className={styles.actRow}>
      <div className={styles.actIcon} style={{ background: meta.bg, color: meta.color }}>
        {meta.icon}
      </div>
      <div className={styles.actContent}>
        <div className={styles.actTitle}>
          {kid && <span className={styles.actKid}>{kid.avatar} {kid.name} — </span>}
          {a.label}
        </div>
        <div className={styles.actDetail}>{a.detail}</div>
      </div>
      <div className={styles.actTime}>{timeAgo(a.ts)}</div>
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div>
        <div className={styles.toggleLabel}>{label}</div>
        {sub && <div className={styles.toggleSub}>{sub}</div>}
      </div>
      <button
        className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        onClick={() => onChange(!value)}
        aria-label={label}
      />
    </div>
  )
}
