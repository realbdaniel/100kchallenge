import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      }
    )

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.id
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get user's Twitter username from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('twitter_username, twitter_id')
      .eq('id', userId)
      .single()

    if (profileError || !profile?.twitter_username) {
      return NextResponse.json({ error: 'Twitter profile not found' }, { status: 404 })
    }

    // In a real implementation, you would:
    // 1. Use the Twitter API v2 to fetch user's tweets
    // 2. Store them in the database
    // 3. Return cached data with real-time updates

    // For now, return mock data
    const mockPosts = [
      {
        id: '1',
        user_id: userId,
        tweet_id: '1234567890',
        content: 'Just shipped a new feature for my SaaS! 🚀 The grind never stops. Building in public day 23 #buildinpublic #100kchallenge',
        author_name: profile.twitter_username,
        author_username: profile.twitter_username,
        author_avatar: `https://unavatar.io/twitter/${profile.twitter_username}`,
        created_at: new Date().toISOString(),
        likes: 47,
        retweets: 12,
        replies: 8
      },
      {
        id: '2',
        user_id: userId,
        tweet_id: '1234567891',
        content: 'Deep work session complete ✅ 3 hours of pure focus on the new dashboard. Sometimes you just need to disconnect and build.',
        author_name: profile.twitter_username,
        author_username: profile.twitter_username,
        author_avatar: `https://unavatar.io/twitter/${profile.twitter_username}`,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        likes: 23,
        retweets: 5,
        replies: 3
      }
    ]

    return NextResponse.json({ posts: mockPosts.slice(0, limit) })

  } catch (error) {
    console.error('Error fetching Twitter posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      }
    )

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tweets } = await request.json()

    // Store tweets in database
    const { data, error } = await supabase
      .from('twitter_posts')
      .insert(tweets)

    if (error) {
      console.error('Error storing tweets:', error)
      return NextResponse.json({ error: 'Failed to store tweets' }, { status: 500 })
    }

    return NextResponse.json({ success: true, inserted: true })

  } catch (error) {
    console.error('Error in POST /api/twitter/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Example function to fetch real Twitter data (commented out for now)
/*
async function fetchTwitterPosts(username: string, bearerToken: string) {
  const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  const userData = await response.json()
  const userId = userData.data.id

  const tweetsResponse = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics,text&user.fields=profile_image_url,username,name`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!tweetsResponse.ok) {
    throw new Error('Failed to fetch tweets')
  }

  const tweetsData = await tweetsResponse.json()
  
  return tweetsData.data?.map((tweet: any) => ({
    tweet_id: tweet.id,
    content: tweet.text,
    author_name: userData.data.name,
    author_username: userData.data.username,
    author_avatar: userData.data.profile_image_url,
    created_at: tweet.created_at,
    likes: tweet.public_metrics.like_count,
    retweets: tweet.public_metrics.retweet_count,
    replies: tweet.public_metrics.reply_count,
  })) || []
}
*/ 