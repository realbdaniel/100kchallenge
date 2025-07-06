import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Create Supabase server client with proper cookie handling
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // No-op for server-side reads
          },
          remove(name: string, options: any) {
            // No-op for server-side reads
          },
        },
      }
    )

    // Get session from authorization header if available
    const authHeader = request.headers.get('authorization')
    let user = null

    if (authHeader?.startsWith('Bearer ')) {
      // Try with bearer token
      const token = authHeader.substring(7)
      const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token)
      if (!error && tokenUser) {
        user = tokenUser
      }
    }

    // If no bearer token, try with session cookies
    if (!user) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (!sessionError && session?.user) {
        user = session.user
      }
    }

    // If still no user, try a different approach with service client
    if (!user) {
      // Check if we can get user from any available session data
      const sb_access_token = cookieStore.get('sb-access-token')?.value || 
                              cookieStore.get('supabase-auth-token')?.value ||
                              cookieStore.get('sb-localhost-auth-token')?.value

      if (sb_access_token) {
        try {
          const { data: { user: serviceUser }, error } = await supabase.auth.getUser(sb_access_token)
          if (!error && serviceUser) {
            user = serviceUser
          }
        } catch (e) {
          console.log('Service auth attempt failed:', e)
        }
      }
    }

    if (!user) {
      console.log('No user found in any authentication method')
      // Return fallback posts for demo purposes
      const fallbackPosts = [
        {
          id: '1',
          user_id: 'demo',
          tweet_id: '1234567890',
          content: `Just shipped a new feature! 🚀 The grind never stops. Building in public #buildinpublic #100kchallenge`,
          author_name: 'Builder',
          author_username: 'builder',
          author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
          created_at: new Date().toISOString(),
          likes: 47,
          retweets: 12,
          replies: 8
        },
        {
          id: '2',
          user_id: 'demo',
          tweet_id: '1234567891',
          content: `Deep work session complete ✅ 3 hours of pure focus. Sometimes you just need to disconnect and build.`,
          author_name: 'Builder',
          author_username: 'builder',
          author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes: 23,
          retweets: 5,
          replies: 3
        }
      ]
      return NextResponse.json({ posts: fallbackPosts })
    }

    console.log('User authenticated:', user.id)

    // Get user's profile to get their Twitter username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('twitter_username, name, total_earnings, level, current_streak')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      // Generate fallback posts with user ID
      const fallbackPosts = await generateFallbackPosts(supabase, user.id, 'builder')
      return NextResponse.json({ posts: fallbackPosts })
    }

    if (!profile?.twitter_username) {
      console.log('No Twitter username found for user:', user.id)
      // Generate fallback posts even without Twitter username
      const fallbackPosts = await generateFallbackPosts(supabase, user.id, 'builder')
      return NextResponse.json({ posts: fallbackPosts })
    }

    const targetUsername = profile.twitter_username
    
    // Check if we have a Twitter Bearer Token for real API calls
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN
    
    if (!twitterBearerToken) {
      console.log('No Twitter Bearer Token found, using fallback data')
      // Return contextual fallback data based on user's profile
      const fallbackPosts = await generateFallbackPosts(supabase, user.id, targetUsername)
      return NextResponse.json({ posts: fallbackPosts })
    }

    // Make real Twitter API calls
    try {
      console.log('Fetching Twitter data for username:', targetUsername)
      
      // Get Twitter User ID from username
      const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${targetUsername}`, {
        headers: {
          'Authorization': `Bearer ${twitterBearerToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error('Failed to fetch Twitter user:', userResponse.status, errorText)
        // Fall back to contextual mock data
        const fallbackPosts = await generateFallbackPosts(supabase, user.id, targetUsername)
        return NextResponse.json({ posts: fallbackPosts })
      }

      const userData = await userResponse.json()
      
      if (!userData.data) {
        console.error('No user data returned from Twitter API')
        const fallbackPosts = await generateFallbackPosts(supabase, user.id, targetUsername)
        return NextResponse.json({ posts: fallbackPosts })
      }

      const twitterUserId = userData.data.id

      // Get user's tweets
      const tweetsResponse = await fetch(`https://api.twitter.com/2/users/${twitterUserId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=profile_image_url,username,name`, {
        headers: {
          'Authorization': `Bearer ${twitterBearerToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!tweetsResponse.ok) {
        const errorText = await tweetsResponse.text()
        console.error('Failed to fetch tweets:', tweetsResponse.status, errorText)
        // Fall back to contextual mock data
        const fallbackPosts = await generateFallbackPosts(supabase, user.id, targetUsername)
        return NextResponse.json({ posts: fallbackPosts })
      }

      const tweetsData = await tweetsResponse.json()
      
      // Transform Twitter API data to our expected format
      const posts = tweetsData.data?.map((tweet: any) => ({
        id: tweet.id,
        user_id: user.id,
        tweet_id: tweet.id,
        content: tweet.text,
        author_name: userData.data.name,
        author_username: userData.data.username,
        author_avatar: tweetsData.includes?.users?.[0]?.profile_image_url || `https://unavatar.io/twitter/${userData.data.username}`,
        created_at: tweet.created_at,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0
      })) || []

      // Check if user has posted today and automatically log x_post action
      await checkAndLogTodayPost(supabase, user.id, posts)

      console.log(`Successfully fetched ${posts.length} tweets for ${targetUsername}`)
      return NextResponse.json({ posts })

    } catch (error) {
      console.error('Error fetching real Twitter data:', error)
      // Fall back to contextual mock data
      const fallbackPosts = await generateFallbackPosts(supabase, user.id, targetUsername)
      return NextResponse.json({ posts: fallbackPosts })
    }

  } catch (error) {
    console.error('Error in Twitter API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Something went wrong loading your feed',
      posts: [] 
    }, { status: 500 })
  }
}

