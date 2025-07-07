'use client'

import { useEffect, useState } from 'react'
import { supabase, signOut, getUserProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { 
  User as UserIcon, 
  Clock, 
  Twitter, 
  LogOut, 
  Settings, 
  Shield, 
  Globe,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timezone, setTimezone] = useState('')
  const [detectedTimezone, setDetectedTimezone] = useState('')
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [apiTestResult, setApiTestResult] = useState<any>(null)
  const [testingApi, setTestingApi] = useState(false)

  useEffect(() => {
    // Get initial session and detect timezone
    const initializeSettings = async () => {
      // Detect user's timezone
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      setDetectedTimezone(detected)
      setTimezone(detected)

      // Get session info
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({ session, error })
      setUser(session?.user ?? null)

      if (session?.user) {
        // Get profile
        const { profile: userProfile } = await getUserProfile(session.user.id)
        setProfile(userProfile)
        
        // Use profile timezone if set, otherwise detected
        if (userProfile?.timezone) {
          setTimezone(userProfile.timezone)
        }
      }

      setLoading(false)
    }

    initializeSettings()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSessionInfo({ session, error: null })
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      window.location.href = '/'
    }
  }

  const updateTimezone = async () => {
    if (!user || !timezone) return

    const { error } = await supabase
      .from('profiles')
      .update({ 
        timezone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating timezone:', error)
    } else {
      // Refresh the page to apply timezone changes
      window.location.reload()
    }
  }

  const testTwitterApi = async () => {
    setTestingApi(true)
    try {
      const response = await fetch('/api/twitter/posts')
      const data = await response.json()
      setApiTestResult({
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setApiTestResult({
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setTestingApi(false)
    }
  }

  const getCurrentTime = (tz: string) => {
    try {
      return new Date().toLocaleString('en-US', { 
        timeZone: tz,
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    } catch {
      return 'Invalid timezone'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-white/60">Manage your account, timezone, and debug authentication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Authentication Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm font-medium">Session Status</span>
                <div className="flex items-center gap-2">
                  {user ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Authenticated</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm">Not authenticated</span>
                    </>
                  )}
                </div>
              </div>

              {user && (
                <>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm font-medium mb-2">User ID</div>
                    <div className="text-xs text-white/60 font-mono">{user.id}</div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm font-medium mb-2">Email</div>
                    <div className="text-sm text-white/80">{user.email}</div>
                  </div>

                  {profile?.twitter_username && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-sm font-medium mb-2">Twitter Username</div>
                      <div className="text-sm text-white/80">@{profile.twitter_username}</div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Timezone Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-semibold">Timezone Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-sm font-medium mb-2">Detected Timezone</div>
                <div className="text-sm text-white/80">{detectedTimezone}</div>
                <div className="text-xs text-white/60 mt-1">
                  {getCurrentTime(detectedTimezone)}
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-sm font-medium mb-2">Current Setting</div>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-sm"
                >
                  <option value={detectedTimezone}>Auto-detected: {detectedTimezone}</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
                <div className="text-xs text-white/60 mt-1">
                  {getCurrentTime(timezone)}
                </div>
              </div>

              <button
                onClick={updateTimezone}
                disabled={!user}
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <Clock className="h-4 w-4" />
                Update Timezone
              </button>
            </div>
          </div>

          {/* API Test */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Twitter className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold">X Feed API Test</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={testTwitterApi}
                disabled={testingApi}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
              >
                {testingApi ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Twitter className="h-4 w-4" />
                )}
                Test X Feed API
              </button>

              {apiTestResult && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {apiTestResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm font-medium">
                      Status: {apiTestResult.status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-white/60 mb-2">
                    Tested: {new Date(apiTestResult.timestamp).toLocaleString()}
                  </div>

                  {apiTestResult.data?.posts && (
                    <div className="text-sm text-white/80">
                      Posts returned: {apiTestResult.data.posts.length}
                    </div>
                  )}

                  {apiTestResult.error && (
                    <div className="text-sm text-red-400">
                      Error: {apiTestResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Debug Information</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-sm font-medium mb-2">Browser Timezone</div>
                <div className="text-xs text-white/60 font-mono">
                  {JSON.stringify(Intl.DateTimeFormat().resolvedOptions(), null, 2)}
                </div>
              </div>

              {profile && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm font-medium mb-2">Profile Data</div>
                  <div className="text-xs text-white/60 font-mono max-h-40 overflow-y-auto">
                    {JSON.stringify(profile, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 