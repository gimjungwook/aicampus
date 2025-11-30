'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  marketing_consent: boolean
  created_at: string
  updated_at: string
}

interface UseUserReturn {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      setUser(user)

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError
        }

        setProfile(profile)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchUser()
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading, error, refetch: fetchUser }
}
