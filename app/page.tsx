import Link from 'next/link'
import { Coins, Target, Zap, Users, TrendingUp, Calendar, Trophy, Github, Twitter, X } from 'lucide-react'
import MarioAnimations from '@/components/ui/MarioAnimations'

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Mario-inspired animations */}
      <MarioAnimations />
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center main-content">
        <div className="max-w-6xl mx-auto">
          {/* Modern hero title */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-tight">
              $100K Challenge
            </h1>
          </div>
          
          <p className="text-2xl text-white/80 mb-8 max-w-3xl mx-auto font-medium">
            Break free from the 9-5 grind! Track your journey to your first $100k online with 
            gamified progress tracking, deep work streaks, and project showcases.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard" className="mario-button text-xl px-8 py-4 inline-block">
              🍄 Start Your Journey
            </Link>
            <Link href="/u/demo" className="mario-button-secondary text-xl px-8 py-4 inline-block">
              👀 Explore Builders
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 main-content">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            🎮 Power-Up Your Builder Journey
          </h2>
          <p className="text-xl text-white/60 text-center mb-16 max-w-2xl mx-auto">
            Gamified tracking, achievements, and community to keep you motivated
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deep Work Power-Ups */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <Calendar className="absolute top-4 left-4 w-8 h-8 text-green-400" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">🍄 Deep Work Power-Ups</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Earn mushroom power-ups for 2+ hour deep work sessions. Build streaks to unlock fire flowers!
                </p>
                
                {/* GitHub-style contribution chart */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${
                      i < 2 ? 'bg-slate-700' : 
                      i < 5 ? 'bg-green-400/30' : 
                      'bg-green-400'
                    }`}></div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Current streak: 12 days</span>
                  <span className="text-green-400">🪙 +10 coins/day</span>
                </div>
              </div>
            </div>

            {/* Project Castles */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <Zap className="absolute top-4 left-4 w-8 h-8 text-mario-blue" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">🏰 Project Castles</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Build your empire! Each profitable project is a castle in your kingdom.
                </p>
                
                {/* Project items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
                    <span className="text-sm">🏰 SaaS Castle</span>
                    <span className="text-green-400 text-sm">$1,200</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
                    <span className="text-sm">🗼 Course Tower</span>
                    <span className="text-green-400 text-sm">$800</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Star Power Posts */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <X className="absolute top-4 left-4 w-8 h-8 text-mario-cyan" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">⭐ Star Power Posts</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Daily X posts give you star power! Share your journey and inspire others.
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-white/60">Posting streak</span>
                    <span className="text-mario-cyan">8 days 🪙 <span className="text-yellow-400">+5</span></span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progression */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <TrendingUp className="absolute top-4 left-4 w-8 h-8 text-green-400" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">🎯 Level Progression</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Each revenue milestone unlocks a new level with special rewards and recognition!
                </p>
                
                {/* Level indicator */}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-lg font-bold text-red-400">Fire Flower Master</div>
                  <div className="text-2xl font-bold text-green-400">$1,200</div>
                </div>
                
                <div className="mario-progress-bar h-3 mb-2">
                  <div className="mario-progress-fill" style={{ width: '24%' }}></div>
                </div>
                <div className="text-sm text-white/60 text-center">Next: ⭐ Star Power at $5k</div>
              </div>
            </div>

            {/* Achievement Hunter */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <Users className="absolute top-4 left-4 w-8 h-8 text-mario-purple" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">🏆 Achievement Hunter</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Unlock epic achievements as you hit milestones. Show off your badges to the community!
                </p>
                
                {/* Achievement badges */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center">🪙</div>
                  <div className="w-12 h-12 bg-red-400 rounded flex items-center justify-center">🍄</div>
                  <div className="w-12 h-12 bg-orange-400 rounded flex items-center justify-center">🔥</div>
                  <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center">⭐</div>
                  <div className="w-12 h-12 bg-slate-600 rounded flex items-center justify-center filter grayscale opacity-50">🦅</div>
                  <div className="w-12 h-12 bg-slate-600 rounded flex items-center justify-center filter grayscale opacity-50">🌟</div>
                  <div className="w-12 h-12 bg-slate-600 rounded flex items-center justify-center filter grayscale opacity-50">👑</div>
                  <div className="w-12 h-12 bg-slate-600 rounded flex items-center justify-center filter grayscale opacity-50">🏰</div>
                </div>
                
                <div className="text-sm text-white/60 text-center">4/8 achievements unlocked</div>
              </div>
            </div>

            {/* Builder Leaderboards */}
            <div className="glass-card p-6 hover:bg-slate-900/60 transition-all duration-300 hover:mario-bounce relative">
              <Github className="absolute top-4 left-4 w-8 h-8 text-mario-orange" />
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-2 text-left">🌎 Builder Leaderboards</h3>
                <p className="text-white/60 text-left text-sm mb-4">
                  Compete with fellow builders and showcase your projects! See who's climbing the levels fastest and get inspired.
                </p>
                
                {/* Leaderboard */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-green-400">🔥</span>
                      <span>@builderking</span>
                    </span>
                    <span className="text-green-400">Level 8 🏰</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-purple-400">🔥</span>
                      <span>@codequeen</span>
                    </span>
                    <span className="text-purple-400">Level 7 👑</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400">🔥</span>
                      <span>@startupninja</span>
                    </span>
                    <span className="text-blue-400">Level 6 ⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/20 backdrop-blur-sm main-content">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            How to Play
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl mx-auto mb-4 hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-pointer">
                💻
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-white/60">Sign in with your X account add your projects</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mx-auto mb-4 hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-pointer">
                🔌
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
              <p className="text-white/60">Link your Stripe account for tracking and competition</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mx-auto mb-4 hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-pointer">
                🏗️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build</h3>
              <p className="text-white/60">Log your deep work sessions and product/content pushes</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mx-auto mb-4 hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-pointer">
                💸
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Earn</h3>
              <p className="text-white/60">Watch your revenue battery fill up to $100k!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center main-content">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Break Free? 🚀
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of builders working to leave their 9-5 and already crushing their $100k goals.
          </p>
          <Link href="/dashboard" className="mario-button text-2xl px-12 py-6 inline-block">
            🍄 Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-slate-900/20 backdrop-blur-sm main-content">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 