'use client'

import { useState } from 'react'
import { Clock, DollarSign, Share2, Zap, Check, Plus } from 'lucide-react'
import { COIN_SYSTEM } from '@/lib/supabase'

interface DailyAction {
  id: string
  type: 'deep_work' | 'x_post' | 'push' | 'manual_earning'
  completed: boolean
  coins: number
  description?: string
  duration?: number
  amount?: number
}

interface DailyActionsProps {
  userId: string
  actions: DailyAction[]
  onComplete: (actionType: string, data?: any) => void
}

export function DailyActions({ userId, actions, onComplete }: DailyActionsProps) {
  const [showDeepWorkForm, setShowDeepWorkForm] = useState(false)
  const [showEarningsForm, setShowEarningsForm] = useState(false)
  const [deepWorkData, setDeepWorkData] = useState({ duration: 2, description: '' })
  const [earningsData, setEarningsData] = useState({ amount: 0, description: '', source: '' })

  const getActionStatus = (type: string) => {
    const action = actions.find(a => a.type === type)
    return action?.completed || false
  }

  const getTotalCoins = () => {
    return actions.reduce((sum, action) => sum + (action.completed ? action.coins : 0), 0)
  }

  const handleDeepWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deepWorkData.duration >= 2) {
      onComplete('deep_work', deepWorkData)
      setShowDeepWorkForm(false)
      setDeepWorkData({ duration: 2, description: '' })
    }
  }

  const handleEarningsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (earningsData.amount > 0 && earningsData.description && earningsData.source) {
      onComplete('manual_earning', earningsData)
      setShowEarningsForm(false)
      setEarningsData({ amount: 0, description: '', source: '' })
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Daily Actions</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Today:</span>
            <span className="text-mario-yellow font-bold">{getTotalCoins()}/35 coins</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Deep Work Session */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-xl">{COIN_SYSTEM.DAILY_TASKS.DEEP_WORK.emoji}</div>
            <div>
              <div className="font-medium">{COIN_SYSTEM.DAILY_TASKS.DEEP_WORK.name}</div>
              <div className="text-sm text-white/70">{COIN_SYSTEM.DAILY_TASKS.DEEP_WORK.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-mario-yellow font-bold">
              {COIN_SYSTEM.DAILY_TASKS.DEEP_WORK.coins} coins
            </span>
            {getActionStatus('deep_work') ? (
              <div className="flex items-center gap-1 text-mario-green">
                <Check className="h-4 w-4" />
                <span className="text-sm">Done</span>
              </div>
            ) : (
              <button
                onClick={() => setShowDeepWorkForm(true)}
                className="mario-btn mario-btn-primary"
              >
                <Plus className="h-4 w-4" />
                Log
              </button>
            )}
          </div>
        </div>

        {/* X Post */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-xl">{COIN_SYSTEM.DAILY_TASKS.X_POST.emoji}</div>
            <div>
              <div className="font-medium">{COIN_SYSTEM.DAILY_TASKS.X_POST.name}</div>
              <div className="text-sm text-white/70">{COIN_SYSTEM.DAILY_TASKS.X_POST.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-mario-yellow font-bold">
              {COIN_SYSTEM.DAILY_TASKS.X_POST.coins} coins
            </span>
            {getActionStatus('x_post') ? (
              <div className="flex items-center gap-1 text-mario-green">
                <Check className="h-4 w-4" />
                <span className="text-sm">Done</span>
              </div>
            ) : (
              <div className="text-xs text-white/50">Auto-tracked</div>
            )}
          </div>
        </div>

        {/* Push/Deploy */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-xl">{COIN_SYSTEM.DAILY_TASKS.PUSH.emoji}</div>
            <div>
              <div className="font-medium">{COIN_SYSTEM.DAILY_TASKS.PUSH.name}</div>
              <div className="text-sm text-white/70">{COIN_SYSTEM.DAILY_TASKS.PUSH.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-mario-yellow font-bold">
              {COIN_SYSTEM.DAILY_TASKS.PUSH.coins} coins
            </span>
            {getActionStatus('push') ? (
              <div className="flex items-center gap-1 text-mario-green">
                <Check className="h-4 w-4" />
                <span className="text-sm">Done</span>
              </div>
            ) : (
              <button
                onClick={() => setShowEarningsForm(true)}
                className="mario-btn mario-btn-primary"
              >
                <Plus className="h-4 w-4" />
                Log
              </button>
            )}
          </div>
        </div>

        {/* Streak Bonus */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-xl">{COIN_SYSTEM.DAILY_TASKS.STREAK.emoji}</div>
            <div>
              <div className="font-medium">{COIN_SYSTEM.DAILY_TASKS.STREAK.name}</div>
              <div className="text-sm text-white/70">{COIN_SYSTEM.DAILY_TASKS.STREAK.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-mario-yellow font-bold">
              {COIN_SYSTEM.DAILY_TASKS.STREAK.coins} coins
            </span>
            <div className="text-xs text-white/50">Auto-awarded</div>
          </div>
        </div>
      </div>

      {/* Deep Work Form Modal */}
      {showDeepWorkForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">🎯 Log Deep Work Session</h3>
              <form onSubmit={handleDeepWorkSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="2"
                    max="12"
                    step="0.5"
                    value={deepWorkData.duration}
                    onChange={(e) => setDeepWorkData({...deepWorkData, duration: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    value={deepWorkData.description}
                    onChange={(e) => setDeepWorkData({...deepWorkData, description: e.target.value})}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    rows={3}
                    placeholder="What did you work on?"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeepWorkForm(false)}
                    className="flex-1 mario-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 mario-btn mario-btn-primary"
                    disabled={deepWorkData.duration < 2}
                  >
                    Log Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manual Earnings Form Modal */}
      {showEarningsForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">💰 Log Manual Earning</h3>
              <form onSubmit={handleEarningsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={earningsData.amount}
                    onChange={(e) => setEarningsData({...earningsData, amount: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <input
                    type="text"
                    value={earningsData.source}
                    onChange={(e) => setEarningsData({...earningsData, source: e.target.value})}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    placeholder="e.g., Client payment, Product sale, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={earningsData.description}
                    onChange={(e) => setEarningsData({...earningsData, description: e.target.value})}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:border-mario-blue focus:outline-none"
                    rows={3}
                    placeholder="Tell us about this earning..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEarningsForm(false)}
                    className="flex-1 mario-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 mario-btn mario-btn-primary"
                    disabled={!earningsData.amount || !earningsData.description || !earningsData.source}
                  >
                    Log Earning
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 