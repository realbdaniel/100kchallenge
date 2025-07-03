import Link from 'next/link'
import { Coins, Target, Zap, Users, TrendingUp, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Modern hero title */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 power-up-glow">
              <span className="text-3xl">🍄</span>
            </div>
            <h1 className="text-6xl font-bold text-white tracking-tight">
              100K Challenge
            </h1>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center ml-4 power-up-glow">
              <span className="text-3xl">🚀</span>
            </div>
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Power-Up Your Builder Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Deep Work Tracking */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Deep Work Streaks</h3>
              <p className="text-white/60">
                Track your daily 2+ hour deep work sessions with a GitHub-style heatmap. 
                Build unstoppable momentum!
              </p>
            </div>

            {/* Social Proof */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Social Building</h3>
              <p className="text-white/60">
                Connect your X account, track daily posts, and display your feed. 
                Build in public like a pro!
              </p>
            </div>

            {/* Revenue Tracking */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Revenue Battery</h3>
              <p className="text-white/60">
                Stripe integration shows your progress to $100k with a Mario-style 
                power meter. Watch it grow!
              </p>
            </div>

            {/* Project Showcase */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Project Castle</h3>
              <p className="text-white/60">
                Showcase your projects with screenshots and descriptions. 
                Build your empire one project at a time!
              </p>
            </div>

            {/* Gamification */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Level Up System</h3>
              <p className="text-white/60">
                Earn XP, level up, and unlock achievements. Making money has 
                never been this fun!
              </p>
            </div>

            {/* Public Profile */}
            <div className="glass-card p-8 text-center hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 power-up-glow">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Builder Profile</h3>
              <p className="text-white/60">
                Get your own public profile URL to share your journey. 
                Inspire others and get discovered!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            How to Play
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-white/60">Create your account and choose your builder username</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
              <p className="text-white/60">Link your X account and Stripe for tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build</h3>
              <p className="text-white/60">Log your deep work sessions and showcase projects</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                4️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Earn</h3>
              <p className="text-white/60">Watch your revenue battery fill up to $100k!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Break Free? 🚀
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of builders already crushing their 100k goals
          </p>
          <Link href="/dashboard" className="mario-button text-2xl px-12 py-6 inline-block">
            🍄 Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  )
} 