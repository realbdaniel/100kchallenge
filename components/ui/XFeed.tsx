'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Repeat2, Share, ExternalLink, Clock } from 'lucide-react'
import { TwitterPost } from '@/lib/supabase'

interface XFeedProps {
  userId?: string
  limit?: number
  showHeader?: boolean
}

// Mock Twitter posts for demo
const mockTwitterPosts: TwitterPost[] = [
  {
    id: '1',
    user_id: 'demo-user',
    tweet_id: '1234567890',
    content: 'Just shipped a new feature for my SaaS! 🚀 The grind never stops. Building in public day 23 #buildinpublic #100kchallenge',
    author_name: 'Demo Builder',
    author_username: 'demobuilder',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    created_at: '2024-01-20T10:30:00Z',
    likes: 47,
    retweets: 12,
    replies: 8
  },
  {
    id: '2',
    user_id: 'demo-user',
    tweet_id: '1234567891',
    content: 'Deep work session complete ✅ 3 hours of pure focus on the new dashboard. Sometimes you just need to disconnect and build.',
    author_name: 'Demo Builder',
    author_username: 'demobuilder',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    created_at: '2024-01-19T14:15:00Z',
    likes: 23,
    retweets: 5,
    replies: 3
  },
  {
    id: '3',
    user_id: 'demo-user',
    tweet_id: '1234567892',
    content: 'Monthly revenue update: $32k MRR! 🎉 68% to my $100k goal. Crazy to think I started this journey 8 months ago with just an idea.',
    author_name: 'Demo Builder',
    author_username: 'demobuilder',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    created_at: '2024-01-18T09:45:00Z',
    likes: 156,
    retweets: 34,
    replies: 21
  },
  {
    id: '4',
    user_id: 'demo-user',
    tweet_id: '1234567893',
    content: 'Pro tip: Your biggest competitor is your past self. Every day is a chance to level up 💪 What are you building today?',
    author_name: 'Demo Builder',
    author_username: 'demobuilder',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    created_at: '2024-01-17T16:20:00Z',
    likes: 89,
    retweets: 18,
    replies: 12
  }
]

export function XFeed({ userId, limit = 10, showHeader = true }: XFeedProps) {
  const [posts, setPosts] = useState<TwitterPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadPosts = async () => {
      setLoading(true)
      // In real implementation, fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts(mockTwitterPosts.slice(0, limit))
      setLoading(false)
    }

    loadPosts()
  }, [userId, limit])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'just now'
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="glass-card p-6">
        {showHeader && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">𝕏</span>
            </div>
            <h2 className="font-medium">X Feed</h2>
          </div>
        )}
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-700/50 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">𝕏</span>
              </div>
              <h2 className="font-medium">X Feed</h2>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              View on X
            </button>
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-white/60">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">𝕏</span>
            </div>
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Connect your X account to see your feed</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex gap-3">
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full border border-white/20"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{post.author_name}</span>
                      <span className="text-white/60 text-sm">@{post.author_username}</span>
                      <span className="text-white/40 text-xs">·</span>
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(post.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/90 mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-6 text-white/60">
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{formatNumber(post.replies)}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <Repeat2 className="h-4 w-4" />
                        <span className="text-xs">{formatNumber(post.retweets)}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">{formatNumber(post.likes)}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 hover:text-white/80 transition-colors ml-auto">
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 