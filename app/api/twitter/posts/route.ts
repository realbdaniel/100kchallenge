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

    // Simple session-based authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        posts: [] 
      }, { status: 401 })
    }

    const user = session.user
    console.log('User authenticated:', user.id)

    // Get user's profile to get their Twitter username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('twitter_username, name, total_earnings, level, current_streak')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ 
        error: 'Profile not found',
        posts: [] 
      }, { status: 404 })
    }

    if (!profile?.twitter_username) {
      console.log('No Twitter username found for user:', user.id)
      return NextResponse.json({ 
        error: 'Twitter username not configured',
        posts: [] 
      }, { status: 400 })
    }

    const targetUsername = profile.twitter_username
    
    // Check if we have a Twitter Bearer Token for real API calls
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN
    
    if (!twitterBearerToken) {
      console.log('No Twitter Bearer Token configured')
      return NextResponse.json({ 
        error: 'Twitter API not configured',
        posts: [] 
      }, { status: 500 })
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
        return NextResponse.json({ 
          error: 'Failed to fetch Twitter user',
          posts: [] 
        }, { status: 500 })
      }

      const userData = await userResponse.json()
      
      if (!userData.data) {
        console.error('No user data returned from Twitter API')
        return NextResponse.json({ 
          error: 'Twitter user not found',
          posts: [] 
        }, { status: 404 })
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
        return NextResponse.json({ 
          error: 'Failed to fetch tweets',
          posts: [] 
        }, { status: 500 })
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
      return NextResponse.json({ 
        error: 'Failed to fetch Twitter data',
        posts: [] 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in Twitter API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      posts: [] 
    }, { status: 500 })
  }
}

// Check if user has posted today and log daily action
async function checkAndLogTodayPost(supabase: any, userId: string, posts: any[]) {
  if (!posts || posts.length === 0) return

  // Get user profile for timezone
  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', userId)
    .single()

  const userTimezone = profile?.timezone || 'UTC'
  console.log('User timezone from profile:', userTimezone)
  
  // Get today's date in user's timezone
  const getUserToday = (tz: string) => {
    const now = new Date()
    const userDate = new Date(now.toLocaleString("en-US", { timeZone: tz }))
    return userDate.toISOString().split('T')[0]
  }

  const today = getUserToday(userTimezone)
  console.log('Today in user timezone:', today)
  
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

  // Check if any posts are from today (comparing in user's timezone)
  console.log('Checking posts for today...')
  const todayPosts = posts.filter(post => {
    const postDate = new Date(post.created_at)
    console.log('Post created_at:', post.created_at)
    console.log('Post date object:', postDate)
    
    // Convert to user's timezone for comparison
    const postDateInUserTZ = new Date(postDate.toLocaleString("en-US", { timeZone: userTimezone }))
    const postDateString = postDateInUserTZ.toISOString().split('T')[0]
    
    console.log('Post date in user TZ:', postDateInUserTZ)
    console.log('Post date string:', postDateString)
    console.log('Today string:', today)
    console.log('Dates match:', postDateString === today)
    
    return postDateString === today
  })

  console.log(`Found ${todayPosts.length} posts from today`)

  if (todayPosts.length > 0) {
    console.log(`Logging x_post action for ${todayPosts.length} tweet(s)`)
    
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
  } else {
    console.log('No posts found for today - no action logged')
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