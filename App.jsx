import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import KidsView from '@/components/kids/KidsView'
import LockScreen from '@/components/lock/LockScreen'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AuthScreen from '@/components/auth/AuthScreen'
import LoadingScreen from '@/components/shared/LoadingScreen'
import '@/styles/globals.css'

/* ─────────────────────────────────────────────
   KidSpark — Root App
   Flujo: login → kids | kids → lock → admin
   ───────────────────────────────────────────── */

export default function App() {
  const { isAuthenticated, loading, authError } = useApp()

  // view: 'kids' | 'lock' | 'admin'
  const [view,          setView]          = useState('kids')
  const [adminUnlocked, setAdminUnlocked] = useState(false)

  if (loading)    return <LoadingScreen message="Conectando con Firebase..." />
  if (!isAuthenticated) return <AuthScreen />
  if (authError && authError.includes('configuration')) return <ConfigError error={authError} />

  const goToAdmin = () => { setAdminUnlocked(true);  setView('admin') }
  const goToKids  = () => { setAdminUnlocked(false); setView('kids')  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Nav bar — visible en lock y admin ── */}
      {view !== 'kids' && (
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', background: '#0F172A',
          borderBottom: '1px solid #1E293B', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <span style={{
            fontFamily: "'Baloo 2', cursive", fontSize: '1.3rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #4FC3F7, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            🌟 KidSpark
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <NavBtn onClick={goToKids} active={view === 'kids'}>👦 Niños</NavBtn>
            {!adminUnlocked && (
              <NavBtn onClick={() => setView('lock')} active={view === 'lock'}>🔒 Desbloquear</NavBtn>
            )}
            {adminUnlocked && (
              <NavBtn onClick={() => setView('admin')} active={view === 'admin'}>⚙️ Admin</NavBtn>
            )}
          </div>
        </nav>
      )}

      {/* ── Botón flotante "Padres" en vista niño ── */}
      {view === 'kids' && (
        <button
          onClick={() => setView('lock')}
          title="Acceso para padres — patrón de desbloqueo"
          style={{
            position: 'fixed', bottom: 20, right: 16, zIndex: 50,
            background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56,189,248,0.3)', borderRadius: 40,
            padding: '10px 20px', color: '#94A3B8',
            fontSize: '0.8rem', fontWeight: 700,
            fontFamily: "'Nunito', sans-serif", cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#38BDF8'; e.currentTarget.style.borderColor = '#38BDF8' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)' }}
        >
          🔐 <span>Portal Padres</span>
        </button>
      )}

      {/* ── Vistas ── */}
      {view === 'kids'  && <KidsView />}
      {view === 'lock'  && (
        <LockScreen
          onUnlock={goToAdmin}
          onBack={() => setView('kids')}
        />
      )}
      {view === 'admin' && <AdminDashboard onLock={goToKids} />}
    </div>
  )
}

function NavBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 8,
      border: active ? '1px solid #334155' : '1px solid transparent',
      background: active ? '#1C2638' : 'transparent',
      color: active ? '#38BDF8' : '#64748B',
      fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem',
      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {children}
    </button>
  )
}

function ConfigError({ error }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#050C1F', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#111827', border: '1px solid #F87171',
        borderRadius: 20, padding: '32px 28px', maxWidth: 440, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: "'Baloo 2', cursive", color: '#F87171', marginBottom: 8 }}>
          Error de configuración
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
          Verifica que el archivo <code style={{ background: '#1E293B', padding: '2px 6px', borderRadius: 4 }}>.env</code> esté en la raíz del proyecto con todas las variables de Firebase.
        </p>
        {error && (
          <div style={{
            background: '#1E293B', borderRadius: 10, padding: '10px 14px',
            fontSize: '0.75rem', color: '#F87171', textAlign: 'left',
            fontFamily: 'monospace', wordBreak: 'break-all',
          }}>
            {error}
          </div>
        )}
        <button onClick={() => window.location.reload()} style={{
          marginTop: 20, padding: '10px 24px', background: '#1E3A5F',
          border: '1px solid #38BDF8', borderRadius: 10, color: '#38BDF8',
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, cursor: 'pointer',
        }}>
          🔄 Reintentar
        </button>
      </div>
    </div>
  )
}
