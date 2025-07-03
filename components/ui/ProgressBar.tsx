'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  target: number
  label?: string
  className?: string
}

export function ProgressBar({ current, target, label, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <div className={`mario-progress-bar ${className}`}>
      <motion.div
        className="mario-progress-fill flex items-center justify-center"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {percentage > 20 && (
          <span className="text-white font-bold text-sm pixel-text">
            ${current.toLocaleString()} / ${target.toLocaleString()}
          </span>
        )}
      </motion.div>
      
      {/* Power-up sparkles */}
      {percentage > 50 && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      )}
      
      {percentage > 80 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
} 