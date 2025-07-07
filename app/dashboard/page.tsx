'use client'

import { useEffect, useState } from 'react'
import { supabase, signInWithTwitter, signOut, calculateUserStats, getUserDailyActions, getUserDeepWorkSessions, logDailyAction, getUserProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HeatMap } from '@/components/ui/HeatMap'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XFeed } from '@/components/ui/XFeed'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { AchievementToast } from '@/components/ui/AchievementToast'
import { DailyActions } from '@/components/ui/DailyActions'
import { PushLogs } from '@/components/ui/PushLogs'
import { 
  Coins, Target, Calendar, TrendingUp, Zap, Plus, Menu, Bell, HelpCircle,
  LayoutDashboard, Trophy, Rocket, Users, Settings, Crown, Star, DollarSign,
  Activity, Timer, CheckCircle, ArrowUp, ExternalLink, MoreHorizontal, X,
  Shield, Globe, Clock, LogOut, Twitter, AlertTriangle, RefreshCw, XCircle
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in real app, this would come from your API
const mockData = {
  totalEarnings: 25000,
  level: 8,
  xp: 6750,
  currentStreak: 12,
  longestStreak: 23,
  activeProjects: 4,
  totalBuilders: 1247,
  deepWorkData: [
    { date: new Date('2024-01-15'), duration: 180 },
    { date: new Date('2024-01-16'), duration: 150 },
    { date: new Date('2024-01-17'), duration: 240 },
    // Add more mock data as needed
  ],
  recentProjects: [
    {
      id: '1',
      title: 'SaaS Dashboard',
      description: 'Modern analytics dashboard for small businesses',
      revenue: 12000,
      imageUrl: '/project-placeholder.jpg',
      status: 'live',
      growth: '+12.5%'
    },
    {
      id: '2', 
      title: 'Mobile App',
      description: 'Fitness tracking app with social features',
      revenue: 8000,
      imageUrl: '/project-placeholder.jpg',
      status: 'development',
      growth: '+8.2%'
    },
    {
      id: '3',
      title: 'E-commerce Plugin',
      description: 'WordPress plugin for online stores',
      revenue: 5000,
      imageUrl: '/project-placeholder.jpg',
      status: 'live',
      growth: '+15.3%'
    }
  ],
  recentBuilders: [
    {
      id: '1',
      name: 'Maya Chen',
      username: 'mayabuilds',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b547?w=64&h=64&fit=crop&crop=face',
      level: 12,
      earnings: 45000,
      streak: 23,
      status: 'building'
    },
    {
      id: '2',
      name: 'Alex Rivera',
      username: 'alexcodes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      level: 15,
      earnings: 67000,
      streak: 18,
      status: 'online'
    },
    {
      id: '3',
      name: 'Sam Johnson',
      username: 'sambuilds',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      level: 9,
      earnings: 28000,
      streak: 7,
      status: 'away'
    }
  ]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userStats, setUserStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [deepWorkData, setDeepWorkData] = useState<any[]>([])
  const [dailyActions, setDailyActions] = useState<any[]>([])
  const [pushLogs, setPushLogs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showPushModal, setShowPushModal] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [sessionDescription, setSessionDescription] = useState('')
  const [pushDescription, setPushDescription] = useState('')
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [achievementQueue, setAchievementQueue] = useState<string[]>([])  
  const [activeTab, setActiveTab] = useState<string>('studio')
  const [apiTestResult, setApiTestResult] = useState<any>(null)
  const [testingApi, setTestingApi] = useState(false)
  const [timezone, setTimezone] = useState('')
  const [detectedTimezone, setDetectedTimezone] = useState('')
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const fetchUserData = async (userId: string) => {
    setStatsLoading(true)
    try {
      // Get user stats
      const stats = await calculateUserStats(userId)
      if (stats) {
        setUserStats(stats)
      }

      // Get user profile for timezone
      const { profile } = await getUserProfile(userId)
      const userTimezone = profile?.timezone

      // Get daily actions for today (timezone-aware)
      const { actions } = await getUserDailyActions(userId, undefined, userTimezone)
      setDailyActions(actions || [])

      // Get daily actions for progress tracker (last 365 days)
      const { data: progressData } = await supabase
        .from('daily_actions')
        .select('date, coins_earned, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })
      
      // Group by date and sum coins
      const progressByDate = progressData?.reduce((acc, action) => {
        const date = action.date
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += action.coins_earned || 0
        return acc
      }, {} as Record<string, number>) || {}
      
      const formattedProgressData = Object.entries(progressByDate).map(([date, coins]) => ({
        date: new Date(date),
        coins
      }))
      setDeepWorkData(formattedProgressData)

      // Get push logs for activity feed
      const { data: pushData } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', userId)
        .in('action_type', ['push', 'manual_earning'])
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(20)
      setPushLogs(pushData || [])

      setError(null)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setSessionInfo({ session, error: null })
      setLoading(false)
      
      // Detect timezone
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      setDetectedTimezone(detected)
      setTimezone(detected)
      
      // Fetch user data if authenticated
      if (session?.user?.id) {
        fetchUserData(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSessionInfo({ session, error: null })
      setLoading(false)
      
      // Fetch user data if authenticated
      if (session?.user?.id) {
        fetchUserData(session.user.id)
      } else {
        // Clear data if signed out
        setUserStats(null)
        setDailyActions([])
        setDeepWorkData([])
        setPushLogs([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && user) {
        e.preventDefault()
        setShowProjectModal(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [user])

  // Handle achievement notifications
  const showAchievements = (achievements: string[]) => {
    if (achievements.length > 0) {
      setNewAchievements(achievements)
      setAchievementQueue(prev => [...prev, ...achievements])
    }
  }

  const dismissAchievement = (achievementId: string) => {
    setAchievementQueue(prev => prev.filter(id => id !== achievementId))
  }

  // Handler for logging sessions
  const handleSessionSubmit = async (duration: number) => {
    if (!user?.id) return
    
    try {
      const { error } = await logDailyAction(user.id, 'deep_work', {
        description: sessionDescription.trim() || undefined,
        duration: duration * 60, // Convert to minutes
        // Let the function determine the correct timezone-aware date
      })
      
      if (error) {
        console.error('Error logging session:', error)
      } else {
        // Refresh user data
        fetchUserData(user.id)
        setShowSessionModal(false)
        setSessionDescription('')
      }
    } catch (error) {
      console.error('Error logging session:', error)
    }
  }

  // Handler for logging pushes
  const handlePushSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !pushDescription.trim()) return
    
    try {
      const { error } = await logDailyAction(user.id, 'push', {
        description: pushDescription.trim(),
        // Let the function determine the correct timezone-aware date
      })
      
      if (error) {
        console.error('Error logging push:', error)
      } else {
        // Refresh user data
        fetchUserData(user.id)
        setShowPushModal(false)
        setPushDescription('')
      }
    } catch (error) {
      console.error('Error logging push:', error)
    }
  }
  
  // Demo mode for testing without full auth setup
  const mockUser = {
    name: 'Demo Builder',
    email: 'demo@100kchallenge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
  }

  // Manual profile creation function to fix database issues
  const createProfileManually = async () => {
    if (!user) return
    
    console.log('Manually creating profile for user:', user.id)
    console.log('User object:', user)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || 'Builder',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          twitter_username: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
          twitter_id: user.user_metadata?.provider_id,
          username: user.user_metadata?.user_name || user.user_metadata?.preferred_username || user.email?.split('@')[0] || 'builder',
          bio: user.user_metadata?.description || '',
          total_earnings: 0,
          level: 1,
          xp: 0,
          total_coins: 0,
          current_streak: 0,
          longest_streak: 0,
          achievements: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.error('Manual profile creation error:', error)
        alert(`Profile creation failed: ${error.message}`)
      } else {
        console.log('Profile created successfully:', data)
        alert('Profile created! Try creating a project now.')
        // Refresh the page to reload user data
        window.location.reload()
      }
    } catch (err) {
      console.error('Manual profile creation failed:', err)
      alert('Profile creation failed. Check console for details.')
    }
  }
  
  // Handler for opening project edit modal
  const handleEditProject = (project: any) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  // Handler for closing project modal
  const handleCloseProjectModal = () => {
    setSelectedProject(null)
    setShowProjectModal(false)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  // Show demo mode option if not authenticated
  if (!user && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🍄</div>
          <h1 className="text-2xl font-bold mb-4">Dashboard Access</h1>
          <p className="text-white/60 mb-6">
            You need to be signed in to access your dashboard.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => setDemoMode(true)}
              className="w-full mario-button"
            >
              🎮 Try Demo Mode
            </button>
            
            <button 
              onClick={() => signInWithTwitter()}
              className="w-full mario-button-secondary"
            >
              𝕏 Sign In with X
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-yellow-300">
              <strong>Demo Mode:</strong> Explore the dashboard with mock data without signing in.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentUser = user || mockUser
  const isDemoMode = !user && demoMode
  
  // Use real data or fallback to demo data
  const displayData = userStats || {
    totalEarnings: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    activeProjects: 0,
    totalProjects: 0,
    dailyCoinsEarned: 0,
    projects: []
  }

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Studio', tabId: 'studio', active: activeTab === 'studio' },
    { icon: Target, label: 'Deep Work', tabId: 'deep-work', active: activeTab === 'deep-work' },
    { icon: Rocket, label: 'Projects', tabId: 'projects', active: activeTab === 'projects' },
    { icon: Trophy, label: 'Achievements', tabId: 'achievements', active: activeTab === 'achievements' },
    { icon: Users, label: 'Community', tabId: 'community', active: activeTab === 'community' },
    { icon: Settings, label: 'Settings', tabId: 'settings', active: activeTab === 'settings' },
  ]

  // Settings functions
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

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col gap-6 border-r border-white/10 bg-slate-900/50 backdrop-blur-lg p-6`}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg grid place-content-center">
            <span className="text-lg">🍄</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">100K Challenge</span>
        </div>

        {/* New Project Button */}
        <button 
          onClick={() => setShowProjectModal(true)}
          className="flex items-center justify-between gap-3 text-sm font-medium bg-blue-600/20 hover:bg-blue-600/30 transition p-3 rounded-lg"
        >
          <span className="flex items-center gap-3">
            <Plus className="h-4 w-4" />
            New Project
          </span>
          <kbd className="text-xs text-white/60 hidden sm:block">⌘N</kbd>
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 text-sm">
          {navigationItems.map((item) => (
            item.tabId === 'achievements' ? (
              <Link
                key={item.label}
                href="/dashboard/achievements"
                className={item.active ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.label === 'Community' && (
                  <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md">NEW</span>
                )}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.tabId)}
                className={item.active ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.label === 'Community' && (
                  <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md">NEW</span>
                )}
              </button>
            )
          ))}
        </nav>

        {/* Support the Project */}
        <div className="mt-auto bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-xl">
          <p className="text-sm leading-snug">
            Support the <span className="font-semibold text-pink-400">100K Challenge</span> project and help us build better features!
          </p>
          <div className="flex items-center justify-between mt-4 text-sm">
            <button 
              onClick={() => setShowDonationModal(false)}
              className="hover:underline text-white/70"
            >
              Maybe Later
            </button>
            <button 
              onClick={() => setShowDonationModal(true)}
              className="bg-white/10 hover:bg-white/20 transition px-3 py-1.5 rounded-md font-medium"
            >
              💝 Donate
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between gap-4 px-4 lg:px-6 py-4 border-b border-white/10 bg-slate-900/30 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8"></div>
            <div>
              <h1 className="text-base lg:text-lg font-medium">Builder Analytics</h1>
              <p className="text-xs lg:text-sm text-white/60">
                {isDemoMode ? 'Demo Mode • ' : ''}{user ? `Level ${displayData.level}` : '1,247 active builders • Level 1'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <div className="hidden sm:block px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Demo
              </div>
            )}
            <div className="hidden sm:block">
              {/* GameInfoPopup is removed as per the instructions */}
            </div>
            <div 
               className="h-8 w-8 rounded-full bg-cover bg-center border border-white/20"
               style={{backgroundImage: `url('${(currentUser as any)?.avatar || (currentUser as any)?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'}')`}}
             />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Tab Content */}
          {activeTab === 'studio' && (
            <>
              {/* Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Level Badge */}
                <div className="lg:col-span-1">
                  <LevelBadge 
                    level={displayData.level} 
                    earnings={displayData.totalEarnings}
                    className="w-full h-full" 
                  />
                </div>

                {/* Progress Bar */}
                <div className="lg:col-span-3">
                  <ProgressBar 
                    current={displayData.totalEarnings} 
                    target={100000}
                    label={`$${displayData.totalEarnings.toLocaleString()} earned`}
                  />
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Progress Tracker */}
                <div className="lg:col-span-8">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Daily Progress Tracker ⚡</h2>
                        <p className="text-sm text-white/60">Your daily action streak - complete all tasks to max out 40 coins</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{displayData.currentStreak}</div>
                        <div className="text-xs text-white/60">day streak</div>
                      </div>
                    </div>
                    
                    <HeatMap data={deepWorkData} />
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowSessionModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 border border-blue-500/30"
                      >
                        <Timer className="h-4 w-4" />
                        Log Session
                      </button>
                      
                      <button
                        onClick={() => setShowPushModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 border border-green-500/30"
                      >
                        <ArrowUp className="h-4 w-4" />
                        Log Push
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daily Actions */}
                <div className="lg:col-span-4">
                  <DailyActions 
                    actions={dailyActions}
                    currentStreak={displayData.currentStreak}
                    userId={user?.id || ''}
                    dailyCoinsEarned={displayData.dailyCoinsEarned}
                  />
                </div>

                {/* Active Projects */}
                <div className="lg:col-span-4">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Active Projects</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {displayData.projects && displayData.projects.length > 0 ? (
                        displayData.projects.map((project: any) => (
                          <div key={project.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1 truncate">{project.title}</h4>
                                <p className="text-xs text-white/60 mb-2 line-clamp-2">{project.description}</p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="text-green-400 font-medium">
                                    ${project.revenue?.toLocaleString() || '0'}
                                  </span>
                                  <span className="text-white/50 capitalize">{project.status}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditProject(project)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <MoreHorizontal className="h-4 w-4 text-white/60" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-white/60">
                          <Rocket className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No projects yet</p>
                          <p className="text-xs mt-1">Create your first project to get started!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-4">
                  <PushLogs logs={pushLogs} userId={user?.id || ''} />
                </div>

                {/* X Feed */}
                <div className="lg:col-span-4">
                  <XFeed limit={5} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              {/* Settings Header */}
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

                        {userStats?.profile?.twitter_username && (
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm font-medium mb-2">Twitter Username</div>
                            <div className="text-sm text-white/80">@{userStats.profile.twitter_username}</div>
                          </div>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => signOut()}
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
                      <div className="text-xs text-white/60 font-mono max-h-20 overflow-y-auto">
                        {JSON.stringify(Intl.DateTimeFormat().resolvedOptions(), null, 2)}
                      </div>
                    </div>

                    {userStats?.profile && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm font-medium mb-2">Profile Data</div>
                        <div className="text-xs text-white/60 font-mono max-h-40 overflow-y-auto">
                          {JSON.stringify(userStats.profile, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be added here */}
          {activeTab === 'deep-work' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Deep Work</h2>
              <p className="text-white/60">Coming soon...</p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <p className="text-white/60">Coming soon...</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Achievements</h2>
              <p className="text-white/60">Coming soon...</p>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Community</h2>
              <p className="text-white/60">Coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Log Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">🎯 Log Session</h3>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Duration</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSessionSubmit(2)}
                      className="w-full p-3 bg-mario-blue/20 border border-mario-blue/30 rounded-lg hover:bg-mario-blue/30 transition-colors text-left"
                    >
                      <div className="font-medium">2 hours</div>
                      <div className="text-xs text-white/60">+10 coins</div>
                    </button>
                    <button
                      onClick={() => handleSessionSubmit(2.5)}
                      className="w-full p-3 bg-mario-green/20 border border-mario-green/30 rounded-lg hover:bg-mario-green/30 transition-colors text-left"
                    >
                      <div className="font-medium">2+ hours</div>
                      <div className="text-xs text-white/60">+15 coins</div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    rows={3}
                    placeholder="What did you work on?"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Push Modal */}
      {showPushModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">⚡ Log Push</h3>
                <button
                  onClick={() => setShowPushModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handlePushSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe your push
                  </label>
                  <textarea
                    value={pushDescription}
                    onChange={(e) => setPushDescription(e.target.value)}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    rows={3}
                    placeholder="What did you ship today? Code, content, or progress..."
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPushModal(false)}
                    className="flex-1 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!pushDescription.trim()}
                    className="flex-1 p-3 bg-mario-blue rounded-lg hover:bg-mario-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Log Push (+15 coins)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {user && (
        <ProjectModal 
          isOpen={showProjectModal}
          onClose={handleCloseProjectModal}
          onSuccess={(achievements?: string[]) => {
            // Refresh user data after project creation
            fetchUserData(user.id)
            // Show achievement notifications if any
            if (achievements) {
              showAchievements(achievements)
            }
          }}
          userId={user.id}
          project={selectedProject}
        />
      )}

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  💝 Support the Project
                </h3>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-white/80 mb-4">
                    Your support helps us continue developing the 100K Challenge platform with improved gamification, analytics, and new features for builders worldwide!
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30 mb-4">
                    <p className="text-sm font-medium text-purple-300 mb-2">
                      🚀 What your support enables:
                    </p>
                    <ul className="text-xs text-white/70 space-y-1">
                      <li>• Enhanced gamification features</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• Community features & competitions</li>
                      <li>• Mobile app development</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-32 h-32 bg-white p-2 rounded-lg">
                        <img 
                          src="/venmo-qr.png" 
                          alt="Venmo QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    <a
                      href="https://venmo.com/u/benjamin-daniel-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>💳</span>
                      Donate via Venmo
                    </a>
                    
                    <p className="text-xs text-white/50">
                      @benjamin-daniel-1
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Notifications */}
      <AchievementToast 
        achievements={achievementQueue}
        onDismiss={dismissAchievement}
      />
    </div>
  )
} 