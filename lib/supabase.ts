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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
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