import { createContext, useContext } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const auth   = useAuth()
  // Firebase uses uid (not session.user.id)
  const family = useFamily(auth.user?.uid)

  const value = {
    // Auth
    user:            auth.user,
    authLoading:     auth.loading,
    authError:       auth.error,
    isAuthenticated: auth.isAuthenticated,
    signUp:          auth.signUp,
    signIn:          auth.signIn,
    signOut:         auth.signOut,
    resetPassword:   auth.resetPassword,
    clearAuthError:  auth.clearError,

    // Family data + actions (spread from useFamily)
    ...family,

    // Combined loading
    loading: auth.loading || (auth.isAuthenticated && family.loading),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export function useAuthContext() {
  const { user, authLoading, authError, isAuthenticated, signUp, signIn, signOut, resetPassword, clearAuthError } = useApp()
  return { user, loading: authLoading, error: authError, isAuthenticated, signUp, signIn, signOut, resetPassword, clearError: clearAuthError }
}
