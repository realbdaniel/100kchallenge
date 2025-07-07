'use client'

import { useEffect, useState } from 'react'
import { supabase, getUserProfile, LEVEL_SYSTEM, COIN_SYSTEM, ACHIEVEMENTS, getLevelFromEarnings, getNextLevelInfo } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Trophy, Star, Zap, Target, Crown, Coins, GamepadIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface UserProfile {
  id: string
  username: string
  total_earnings: number
  total_coins: number
  level: number
  achievements: string[]
  current_streak: number
  longest_streak: number
}

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'achievements' | 'levels' | 'coins'>('achievements')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        setUser(session.user)

        // Get user profile
        const { profile } = await getUserProfile(session.user.id)
        if (profile) {
          setProfile(profile)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'border-green-500 bg-green-500/10'
      case 'rare': return 'border-blue-500 bg-blue-500/10'
      case 'epic': return 'border-purple-500 bg-purple-500/10'
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'shadow-green-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-yellow-500/50'
      default: return 'shadow-gray-500/50'
    }
  }

  const isAchievementUnlocked = (achievementId: string) => {
    return profile?.achievements?.includes(achievementId) || false
  }

  const getLevelProgress = () => {
    if (!profile) return { current: LEVEL_SYSTEM[1], progress: 0, isMaxLevel: false }
    return getNextLevelInfo(profile.total_earnings)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-xl text-white/60">Loading achievements...</div>
        </div>
      </div>
    )
  }

  const levelProgress = getLevelProgress()

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white pixel-text">🎮 Game Center</h1>
              <p className="text-white/60">Track your progress and unlock achievements</p>
            </div>
          </div>

          {/* User Level Badge */}
          {profile && (
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="text-8xl">{LEVEL_SYSTEM[profile.level as keyof typeof LEVEL_SYSTEM]?.emoji || '🍄'}</div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-white pixel-text">
                    Level {profile.level} - {LEVEL_SYSTEM[profile.level as keyof typeof LEVEL_SYSTEM]?.name || 'Unknown'}
                  </div>
                  <div className="text-xl text-white/60 mb-4">
                    ${profile.total_earnings.toLocaleString()} earned • {profile.total_coins} coins
                  </div>
                  
                  {/* Progress Bar */}
                  {!levelProgress.isMaxLevel && 'next' in levelProgress && levelProgress.next && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress to {levelProgress.next.name}</span>
                        <span className="text-white/60">
                          ${(('remaining' in levelProgress ? levelProgress.remaining : 0) || 0).toLocaleString()} remaining
                        </span>
                      </div>
                      <div className="mario-progress-bar h-4">
                        <div 
                          className="mario-progress-fill" 
                          style={{ width: `${Math.min(('progress' in levelProgress ? levelProgress.progress : 0) || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {levelProgress.isMaxLevel && (
                    <div className="text-2xl font-bold text-mario-yellow pixel-text">
                      🎉 GAME COMPLETED! 🎉
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'achievements' 
                  ? 'bg-mario-purple text-white' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              🏆 Achievements
            </button>
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'levels' 
                  ? 'bg-mario-blue text-white' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              🎮 Levels
            </button>
            <button
              onClick={() => setActiveTab('coins')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'coins' 
                  ? 'bg-mario-yellow text-black' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              🪙 Coins
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 pixel-text">🏆 Achievement Collection</h2>
                <p className="text-white/70 text-lg">
                  {profile ? `${profile.achievements?.length || 0}/6 achievements unlocked` : 'Sign in to view progress'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isUnlocked = isAchievementUnlocked(achievement.id)
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`relative glass-card p-6 border-2 ${
                        isUnlocked 
                          ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                          : 'border-gray-600 bg-gray-800/20'
                      } ${isUnlocked ? 'shadow-2xl' : ''}`}
                    >
                      {/* Achievement Icon */}
                      <div className="text-center mb-4">
                        <div className={`text-8xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.emoji}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <h3 className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            {achievement.name}
                          </h3>
                          {isUnlocked && (
                            <Trophy className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      </div>

                      {/* Achievement Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            isUnlocked 
                              ? getRarityColor(achievement.rarity).replace('bg-', 'bg-').replace('/10', '/20')
                              : 'border-gray-600 bg-gray-800/20 text-gray-500'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        
                        <p className={`text-center text-sm ${isUnlocked ? 'text-white/80' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>

                        {/* Status */}
                        <div className="text-center">
                          {isUnlocked ? (
                            <div className="text-green-400 font-bold text-sm">
                              ✅ UNLOCKED
                            </div>
                          ) : (
                            <div className="text-gray-500 font-bold text-sm">
                              🔒 LOCKED
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sparkle Effect for Unlocked */}
                      {isUnlocked && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 pixel-text">🎮 Level Progression</h2>
                <p className="text-white/70 text-lg">Revenue-based progression with Mario-inspired themes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(LEVEL_SYSTEM).map(([level, config]) => {
                  const levelNum = parseInt(level)
                  const isCurrentLevel = profile?.level === levelNum
                  const isUnlocked = profile ? profile.level >= levelNum : false
                  
                  return (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: parseInt(level) * 0.05 }}
                      className={`glass-card p-6 border-2 ${
                        isCurrentLevel 
                          ? 'border-mario-blue bg-mario-blue/20 shadow-blue-500/50 shadow-2xl' 
                          : isUnlocked 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-gray-600 bg-gray-800/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-6xl mb-3 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {config.emoji}
                        </div>
                        <div className="space-y-2">
                          <div className={`text-2xl font-bold pixel-text ${isCurrentLevel ? 'text-mario-blue' : isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            Level {level}
                          </div>
                          <div className={`text-lg font-semibold ${isCurrentLevel ? 'text-mario-blue' : isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            {config.name}
                          </div>
                          <div className={`text-sm font-bold ${isUnlocked ? 'text-mario-green' : 'text-gray-500'}`}>
                            ${config.threshold.toLocaleString()}+
                          </div>
                          
                          {/* Status Badge */}
                          <div className="pt-2">
                            {isCurrentLevel ? (
                              <div className="text-mario-blue font-bold text-sm">
                                🔥 CURRENT LEVEL
                              </div>
                            ) : isUnlocked ? (
                              <div className="text-green-400 font-bold text-sm">
                                ✅ UNLOCKED
                              </div>
                            ) : (
                              <div className="text-gray-500 font-bold text-sm">
                                🔒 LOCKED
                              </div>
                            )}
                          </div>

                          {level === '9' && isUnlocked && (
                            <div className="text-mario-yellow font-bold text-sm pixel-text">
                              🎉 GAME WON! 🎉
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Coins Tab */}
          {activeTab === 'coins' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 pixel-text">🪙 Coin System</h2>
                <p className="text-white/70 text-lg">
                  {profile ? `You have ${profile.total_coins} coins` : 'Sign in to view your coins'}
                </p>
              </div>

              {/* Daily Tasks */}
              <div className="glass-card p-6 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-mario-yellow" />
                  Daily Tasks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(COIN_SYSTEM.DAILY_TASKS).map(([key, task]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="text-4xl">{task.emoji}</div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{task.name}</div>
                        <div className="text-white/70 text-sm">{task.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-mario-yellow">
                          {task.coins}
                        </div>
                        <div className="text-xs text-white/60">coins</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Coin Milestones */}
              <div className="glass-card p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-mario-yellow" />
                  Coin Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(COIN_SYSTEM.MILESTONES).map(([threshold, milestone]) => {
                    const reached = profile ? profile.total_coins >= parseInt(threshold) : false
                    return (
                      <motion.div
                        key={threshold}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-lg border-2 ${
                          reached 
                            ? 'border-mario-yellow bg-mario-yellow/20' 
                            : 'border-gray-600 bg-gray-800/20'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-3xl mb-2 ${reached ? '' : 'grayscale opacity-50'}`}>
                            {milestone.emoji}
                          </div>
                          <div className={`font-bold ${reached ? 'text-mario-yellow' : 'text-gray-500'}`}>
                            {milestone.name}
                          </div>
                          <div className={`text-sm ${reached ? 'text-white/80' : 'text-gray-500'}`}>
                            {threshold} coins
                          </div>
                          <div className="mt-2">
                            {reached ? (
                              <div className="text-green-400 font-bold text-xs">
                                ✅ EARNED
                              </div>
                            ) : (
                              <div className="text-gray-500 font-bold text-xs">
                                🔒 LOCKED
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 