'use client'

import { motion } from 'framer-motion'
import { Star, Crown, Zap } from 'lucide-react'
import { LEVEL_SYSTEM, getLevelFromEarnings, getNextLevelInfo } from '@/lib/supabase'

interface LevelBadgeProps {
  level?: number
  earnings: number
  totalCoins?: number
  className?: string
}

export function LevelBadge({ level, earnings, totalCoins = 0, className = '' }: LevelBadgeProps) {
  const currentLevel = level || getLevelFromEarnings(earnings)
  const levelInfo = getNextLevelInfo(earnings)
  const currentLevelConfig = LEVEL_SYSTEM[currentLevel as keyof typeof LEVEL_SYSTEM]
  
  const getLevelColor = (level: number) => {
    if (level >= 9) return 'bg-mario-purple'
    if (level >= 7) return 'bg-mario-orange'
    if (level >= 5) return 'bg-mario-blue'
    if (level >= 3) return 'bg-mario-red'
    return 'bg-mario-green'
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getLevelColor(currentLevel)} power-up-glow`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-xl">{currentLevelConfig.emoji}</span>
        </motion.div>
        
        <div>
          <div className="pixel-text font-bold text-lg">Level {currentLevel}</div>
          <div className="text-sm text-gray-600">
            {currentLevelConfig.name}
          </div>
          <div className="text-xs text-gray-500">
            {totalCoins} coins • ${earnings.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Revenue Progress Bar */}
      {!levelInfo.isMaxLevel ? (
        <div className="mario-progress-bar h-4">
          <motion.div
            className="bg-gradient-to-r from-mario-green to-mario-yellow h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(levelInfo.progress || 0, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Next level indicator */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
            {levelInfo.next?.emoji}
          </div>
          
          {/* Sparkle effects */}
          {(levelInfo.progress || 0) > 75 && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <motion.div
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mario-progress-bar h-4 bg-gradient-to-r from-mario-yellow to-mario-orange relative">
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            🎉 GAME WON! 🎉
          </div>
        </div>
      )}
      
              {!levelInfo.isMaxLevel && levelInfo.next && (
          <div className="text-xs text-gray-500 mt-1">
            ${(levelInfo.remaining || 0).toLocaleString()} to {levelInfo.next.name}
          </div>
        )}
    </div>
  )
} 