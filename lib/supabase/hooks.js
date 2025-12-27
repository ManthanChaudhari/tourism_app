import { createSupabaseClient } from "./client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export function useSupabase() {
  const [supabase] = useState(() => createSupabaseClient())
  return supabase
}

export function useUser() {
  const supabase = useSupabase()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          setError(error.message)
        } else {
          setUser(user)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        if (event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading, error }
}

export function useAuth() {
  const supabase = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          setError(error.message)
        } else {
          setUser(user)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/login')
        }
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
        }
        if (event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        setError(error.message)
        return { error: error.message }
      }
      setUser(null)
      router.push('/login')
      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        setError(error.message)
        return { error: error.message }
      }
      setUser(data.user)
      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }, [supabase])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    loading,
    error,
    signOut,
    refreshSession,
    clearError,
    isAuthenticated: !!user,
    isEmailConfirmed: !!user?.email_confirmed_at
  }
}