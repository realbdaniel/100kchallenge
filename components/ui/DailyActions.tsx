'use client'

import { useState } from 'react'
import { Clock, DollarSign, Share2, Zap, Check, Plus } from 'lucide-react'

interface DailyAction {
  id: string
  action_type: 'deep_work' | 'x_post' | 'push' | 'manual_earning'
  completed: boolean
  coins_earned: number
  description?: string
  duration?: number
  amount?: number
}

interface DailyActionsProps {
  userId: string
  actions: DailyAction[]
  dailyCoinsEarned: number
  currentStreak: number
  className?: string
}

export function DailyActions({ userId, actions, dailyCoinsEarned, currentStreak, className = '' }: DailyActionsProps) {
  const getActionStatus = (actionType: string) => {
    const action = actions.find(a => a.action_type === actionType && a.completed)
    return !!action
  }

  // Check if streak bonus should be awarded (all 3 actions completed + streak >= 2)
  const getStreakBonusStatus = () => {
    const deepWorkDone = getActionStatus('deep_work')
    const xPostDone = getActionStatus('x_post') 
    const pushDone = getActionStatus('push')
    
    // All 3 actions must be completed AND streak must be >= 2 days
    return deepWorkDone && xPostDone && pushDone && currentStreak >= 2
  }

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Daily Actions</h2>
          <div className="text-xs text-mario-yellow font-bold">
            {dailyCoinsEarned}/40 coins
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {/* Deep Work Session */}
        <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="text-lg">🎯</div>
          <div className="flex-1">
            <div className="text-sm font-medium">Deep Work Session</div>
            <div className="text-xs text-white/60">2+ hours focused work</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mario-yellow">10-15 coins</span>
            {getActionStatus('deep_work') && (
              <Check className="h-4 w-4 text-green-400" />
            )}
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
            {getActionStatus('x_post') ? (
              <Check className="h-4 w-4 text-blue-400" />
            ) : (
              <div className="text-xs text-white/50">Auto-tracked</div>
            )}
          </div>
        </div>
        
        {/* Push/Earning */}
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg">⚡</div>
          <div className="flex-1">
            <div className="text-sm">Code or Content Push</div>
            <div className="text-xs text-white/60">Log your progress</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mario-yellow">15 coins</span>
            {getActionStatus('push') && (
              <Check className="h-4 w-4 text-green-400" />
            )}
          </div>
        </div>
        
        {/* Streak Bonus */}
        <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="text-lg">📅</div>
          <div className="flex-1">
            <div className="text-sm font-medium">Streak Bonus</div>
            <div className="text-xs text-white/60">Daily consistency (2+ days)</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mario-yellow">5 coins</span>
            {getStreakBonusStatus() && (
              <Check className="h-4 w-4 text-orange-400" />
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-6 pt-0">
        <div className="p-3 bg-mario-yellow/10 rounded-lg border border-mario-yellow/20">
          <div className="text-xs font-medium text-mario-yellow">Coin Progress</div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-1">
            <div 
              className="bg-mario-yellow rounded-full h-2" 
              style={{ width: `${Math.min((dailyCoinsEarned / 40) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/60 mt-1">
            {40 - dailyCoinsEarned > 0 ? `${40 - dailyCoinsEarned} coins to max daily` : 'Daily max reached!'}
          </div>
        </div>
      </div>
    </div>
  )
} 