'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistance } from 'date-fns'
import { Activity, GitBranch, Zap, RefreshCw } from 'lucide-react'

interface PushLog {
  id: string
  user_id: string
  date: string
  action_type: 'push' | 'manual_earning'
  description: string
  coins_earned: number
  created_at: string
  completed: boolean
}

interface PushLogsProps {
  userId: string
  logs: PushLog[]
  loading?: boolean
  className?: string
}

export function PushLogs({ userId, logs, loading, className = '' }: PushLogsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getIcon = (actionType: string) => {
    switch (actionType) {
      case 'push':
        return <GitBranch className="w-4 h-4" />
      case 'manual_earning':
        return <Zap className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'push':
        return 'Code Push'
      case 'manual_earning':
        return 'Manual Earning'
      default:
        return 'Activity'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistance(date, new Date(), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="font-medium flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">
              {logs.length} {logs.length === 1 ? 'push' : 'pushes'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-mario-blue border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-white/60">Loading activity...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-white/60">
            <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">Push some code or log earnings to see activity here!</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-mario-blue/20 rounded-full flex items-center justify-center mt-1">
                      {getIcon(log.action_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-mario-blue">
                          {getActionLabel(log.action_type)}
                        </span>
                        <span className="text-xs text-mario-yellow font-bold">
                          +{log.coins_earned} coins
                        </span>
                      </div>
                      <p className="text-sm text-white/90 mb-2 leading-relaxed">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{formatTimeAgo(log.created_at)}</span>
                        <span>•</span>
                        <span>{format(new Date(log.date), 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
} 