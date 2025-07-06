'use client'

import { motion } from 'framer-motion'
import { format, subDays, isSameDay } from 'date-fns'

interface ProgressTrackerProps {
  data: Array<{
    date: Date
    coins: number // daily coins earned (0-40)
  }>
  className?: string
}

export function HeatMap({ data, className = '' }: ProgressTrackerProps) {
  const today = new Date()
  const startDate = subDays(today, 364) // Show 1 year of data
  
  const getDays = () => {
    const days = []
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, 364 - i)
      const dayData = data.find(d => isSameDay(d.date, date))
      
      days.push({
        date,
        coins: dayData?.coins || 0,
        level: getProgressLevel(dayData?.coins || 0)
      })
    }
    return days
  }
  
  const getProgressLevel = (coins: number) => {
    if (coins === 0) return 0
    if (coins < 10) return 1      // 5-9 coins (light green)
    if (coins < 20) return 2      // 10-19 coins 
    if (coins < 30) return 3      // 20-29 coins
    return 4                      // 30-40 coins (dark green)
  }
  
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-mario-green opacity-25'
      case 2: return 'bg-mario-green opacity-50'
      case 3: return 'bg-mario-green opacity-75'
      case 4: return 'bg-mario-green opacity-100'
      default: return 'bg-gray-200'
    }
  }
  
  const days = getDays()
  const weeks = []
  
  // Group days into weeks
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-bold pixel-text mb-2">Daily Progress Tracker ⚡</h3>
        <p className="text-sm text-gray-600">
          Your daily action streak - complete all tasks to max out at 40 coins!
        </p>
      </div>
      
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3 rounded-sm cursor-pointer ${getColorClass(day.level)}`}
                whileHover={{ scale: 1.2 }}
                title={`${format(day.date, 'MMM d, yyyy')}: ${
                  day.coins ? `${day.coins} coins earned` : 'No actions logged'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
        <div className="ml-4 text-xs text-white/60">
          0 → 5-9 → 10-19 → 20-29 → 30-40 coins
        </div>
      </div>
    </div>
  )
} 