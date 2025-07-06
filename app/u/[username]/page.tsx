import { notFound } from 'next/navigation'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HeatMap } from '@/components/ui/HeatMap'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XFeed } from '@/components/ui/XFeed'
import { ExternalLink, Calendar, Target, Trophy, Zap } from 'lucide-react'
import Image from 'next/image'

// This would normally come from your database
async function getUserProfile(username: string) {
  // Mock data - replace with actual database query
  if (username === 'johndoe') {
    return {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      bio: 'Building the future one line of code at a time. Currently working on AI-powered productivity tools.',
      image: '/avatar-placeholder.jpg',
      totalEarnings: 42000,
      level: 12,
      xp: 8750,
      currentStreak: 18,
      longestStreak: 45,
      joinedAt: new Date('2023-06-15'),
      twitterHandle: 'johndoe',
      projects: [
        {
          id: '1',
          title: 'TaskMaster Pro',
          description: 'AI-powered task management with smart scheduling',
          url: 'https://taskmaster.pro',
          imageUrl: '/project1.jpg',
          revenue: 25000
        },
        {
          id: '2',
          title: 'CodeSnap',
          description: 'Beautiful code screenshot generator for social media',
          url: 'https://codesnap.dev',
          imageUrl: '/project2.jpg',
          revenue: 12000
        },
        {
          id: '3',
          title: 'MeetSync',
          description: 'Smart calendar scheduling for remote teams',
          url: 'https://meetsync.app',
          imageUrl: '/project3.jpg',
          revenue: 5000
        }
      ],
      deepWorkData: [
        { date: new Date('2024-01-15'), duration: 180 },
        { date: new Date('2024-01-16'), duration: 150 },
        { date: new Date('2024-01-17'), duration: 240 },
        // More mock data...
      ],
      stats: {
        totalProjects: 3,
        totalCommits: 1247,
        totalPosts: 89
      }
    }
  }
  return null
}

export default async function UserProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const user = await getUserProfile(params.username)
  
  if (!user) {
    notFound()
  }

  const progressPercentage = (user.totalEarnings / 100000) * 100

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mario-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-mario-blue flex items-center justify-center text-6xl">
                🍄
              </div>
              <div className="absolute -bottom-2 -right-2">
                <LevelBadge level={user.level} earnings={user.totalEarnings} className="scale-75" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold pixel-text text-gray-800">
                  {user.name}
                </h1>
                <div className="text-2xl">
                  {user.level >= 50 ? '👑' : user.level >= 25 ? '⭐' : '🚀'}
                </div>
              </div>
              
              <p className="text-lg text-mario-blue font-semibold mb-3">
                @{user.username}
              </p>
              
              <p className="text-gray-600 mb-4 max-w-2xl">
                {user.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {user.joinedAt.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                {user.twitterHandle && (
                  <a 
                    href={`https://twitter.com/${user.twitterHandle}`}
                    className="flex items-center gap-1 hover:text-mario-blue"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @{user.twitterHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Progress */}
          <div className="mario-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mario-green rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold pixel-text">Progress</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              ${user.totalEarnings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {progressPercentage.toFixed(1)}% to $100k
            </div>
            <ProgressBar current={user.totalEarnings} target={100000} />
          </div>

          {/* Current Streak */}
          <div className="mario-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mario-orange rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold pixel-text">Streak</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {user.currentStreak}
            </div>
            <div className="text-sm text-gray-600">
              days in a row! 🔥
            </div>
          </div>

          {/* Best Streak */}
          <div className="mario-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mario-red rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold pixel-text">Best</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {user.longestStreak}
            </div>
            <div className="text-sm text-gray-600">
              day record!
            </div>
          </div>

          {/* Projects */}
          <div className="mario-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mario-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏰</span>
              </div>
              <h3 className="font-bold pixel-text">Projects</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {user.stats.totalProjects}
            </div>
            <div className="text-sm text-gray-600">
              live projects
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deep Work Heatmap */}
          <div className="lg:col-span-2 mario-card p-6">
            <HeatMap data={user.deepWorkData.map(item => ({
              date: item.date,
              coins: Math.floor(item.duration / 60) * 2 // Convert minutes to coins (rough conversion)
            }))} />
          </div>

          {/* Achievements */}
          <div className="mario-card p-6">
            <h3 className="font-bold pixel-text mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-mario-yellow" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-mario-yellow bg-opacity-10 rounded-lg">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="font-semibold text-sm">Streak Master</div>
                  <div className="text-xs text-gray-600">30+ day streak</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-mario-green bg-opacity-10 rounded-lg">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="font-semibold text-sm">First $10k</div>
                  <div className="text-xs text-gray-600">Milestone reached</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-mario-blue bg-opacity-10 rounded-lg">
                <div className="text-2xl">🚀</div>
                <div>
                  <div className="font-semibold text-sm">Project Launcher</div>
                  <div className="text-xs text-gray-600">3 projects live</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* X Feed & Projects */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* X Feed */}
          <div className="lg:col-span-1">
            <XFeed userId={user.id} limit={8} />
          </div>

          {/* Projects Showcase */}
          <div className="lg:col-span-2 mario-card p-8">
            <h3 className="text-2xl font-bold pixel-text mb-6 flex items-center gap-2">
              🏰 Project Castle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.projects.map((project) => (
                <div key={project.id} className="bg-white border-2 border-mario-yellow rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-48 bg-gradient-to-br from-mario-blue to-mario-purple flex items-center justify-center">
                    <div className="text-6xl">🚀</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{project.title}</h4>
                      <a 
                        href={project.url}
                        className="text-mario-blue hover:text-mario-red"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-mario-green font-bold">
                        ${project.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">earned</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 