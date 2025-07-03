'use client'

import { useEffect, useState } from 'react'
import { X, Trophy } from 'lucide-react'
import { ACHIEVEMENTS } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  rarity: string
}

interface AchievementToastProps {
  achievements: string[]
  onDismiss: (achievementId: string) => void
}

export function AchievementToast({ achievements, onDismiss }: AchievementToastProps) {
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const newAchievements = achievements.map(id => {
      const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id)
      return achievement ? {
        id: achievement.id,
        title: achievement.name,
        description: achievement.description,
        emoji: achievement.emoji,
        rarity: achievement.rarity
      } : null
    }).filter(Boolean) as Achievement[]

    setVisibleAchievements(prev => [...prev, ...newAchievements])

    // Auto dismiss after 6 seconds
    const timers = newAchievements.map(achievement => 
      setTimeout(() => {
        handleDismiss(achievement.id)
      }, 6000)
    )

    return () => timers.forEach(clearTimeout)
  }, [achievements])

  const handleDismiss = (achievementId: string) => {
    setVisibleAchievements(prev => prev.filter(a => a.id !== achievementId))
    onDismiss(achievementId)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'border-green-500/30 bg-green-500/10'
      case 'rare': return 'border-blue-500/30 bg-blue-500/10'
      case 'epic': return 'border-purple-500/30 bg-purple-500/10'
      case 'legendary': return 'border-yellow-500/30 bg-yellow-500/10'
      default: return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'shadow-green-500/20'
      case 'rare': return 'shadow-blue-500/20'
      case 'epic': return 'shadow-purple-500/20'
      case 'legendary': return 'shadow-yellow-500/20'
      default: return 'shadow-gray-500/20'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {visibleAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5
            }}
            className={`relative overflow-hidden rounded-xl border-2 backdrop-blur-lg shadow-2xl ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`}
          >
            {/* Achievement Sparkle Animation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce"></div>
            </div>

            <div className="relative p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Achievement Unlocked!
                  </span>
                </div>
                <button
                  onClick={() => handleDismiss(achievement.id)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Achievement Content */}
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">
                  {achievement.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm truncate">
                      {achievement.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      achievement.rarity.toLowerCase() === 'common' ? 'bg-green-500/20 text-green-300' :
                      achievement.rarity.toLowerCase() === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                      achievement.rarity.toLowerCase() === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar Animation */}
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full ${
                    achievement.rarity.toLowerCase() === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                    achievement.rarity.toLowerCase() === 'epic' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                    achievement.rarity.toLowerCase() === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                    'bg-gradient-to-r from-green-400 to-emerald-400'
                  }`}
                />
              </div>
            </div>

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-xl opacity-30 ${
              achievement.rarity.toLowerCase() === 'legendary' ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20' :
              achievement.rarity.toLowerCase() === 'epic' ? 'bg-gradient-to-br from-purple-400/20 to-pink-400/20' :
              achievement.rarity.toLowerCase() === 'rare' ? 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20' :
              'bg-gradient-to-br from-green-400/20 to-emerald-400/20'
            }`} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 