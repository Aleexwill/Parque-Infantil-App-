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
   Views: kids | lock | admin
   ───────────────────────────────────────────── */

export default function App() {
  const { isAuthenticated, loading, signOut } = useApp()
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [view, setView] = useState('kids')  // kids | lock | admin

  // Show loading spinner while auth initializes
  if (loading) return <LoadingScreen message="Iniciando sesión..." />

  // Show login if not authenticated
  if (!isAuthenticated) return <AuthScreen />

  function goToLock()  { setView('lock') }
  function goToKids()  { setView('kids') }
  function goToAdmin() { setView('admin') }

  function handleUnlock() {
    setAdminUnlocked(true)
    setView('admin')
  }

  function handleAdminLock() {
    setAdminUnlocked(false)
    setView('kids')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Top nav bar (only visible outside kids view) ── */}
      {view !== 'kids' && (
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: '#111827',
          borderBottom: '1px solid #1E293B',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <span style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.35rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4FC3F7, #A78BFA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🌟 KidSpark
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            <NavBtn active={view === 'kids'}  onClick={goToKids}>👦 Niños</NavBtn>
            <NavBtn active={view === 'lock'}  onClick={goToLock}>🔒 Bloqueo</NavBtn>
            {adminUnlocked && (
              <NavBtn active={view === 'admin'} onClick={goToAdmin}>⚙️ Admin</NavBtn>
            )}
          </div>
        </nav>
      )}

      {/* Kids floating nav button (subtle, for parents) */}
      {view === 'kids' && (
        <button
          onClick={goToLock}
          aria-label="Acceso para padres"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 16,
            zIndex: 50,
            background: 'rgba(17,24,39,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '10px 18px',
            color: '#64748B',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: "'Nunito', sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          🔐 <span>Padres</span>
        </button>
      )}

      {/* ── View rendering ── */}
      {view === 'kids'  && <KidsView />}
      {view === 'lock'  && <LockScreen onUnlock={handleUnlock} />}
      {view === 'admin' && <AdminDashboard onLock={handleAdminLock} />}
    </div>
  )
}

function NavBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 9,
        border: active ? '1px solid #334155' : '1px solid transparent',
        background: active ? '#1C2638' : 'transparent',
        color: active ? '#38BDF8' : '#64748B',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )
}
