import { useState, useEffect, useCallback } from 'react'
import {
  onAuthChange, registerUser, loginUser,
  logoutUser, resetUserPassword,
} from '@/lib/firebase'

/* ─────────────────────────────────────────────
   useAuth — Firebase Authentication state
   ───────────────────────────────────────────── */

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const unsub = onAuthChange(fbUser => {
      setUser(fbUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const signUp = useCallback(async ({ email, password, familyName }) => {
    setError(null); setLoading(true)
    try {
      return await registerUser({ email, password, familyName })
    } catch (err) {
      setError(err.message); throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    setError(null); setLoading(true)
    try {
      return await loginUser({ email, password })
    } catch (err) {
      setError(err.message); throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try { await logoutUser() }
    catch (err) { setError(err.message) }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try { await resetUserPassword(email) }
    catch (err) { setError(err.message); throw err }
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signUp, signIn, signOut, resetPassword,
    clearError: () => setError(null),
  }
}