// Check if user has posted today and log daily action
async function checkAndLogTodayPost(supabase: any, userId: string, posts: any[]) {
  if (!posts || posts.length === 0) return

  const today = new Date().toISOString().split('T')[0]
  
  // Check if user has already logged x_post action for today
  const { data: existingAction } = await supabase
    .from('daily_actions')
    .select('id')
    .eq('user_id', userId)
    .eq('action_type', 'x_post')
    .eq('date', today)
    .single()

  if (existingAction) {
    console.log('X post action already logged for today')
    return
  }

  // Check if any posts are from today
  const todayPosts = posts.filter(post => {
    const postDate = new Date(post.created_at).toISOString().split('T')[0]
    return postDate === today
  })

  if (todayPosts.length > 0) {
    console.log(`Found ${todayPosts.length} posts from today, logging x_post action`)
    
    // Log the daily action for x_post
    const { error } = await supabase
      .from('daily_actions')
      .insert([{
        user_id: userId,
        date: today,
        action_type: 'x_post',
        completed: true,
        coins_earned: 5,
        description: `Posted ${todayPosts.length} tweet(s) today`,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error logging x_post action:', error)
    } else {
      // Update profile total coins
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_coins')
        .eq('id', userId)
        .single()

      if (currentProfile) {
        await supabase
          .from('profiles')
          .update({
            total_coins: (currentProfile.total_coins || 0) + 5,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
      }

      console.log('Successfully logged x_post action and awarded 5 coins')
    }
  }
}

// Generate contextual fallback posts based on user's profile
async function generateFallbackPosts(supabase: any, userId: string, twitterUsername: string) {
  // Get user's profile for contextual data
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, total_earnings, level, current_streak')
    .eq('id', userId)
    .single()

  const userName = profile?.name || twitterUsername
  const userAvatar = `https://unavatar.io/twitter/${twitterUsername}`

  // Generate contextual posts based on user's progress
  const posts = [
    {
      id: '1',
      user_id: userId,
      tweet_id: '1234567890',
      content: `Just shipped a new feature for my SaaS! 🚀 The grind never stops. Building in public day ${profile?.current_streak || 1} #buildinpublic #100kchallenge`,
      author_name: userName,
      author_username: twitterUsername,
      author_avatar: userAvatar,
      created_at: new Date().toISOString(),
      likes: 47,
      retweets: 12,
      replies: 8
    },
    {
      id: '2',
      user_id: userId,
      tweet_id: '1234567891',
      content: `Deep work session complete ✅ 3 hours of pure focus on the new dashboard. Sometimes you just need to disconnect and build.`,
      author_name: userName,
      author_username: twitterUsername,
      author_avatar: userAvatar,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      likes: 23,
      retweets: 5,
      replies: 3
    }
  ]

  // Add revenue-specific posts if user has earnings
  if (profile?.total_earnings && profile.total_earnings > 0) {
    posts.push({
      id: '3',
      user_id: userId,
      tweet_id: '1234567892',
      content: `Monthly revenue update: $${Math.floor(profile.total_earnings / 100) * 100}+ MRR! 🎉 ${Math.floor((profile.total_earnings / 100000) * 100)}% to my $100k goal. The journey continues! #buildinpublic`,
      author_name: userName,
      author_username: twitterUsername,
      author_avatar: userAvatar,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      likes: 156,
      retweets: 34,
      replies: 21
    })
  }

  return posts
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