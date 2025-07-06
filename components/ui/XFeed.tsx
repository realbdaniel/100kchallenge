'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Repeat2, Share, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { TwitterPost } from '@/lib/supabase'

interface XFeedProps {
  limit?: number
  showHeader?: boolean
}

export function XFeed({ limit = 10, showHeader = true }: XFeedProps) {
  const [posts, setPosts] = useState<TwitterPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/twitter/posts`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch posts')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err: any) {
        console.error('Error loading X posts:', err)
        setError(err.message)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [limit])

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

  if (error) {
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
            </div>
          </div>
        )}
        
        <div className="p-6 text-center text-white/60">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-400">Unable to load X feed</p>
          <p className="text-xs mt-1 text-white/60">{error}</p>
          {error.includes('No Twitter username found') && (
            <p className="text-xs mt-2 text-yellow-400">
              Connect your X account in settings to see your feed
            </p>
          )}
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
                    onError={(e) => {
                      // Fallback to a default avatar if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
                    }}
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