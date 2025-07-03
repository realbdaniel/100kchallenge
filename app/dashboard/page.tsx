'use client'

import { useEffect, useState } from 'react'
import { supabase, signInWithTwitter, signOut, calculateUserStats, getUserDailyActions, getUserDeepWorkSessions } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HeatMap } from '@/components/ui/HeatMap'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XFeed } from '@/components/ui/XFeed'
import { GameInfoPopup } from '@/components/ui/GameInfoPopup'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { AchievementToast } from '@/components/ui/AchievementToast'
import { 
  Coins, Target, Calendar, TrendingUp, Zap, Plus, Menu, Bell, HelpCircle,
  LayoutDashboard, Trophy, Rocket, Users, Settings, Crown, Star, DollarSign,
  Activity, Timer, CheckCircle, ArrowUp, ExternalLink, MoreHorizontal, X
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
  const [error, setError] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [achievementQueue, setAchievementQueue] = useState<string[]>([])  

  const fetchUserData = async (userId: string) => {
    setStatsLoading(true)
    try {
      // Get user stats
      const stats = await calculateUserStats(userId)
      if (stats) {
        setUserStats(stats)
      }

      // Get daily actions for today
      const { actions } = await getUserDailyActions(userId)
      setDailyActions(actions || [])

      // Get deep work sessions for heatmap
      const { sessions } = await getUserDeepWorkSessions(userId)
      const formattedSessions = sessions?.map(session => ({
        date: new Date(session.date),
        duration: session.duration
      })) || []
      setDeepWorkData(formattedSessions)

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
      setLoading(false)
      
      // Fetch user data if authenticated
      if (session?.user?.id) {
        fetchUserData(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Fetch user data if authenticated
      if (session?.user?.id) {
        fetchUserData(session.user.id)
      } else {
        // Clear data if signed out
        setUserStats(null)
        setDailyActions([])
        setDeepWorkData([])
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
  
  // Demo mode for testing without full auth setup
  const mockUser = {
    name: 'Demo Builder',
    email: 'demo@100kchallenge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
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
    { icon: LayoutDashboard, label: 'Studio', href: '/dashboard', active: true },
    { icon: Target, label: 'Deep Work', href: '/dashboard/deep-work' },
    { icon: Rocket, label: 'Projects', href: '/dashboard/projects' },
    { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements' },
    { icon: Users, label: 'Community', href: '/dashboard/community' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

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
            <Link
              key={item.label}
              href={item.href}
              className={item.active ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === 'Community' && (
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md">NEW</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="mt-auto bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-4 rounded-xl">
          <p className="text-sm leading-snug">
            Upgrade to <span className="font-semibold text-cyan-400">Builder PRO</span> for unlimited projects and premium features!
          </p>
          <div className="flex items-center justify-between mt-4 text-sm">
            <button className="hover:underline text-white/70">Maybe Later</button>
            <button className="bg-white/10 hover:bg-white/20 transition px-3 py-1.5 rounded-md font-medium">
              Go Premium
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
              <GameInfoPopup />
            </div>
            <div 
               className="h-8 w-8 rounded-full bg-cover bg-center border border-white/20"
               style={{backgroundImage: `url('${(currentUser as any)?.avatar || (currentUser as any)?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'}')`}}
             />
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 relative">
          {statsLoading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-white/80">Loading your data...</p>
              </div>
            </div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Revenue Progress</p>
                  <p className="text-2xl font-semibold">${displayData.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowUp className="h-3 w-3" />
                    {((displayData.totalEarnings / 100000) * 100).toFixed(1)}% to $100k
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar current={displayData.totalEarnings} target={100000} />
              </div>
            </div>

            {/* Current Streak */}
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Current Streak</p>
                  <p className="text-2xl font-semibold">{displayData.currentStreak}</p>
                  <p className="text-xs text-orange-400">days in a row 🔥</p>
                </div>
                <div className="h-10 w-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Active Projects</p>
                  <p className="text-2xl font-semibold">{displayData.activeProjects}</p>
                  <p className="text-xs text-blue-400">building empire</p>
                </div>
                <div className="h-10 w-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Level & Coins */}
            <div className="stat-card">
              <LevelBadge 
                earnings={displayData.totalEarnings}
                totalCoins={userStats?.profile?.total_coins || 0}
                className="scale-75 origin-left"
              />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Deep Work Heatmap */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Deep Work Journey</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {displayData.currentStreak} day streak
                  </span>
                </div>
              </div>
              <HeatMap data={deepWorkData} />
              
              <div className="mt-6 flex gap-3">
                <button className="glass-button-primary flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Log Session
                </button>
                <button className="glass-button flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  View Analytics
                </button>
              </div>
            </div>

            {/* Daily Actions */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Daily Actions</h2>
                <div className="text-xs text-mario-yellow font-bold">{displayData.dailyCoinsEarned}/35 coins</div>
              </div>
              
              <div className="space-y-3">
                {/* Deep Work Session */}
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-lg">🎯</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Deep Work Session</div>
                    <div className="text-xs text-white/60">2+ hours focused work</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-mario-yellow">10 coins</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                
                {/* X Post */}
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-lg">🐦</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">X Post</div>
                    <div className="text-xs text-white/60">Share your progress</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-mario-yellow">5 coins</span>
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                
                {/* Push/Earning */}
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg">⚡</div>
                  <div className="flex-1">
                    <div className="text-sm">Code or Content Push</div>
                    <div className="text-xs text-white/60">Log any earnings</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-mario-yellow">15 coins</span>
                    <button className="px-2 py-1 bg-mario-blue hover:bg-mario-blue/80 rounded text-xs">
                      Log
                    </button>
                  </div>
                </div>
                
                {/* Streak Bonus */}
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="text-lg">📅</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Streak Bonus</div>
                    <div className="text-xs text-white/60">Daily consistency</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-mario-yellow">5 coins</span>
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-mario-yellow/10 rounded-lg border border-mario-yellow/20">
                <div className="text-xs font-medium text-mario-yellow">Coin Progress</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                  <div 
                    className="bg-mario-yellow rounded-full h-2" 
                    style={{ width: `${Math.min((displayData.dailyCoinsEarned / 35) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {35 - displayData.dailyCoinsEarned > 0 ? `${35 - displayData.dailyCoinsEarned} coins to max daily` : 'Daily max reached!'}
                </div>
              </div>
            </div>
          </div>

          {/* Projects & Community */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Active Projects</h2>
                  <Link href="/dashboard/projects" className="text-sm text-blue-400 hover:text-blue-300">
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {displayData.projects && displayData.projects.length > 0 ? (
                  displayData.projects.slice(0, 3).map((project: any) => (
                    <div key={project.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm">{project.title}</div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            project.status === 'live' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="text-xs text-white/60">
                          ${project.revenue.toLocaleString()}
                        </div>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-white/40" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Rocket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No projects yet</p>
                    <p className="text-xs">Create your first project to start tracking revenue!</p>
                  </div>
                )}
              </div>
            </div>

            {/* X Feed */}
            <div className="lg:col-span-2">
              <XFeed userId={user?.id || "demo-user"} limit={5} />
            </div>
          </div>
        </section>
      </div>

      {/* Project Modal */}
      {user && (
        <ProjectModal 
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onSuccess={(achievements?: string[]) => {
            // Refresh user data after project creation
            fetchUserData(user.id)
            // Show achievement notifications if any
            if (achievements) {
              showAchievements(achievements)
            }
          }}
          userId={user.id}
        />
      )}

      {/* Achievement Notifications */}
      <AchievementToast 
        achievements={achievementQueue}
        onDismiss={dismissAchievement}
      />
    </div>
  )
} 