'use client'

import { useState } from 'react'
import { Info, X, Trophy, Star, Zap } from 'lucide-react'
import { LEVEL_SYSTEM, COIN_SYSTEM, ACHIEVEMENTS } from '@/lib/supabase'

export function GameInfoPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'levels' | 'coins' | 'achievements'>('levels')

  const rarityColors = {
    'Common': 'text-gray-400 border-gray-400',
    'Rare': 'text-blue-400 border-blue-400',
    'Epic': 'text-purple-400 border-purple-400',
    'Legendary': 'text-yellow-400 border-yellow-400'
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        title="Game Info"
      >
        <Info className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold pixel-text">🎮 Game Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('levels')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'levels' 
                    ? 'bg-mario-blue text-white border-b-2 border-mario-blue' 
                    : 'hover:bg-white/5'
                }`}
              >
                🎮 Levels
              </button>
              <button
                onClick={() => setActiveTab('coins')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'coins' 
                    ? 'bg-mario-yellow text-black border-b-2 border-mario-yellow' 
                    : 'hover:bg-white/5'
                }`}
              >
                🪙 Coins
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'achievements' 
                    ? 'bg-mario-purple text-white border-b-2 border-mario-purple' 
                    : 'hover:bg-white/5'
                }`}
              >
                🏆 Achievements
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'levels' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">🎮 Level Progression System</h3>
                    <p className="text-white/70">Revenue-based progression with Mario-inspired themes</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(LEVEL_SYSTEM).map(([level, config]) => (
                      <div key={level} className="glass-card p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{config.emoji}</div>
                          <div>
                            <div className="font-bold">Level {level}</div>
                            <div className="text-sm text-white/70">{config.name}</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-mario-green font-bold">
                            ${config.threshold.toLocaleString()}+
                          </span>
                          {level === '9' && (
                            <span className="ml-2 text-mario-yellow font-bold">
                              🎉 WON THE GAME!
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'coins' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">🪙 Coin System</h3>
                    <p className="text-white/70">Earn up to 40 coins per day by completing tasks</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-mario-yellow" />
                      Daily Tasks
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(COIN_SYSTEM.DAILY_TASKS).map(([key, task]) => (
                        <div key={key} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <div className="text-xl">{task.emoji}</div>
                          <div className="flex-1">
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-white/70">{task.description}</div>
                          </div>
                          <div className="text-mario-yellow font-bold">
                            {task.coins} coins
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-mario-yellow" />
                      Coin Milestones & Rewards
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(COIN_SYSTEM.MILESTONES).map(([coins, reward]) => (
                        <div key={coins} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="text-xl">{reward.emoji}</div>
                          <div className="flex-1">
                            <div className="font-medium">{reward.name}</div>
                            <div className="text-sm text-white/70">{coins} coins</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">🏆 Achievement System</h3>
                    <p className="text-white/70">6 Achievements with Rarity Levels</p>
                  </div>

                  <div className="space-y-4">
                    {Object.values(ACHIEVEMENTS).map((achievement) => (
                      <div key={achievement.id} className="glass-card p-4 border border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{achievement.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold">{achievement.name}</h4>
                              <span className={`px-2 py-1 rounded text-xs border ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                                {achievement.rarity}
                              </span>
                            </div>
                            <p className="text-sm text-white/70">{achievement.description}</p>
                            {(achievement as any).progress && (
                              <div className="mt-2">
                                <div className="text-xs text-white/50">Progress tracking available</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 