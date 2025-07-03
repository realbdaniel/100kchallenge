'use client'

import { motion } from 'framer-motion'
import { format, subDays, isSameDay } from 'date-fns'

interface HeatMapProps {
  data: Array<{
    date: Date
    duration: number // in minutes
  }>
  className?: string
}

export function HeatMap({ data, className = '' }: HeatMapProps) {
  const today = new Date()
  const startDate = subDays(today, 364) // Show 1 year of data
  
  const getDays = () => {
    const days = []
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, 364 - i)
      const dayData = data.find(d => isSameDay(d.date, date))
      
      days.push({
        date,
        duration: dayData?.duration || 0,
        level: getIntensityLevel(dayData?.duration || 0)
      })
    }
    return days
  }
  
  const getIntensityLevel = (duration: number) => {
    if (duration === 0) return 0
    if (duration < 60) return 1      // < 1 hour
    if (duration < 120) return 2     // 1-2 hours
    if (duration < 180) return 3     // 2-3 hours
    return 4                         // 3+ hours (power level!)
  }
  
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-mario-green opacity-30'
      case 2: return 'bg-mario-green opacity-60'
      case 3: return 'bg-mario-green opacity-80'
      case 4: return 'bg-mario-green power-up-glow'
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
        <h3 className="text-lg font-bold pixel-text mb-2">Deep Work Streak 🔥</h3>
        <p className="text-sm text-gray-600">
          Your daily deep work sessions - aim for 2+ hours to power up!
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
                  day.duration ? `${Math.floor(day.duration / 60)}h ${day.duration % 60}m` : 'No work logged'
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
      </div>
    </div>
  )
} 