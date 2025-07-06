import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For browser client with SSR support
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Authentication helpers
export const signInWithTwitter = async () => {
  console.log('Starting Twitter OAuth...')
  console.log('Redirect URL:', `${window.location.origin}/auth/callback`)
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  console.log('OAuth response:', { data, error })
  
  if (error) {
    console.error('OAuth error:', error)
  }
  
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// User Profile Data Functions
export const getUserProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { profile, error }
}

export const getUserProjects = async (userId: string) => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { projects, error }
}

export const getUserDailyActions = async (userId: string, date?: string) => {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  const { data: actions, error } = await supabase
    .from('daily_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)

  return { actions, error }
}

export const getUserDeepWorkSessions = async (userId: string, limit = 30) => {
  const { data: sessions, error } = await supabase
    .from('deep_work_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  return { sessions, error }
}

export const calculateUserStats = async (userId: string) => {
  try {
    // Get profile
    const { profile } = await getUserProfile(userId)
    
    // Get projects and calculate total revenue
    const { projects } = await getUserProjects(userId)
    const totalEarnings = projects?.reduce((sum, project) => sum + (project.revenue || 0), 0) || 0
    
    // Get current level based on earnings
    const level = getLevelFromEarnings(totalEarnings)
    
    // Get daily actions for streak calculation
    const { data: recentActions } = await supabase
      .from('daily_actions')
      .select('date, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('date', { ascending: false })
      .limit(365)
    
    // Calculate current streak
    let currentStreak = 0
    if (recentActions && recentActions.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const sortedDates = Array.from(new Set(recentActions.map(a => a.date))).sort().reverse()
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i]
        const expectedDate = new Date()
        expectedDate.setDate(expectedDate.getDate() - i)
        const expected = expectedDate.toISOString().split('T')[0]
        
        if (date === expected) {
          currentStreak++
        } else {
          break
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    if (recentActions && recentActions.length > 0) {
      const dates = Array.from(new Set(recentActions.map(a => a.date))).sort()
      for (let i = 0; i < dates.length; i++) {
        if (i === 0) {
          tempStreak = 1
        } else {
          const prevDate = new Date(dates[i - 1])
          const currDate = new Date(dates[i])
          const diffTime = currDate.getTime() - prevDate.getTime()
          const diffDays = diffTime / (1000 * 60 * 60 * 24)
          
          if (diffDays === 1) {
            tempStreak++
          } else {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    }
    
    // Calculate daily coins earned today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayActions } = await supabase
      .from('daily_actions')
      .select('coins_earned, completed')
      .eq('user_id', userId)
      .eq('date', today)
    
    const dailyCoinsEarned = todayActions?.filter(a => a.completed).reduce((sum, a) => sum + (a.coins_earned || 0), 0) || 0
    
    return {
      profile,
      totalEarnings,
      level,
      currentStreak,
      longestStreak,
      activeProjects: projects?.filter(p => p.status === 'live').length || 0,
      totalProjects: projects?.length || 0,
      dailyCoinsEarned,
      projects
    }
  } catch (error) {
    console.error('Error calculating user stats:', error)
    return null
  }
}

// Project Management Functions
export const createProject = async (userId: string, projectData: {
  title: string
  description: string
  image_url?: string
  revenue: number
  status: 'development' | 'live' | 'paused'
}) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  let newAchievements: string[] = []
  
  if (!error && data) {
    // Recalculate user stats and update profile
    const userStats = await calculateUserStats(userId)
    if (userStats) {
      // Update profile with new totals and level
      await supabase
        .from('profiles')
        .update({
          total_earnings: userStats.totalEarnings,
          level: userStats.level,
          current_streak: userStats.currentStreak,
          longest_streak: userStats.longestStreak,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }
    
    // Check for achievements
    if (projectData.revenue > 0) {
      newAchievements = (await checkAndAwardAchievements(userId, 'first_earning')) || []
    }
  }

  return { data, error, newAchievements }
}

export const updateProject = async (projectId: string, updates: Partial<{
  title: string
  description: string
  image_url: string
  revenue: number
  status: 'development' | 'live' | 'paused'
}>) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single()

  // If revenue was updated, trigger progression system
  if (!error && data && updates.revenue !== undefined) {
    const userId = data.user_id
    
    // Recalculate user stats and update profile
    const userStats = await calculateUserStats(userId)
    if (userStats) {
      // Update profile with new totals and level
      await supabase
        .from('profiles')
        .update({
          total_earnings: userStats.totalEarnings,
          level: userStats.level,
          current_streak: userStats.currentStreak,
          longest_streak: userStats.longestStreak,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      
      // Check for level-based achievements
      await checkAndAwardAchievements(userId, 'revenue_update')
    }
  }

  return { data, error }
}

// Daily Action Logging Functions
export const logDailyAction = async (userId: string, actionType: 'deep_work' | 'x_post' | 'push' | 'manual_earning', data: {
  description?: string
  duration?: number
  amount?: number
  date?: string
}) => {
  const targetDate = data.date || new Date().toISOString().split('T')[0]
  
  // Check if action already logged for this date
  const { data: existing } = await supabase
    .from('daily_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', actionType)
    .eq('date', targetDate)
    .single()

  if (existing) {
    return { data: existing, error: { message: 'Action already logged for this date' } }
  }

  // Get coin value for action
  const coinValues = {
    deep_work: data.duration && data.duration >= 150 ? 15 : 10, // 2.5 hours = 150 minutes
    x_post: 5,
    push: 15,
    manual_earning: 15
  }

  const { data: action, error } = await supabase
    .from('daily_actions')
    .insert([{
      user_id: userId,
      date: targetDate,
      action_type: actionType,
      completed: true,
      coins_earned: coinValues[actionType],
      description: data.description,
      duration: data.duration,
      amount: data.amount,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (!error) {
    // Update profile total coins
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('total_coins')
      .eq('id', userId)
      .single()

    if (currentProfile) {
      await supabase
        .from('profiles')
        .update({
          total_coins: (currentProfile.total_coins || 0) + coinValues[actionType],
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }

    // Check for achievements
    await checkAndAwardAchievements(userId, actionType)
  }

  return { data: action, error }
}

// Achievement System
export const checkAndAwardAchievements = async (userId: string, trigger: string) => {
  const { profile } = await getUserProfile(userId)
  if (!profile) return

  const currentAchievements = profile.achievements || []
  const newAchievements = [...currentAchievements]

  // Get current user stats for achievement checks
  const userStats = await calculateUserStats(userId)
  if (!userStats) return

  // Check for First Coin achievement
  if ((trigger === 'first_earning' || trigger === 'revenue_update') && userStats.totalEarnings > 0 && !currentAchievements.includes('first_coin')) {
    newAchievements.push('first_coin')
  }

  // Check for milestone-based achievements
  if (userStats.totalEarnings >= 1000 && !currentAchievements.includes('fire_flower')) {
    newAchievements.push('fire_flower')
  }
  
  if (userStats.totalEarnings >= 10000 && !currentAchievements.includes('star_power')) {
    newAchievements.push('star_power')
  }
  
  if (userStats.totalEarnings >= 25000 && !currentAchievements.includes('one_up')) {
    newAchievements.push('one_up')
  }
  
  if (userStats.totalEarnings >= 100000 && !currentAchievements.includes('castle_master')) {
    newAchievements.push('castle_master')
  }

  // Check for project-based achievements
  if (userStats.activeProjects >= 1 && !currentAchievements.includes('mushroom_power')) {
    newAchievements.push('mushroom_power')
  }

  // Update profile if new achievements
  if (newAchievements.length > currentAchievements.length) {
    await supabase
      .from('profiles')
      .update({
        achievements: newAchievements,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
  }

  return newAchievements.filter(a => !currentAchievements.includes(a))
}

// Level system configuration
export const LEVEL_SYSTEM = {
  1: { name: 'Goomba Squasher', emoji: '🍄', threshold: 0 },
  2: { name: 'Coin Collector', emoji: '🪙', threshold: 100 },
  3: { name: 'Fire Flower Master', emoji: '🔥', threshold: 1000 },
  4: { name: 'Star Power', emoji: '⭐', threshold: 5000 },
  5: { name: 'Wing Cap Flyer', emoji: '🦅', threshold: 10000 },
  6: { name: 'Super Star', emoji: '🌟', threshold: 25000 },
  7: { name: 'King Koopa Defeater', emoji: '👑', threshold: 50000 },
  8: { name: 'Castle Master', emoji: '🏰', threshold: 75000 },
  9: { name: 'World Champion', emoji: '🌎', threshold: 100000 }
}

// Coin system configuration
export const COIN_SYSTEM = {
  DAILY_TASKS: {
    DEEP_WORK: { name: 'Deep Work Session', emoji: '🎯', coins: 10, description: '2+ hours focused work' },
    X_POST: { name: 'X Post', emoji: '🐦', coins: 5, description: 'Share your progress' },
    PUSH: { name: 'Code or Content Push', emoji: '⚡', coins: 15, description: 'Log any earnings' },
    STREAK: { name: 'Streak Bonus', emoji: '📅', coins: 5, description: 'Daily consistency' }
  },
  MILESTONES: {
    100: { name: 'Bronze Badge', emoji: '🥉' },
    500: { name: 'Silver Badge', emoji: '🥈' },
    1000: { name: 'Gold Badge', emoji: '🥇' },
    2500: { name: 'Diamond Badge', emoji: '💎' },
    5000: { name: 'Crown Badge', emoji: '👑' }
  }
}

// Achievement system configuration
export const ACHIEVEMENTS = {
  FIRST_COIN: {
    id: 'first_coin',
    name: 'First Coin',
    emoji: '🪙',
    description: 'Made your first dollar online',
    rarity: 'Common',
    requirement: 'earn_first_dollar'
  },
  MUSHROOM_POWER: {
    id: 'mushroom_power',
    name: 'Mushroom Power',
    emoji: '🍄',
    description: '7 day deep work streak',
    rarity: 'Common',
    requirement: 'deep_work_streak_7'
  },
  FIRE_FLOWER: {
    id: 'fire_flower',
    name: 'Fire Flower',
    emoji: '🌸',
    description: 'Posted daily for 30 days',
    rarity: 'Rare',
    requirement: 'x_post_streak_30',
    progress: true
  },
  ONE_UP: {
    id: 'one_up',
    name: '1-UP',
    emoji: '🔥',
    description: 'Launched a profitable project',
    rarity: 'Rare',
    requirement: 'profitable_project'
  },
  STAR_POWER: {
    id: 'star_power',
    name: 'Star Power',
    emoji: '⭐',
    description: 'Reached $10k milestone',
    rarity: 'Epic',
    requirement: 'earn_10k',
    progress: true
  },
  CASTLE_MASTER: {
    id: 'castle_master',
    name: 'Castle Master',
    emoji: '🏰',
    description: 'Reached $100k goal - WON THE GAME **ESCAPED 9-5**',
    rarity: 'Legendary',
    requirement: 'earn_100k'
  }
}

// Helper functions
export const getLevelFromEarnings = (earnings: number): number => {
  const levels = Object.entries(LEVEL_SYSTEM)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
  
  for (const [level, config] of levels) {
    if (earnings >= config.threshold) {
      return parseInt(level)
    }
  }
  return 1
}

export const getNextLevelInfo = (earnings: number) => {
  const currentLevel = getLevelFromEarnings(earnings)
  const nextLevel = currentLevel + 1
  
  if (nextLevel > 9) {
    return { isMaxLevel: true, current: LEVEL_SYSTEM[9] }
  }
  
  const nextLevelConfig = LEVEL_SYSTEM[nextLevel as keyof typeof LEVEL_SYSTEM]
  const remaining = nextLevelConfig.threshold - earnings
  const progress = ((earnings - LEVEL_SYSTEM[currentLevel as keyof typeof LEVEL_SYSTEM].threshold) / 
                   (nextLevelConfig.threshold - LEVEL_SYSTEM[currentLevel as keyof typeof LEVEL_SYSTEM].threshold)) * 100
  
  return {
    isMaxLevel: false,
    current: LEVEL_SYSTEM[currentLevel as keyof typeof LEVEL_SYSTEM],
    next: nextLevelConfig,
    remaining,
    progress: Math.max(0, Math.min(100, progress))
  }
}

// Types for our database
export interface Profile {
  id: string
  username: string
  name: string
  avatar_url: string
  bio?: string
  twitter_username?: string
  twitter_id?: string
  total_earnings: number
  level: number
  xp: number
  total_coins: number
  current_streak: number
  longest_streak: number
  achievements: string[]
  created_at: string
  updated_at: string
}

export interface DailyAction {
  id: string
  user_id: string
  date: string
  action_type: 'deep_work' | 'x_post' | 'push' | 'manual_earning'
  completed: boolean
  coins_earned: number
  description?: string
  duration?: number // for deep work sessions
  amount?: number // for manual earnings
  created_at: string
}

export interface TwitterPost {
  id: string
  user_id: string
  tweet_id: string
  content: string
  author_name: string
  author_username: string
  author_avatar: string
  created_at: string
  likes: number
  retweets: number
  replies: number
}

export interface DeepWorkSession {
  id: string
  user_id: string
  date: string
  duration: number
  description?: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  image_url?: string
  revenue: number
  status: 'development' | 'live' | 'paused'
  created_at: string
  updated_at: string
}

export interface ManualEarning {
  id: string
  user_id: string
  amount: number
  description: string
  source: string
  date: string
  created_at: string
} 