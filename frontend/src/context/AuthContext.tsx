import React, { createContext, useEffect, useState, useCallback } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/types/user'
import { syncUserWithBackend, fetchCurrentUser } from '@/api/auth'

interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null
  dbUser: UserProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, pass: string) => Promise<{ error: any }>
  signUp: (email: string, pass: string, options?: { full_name?: string }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  syncUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  dbUser: null,
  loading: true,
  error: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  syncUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [dbUser, setDbUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const syncUser = useCallback(async () => {
    try {
      const syncedProfile = await syncUserWithBackend()
      setDbUser(syncedProfile)
    } catch (err: any) {
      console.warn('Backend user sync fallback:', err?.message || err)
    }
  }, [])

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) {
        syncUser()
      }
      setLoading(false)
    }).catch((err) => {
      console.error('Session retrieval error:', err)
      setLoading(false)
    })

    // Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) {
        await syncUser()
      } else {
        setDbUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [syncUser])

  const signIn = async (email: string, pass: string) => {
    setError(null)
    const res = await supabase.auth.signInWithPassword({ email, password: pass })
    if (res.error) {
      setError(res.error.message)
    } else if (res.data.session) {
      await syncUser()
    }
    return { error: res.error }
  }

  const signUp = async (email: string, pass: string, options?: { full_name?: string }) => {
    setError(null)
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: options?.full_name || '',
        },
      },
    })
    if (res.error) {
      setError(res.error.message)
    } else if (res.data.session) {
      try {
        await syncUserWithBackend({ full_name: options?.full_name })
      } catch (syncErr: any) {
        console.warn('Post-signup backend sync warning:', syncErr?.message || syncErr)
      }
    }
    return { error: res.error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setDbUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        dbUser,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
