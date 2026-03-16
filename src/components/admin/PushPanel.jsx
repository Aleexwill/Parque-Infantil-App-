import { useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useApp } from '@/lib/AppContext'
import styles from './PushPanel.module.css'

/* ─────────────────────────────────────────────
   PushPanel — Push notification management UI
   Used inside AdminDashboard → ⚙️ Config tab
   ───────────────────────────────────────────── */

export default function PushPanel() {
  const { family, user, settings, updateSettings } = useApp()
  const [labelInput, setLabelInput] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [busy,       setBusy]       = useState(false)

  const push = usePushNotifications({
    familyId: family?.id,
    userId:   user?.id,
    enabled:  settings?.notificationsEnabled ?? true,
  })

  async function handleSubscribe() {
    setBusy(true)
    if (labelInput.trim()) push.setDeviceLabel(labelInput.trim())
    const result = await push.subscribe()
    setBusy(false)
    if (!result.ok && result.reason === 'permission_denied') {
      setTestResult({ ok: false, msg: 'Permiso denegado. Actívalo en la configuración del navegador.' })
    }
  }

  async function handleTest() {
    setBusy(true)
    setTestResult(null)
    const result = await push.sendTestNotification()
    setTestResult(result.ok
      ? { ok: true,  msg: `✅ Enviada a ${result.sent} dispositivo(s)` }
      : { ok: false, msg: `❌ Error: ${result.reason}` }
    )
    setBusy(false)
  }

  const STATUS_INFO = {
    idle:        { icon: '🔕', label: 'Sin activar',       color: '#64748B' },
    unsupported: { icon: '🚫', label: 'No compatible',     color: '#F87171' },
    denied:      { icon: '🔴', label: 'Permiso denegado',  color: '#F87171' },
    asking:      { icon: '⏳', label: 'Pidiendo permiso…', color: '#FBBF24' },
    subscribing: { icon: '⏳', label: 'Activando…',        color: '#FBBF24' },
    subscribed:  { icon: '🔔', label: 'Activas',           color: '#34D399' },
    error:       { icon: '⚠️', label: 'Error',             color: '#F87171' },
  }

  const si = STATUS_INFO[push.status] || STATUS_INFO.idle

  return (
    <div className={styles.root}>
      {/* Status header */}
      <div className={styles.statusRow}>
        <span className={styles.statusIcon}>{si.icon}</span>
        <div>
          <div className={styles.statusLabel} style={{ color: si.color }}>
            Notificaciones push: <strong>{si.label}</strong>
          </div>
          {!push.isSupported && (
            <div className={styles.hint}>Tu navegador no soporta Web Push. Usa Chrome o Firefox.</div>
          )}
          {push.status === 'denied' && (
            <div className={styles.hint}>
              Ve a Configuración del navegador → Permisos del sitio → Notificaciones → Permitir
            </div>
          )}
          {push.error && <div className={styles.hint} style={{ color: '#F87171' }}>{push.error}</div>}
        </div>

        {push.isSubscribed
          ? <button className={styles.btnDanger} onClick={push.unsubscribe} disabled={busy}>
              Desactivar
            </button>
          : push.isSupported && push.status !== 'denied' && (
            <button className={styles.btnPrimary} onClick={handleSubscribe} disabled={busy}>
              {busy ? <span className={styles.spinner} /> : '🔔 Activar'}
            </button>
          )
        }
      </div>

      {/* Device label input (before subscribing) */}
      {!push.isSubscribed && push.isSupported && push.status !== 'denied' && (
        <div className={styles.labelRow}>
          <input
            className={styles.input}
            placeholder="Nombre del dispositivo (ej: Mi teléfono)"
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
            maxLength={40}
          />
        </div>
      )}

      {/* Notification triggers config */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>🎯 ¿Cuándo notificar?</div>
        <TriggerRow
          label="Intento de salir de la app"
          sub="Cuando un niño intenta salir con patrón incorrecto"
          icon="🔒"
          value={settings?.notifyLockAttempt ?? true}
          onChange={v => updateSettings({ notifyLockAttempt: v })}
        />
        <TriggerRow
          label="Límite de tiempo alcanzado"
          sub="Cuando un niño llega a su límite diario"
          icon="⏰"
          value={settings?.notifyTimeLimit ?? true}
          onChange={v => updateSettings({ notifyTimeLimit: v })}
        />
        <TriggerRow
          label="Inicio de sesión"
          sub="Cuando un niño abre la app"
          icon="👋"
          value={settings?.notifySessionStart ?? false}
          onChange={v => updateSettings({ notifySessionStart: v })}
        />
        <TriggerRow
          label="Logros en juegos"
          sub="Cuando un niño desbloquea un badge o sube de nivel"
          icon="🏆"
          value={settings?.notifyGameComplete ?? false}
          onChange={v => updateSettings({ notifyGameComplete: v })}
        />
      </div>

      {/* Test button */}
      {push.isSubscribed && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>🧪 Prueba</div>
          <div className={styles.testRow}>
            <p className={styles.testHint}>
              Envía una notificación de prueba a todos tus dispositivos activos ahora mismo.
            </p>
            <button className={styles.btnTest} onClick={handleTest} disabled={busy}>
              {busy ? <span className={styles.spinner} /> : '📤 Enviar prueba'}
            </button>
          </div>
          {testResult && (
            <div className={`${styles.testResult} ${testResult.ok ? styles.resultOk : styles.resultErr}`}>
              {testResult.msg}
            </div>
          )}
        </div>
      )}

      {/* Active devices */}
      {push.devices.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>📱 Dispositivos activos ({push.devices.filter(d => d.active).length})</div>
          {push.devices.map(dev => (
            <div key={dev.id} className={styles.deviceRow}>
              <span className={styles.deviceIcon}>{dev.active ? '✅' : '❌'}</span>
              <div className={styles.deviceInfo}>
                <div className={styles.deviceName}>{dev.device_label || 'Dispositivo desconocido'}</div>
                <div className={styles.deviceDate}>
                  Agregado: {new Date(dev.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
              {dev.active && (
                <button className={styles.btnRemove} onClick={() => push.removeDevice(dev.id)}>
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recent logs */}
      {push.logs.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>📋 Historial de envíos</div>
          <div className={styles.logList}>
            {push.logs.slice(0, 8).map(log => (
              <div key={log.id} className={styles.logRow}>
                <span className={styles.logEvent}>{eventLabel(log.event)}</span>
                <span className={styles.logStats}>✅ {log.sent} · ❌ {log.failed}</span>
                <span className={styles.logDate}>
                  {new Date(log.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup instructions if VAPID not configured */}
      {!import.meta.env.VITE_FIREBASE_VAPID_KEY && (
        <div className={styles.setupWarning}>
          <strong>⚠️ Configuración pendiente</strong>
          <p>Agrega <code>VITE_FIREBASE_VAPID_KEY</code> en tu archivo <code>.env</code> y despliega la Cloud Function <code>sendPush</code>. Ver <code>DEPLOY.md</code> para instrucciones.</p>
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */
function TriggerRow({ label, sub, icon, value, onChange }) {
  return (
    <div className={styles.triggerRow}>
      <span className={styles.triggerIcon}>{icon}</span>
      <div className={styles.triggerText}>
        <div className={styles.triggerLabel}>{label}</div>
        <div className={styles.triggerSub}>{sub}</div>
      </div>
      <button
        className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        onClick={() => onChange(!value)}
        aria-label={label}
      />
    </div>
  )
}

function eventLabel(event) {
  const map = {
    lock_attempt:  '🔒 Intento de salida',
    time_limit:    '⏰ Tiempo límite',
    session_start: '👋 Sesión iniciada',
    game_complete: '🏆 Logro',
    test:          '🧪 Prueba',
  }
  return map[event] || event
}
