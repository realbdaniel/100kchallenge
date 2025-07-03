'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          setError(error.message)
          return
        }

        if (data.session) {
          // User is authenticated, create/update profile
          const user = data.session.user
          
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: user.user_metadata.name || user.user_metadata.full_name || 'Builder',
              email: user.email,
              avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
              twitter_username: user.user_metadata.user_name || user.user_metadata.preferred_username,
              twitter_id: user.user_metadata.provider_id,
              username: user.user_metadata.user_name || user.user_metadata.preferred_username || user.email?.split('@')[0] || 'builder',
              bio: user.user_metadata.description || '',
              total_earnings: 0,
              level: 1,
              xp: 0,
              total_coins: 0,
              current_streak: 0,
              longest_streak: 0,
              achievements: [],
              updated_at: new Date().toISOString(),
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          // No session, redirect to home
          router.push('/')
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('Authentication failed')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Completing sign in...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center glass-card p-8 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mario-button"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return null
} 