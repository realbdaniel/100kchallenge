# The 100k Challenge - Setup Guide

## Overview
This application now uses Supabase as the backend database and X (Twitter) for authentication. This guide will help you set up the complete environment.

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your Project URL and anon key from the API settings
3. Create the following tables in your Supabase database:

### Database Schema (SQL)
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    twitter_username TEXT,
    twitter_id TEXT,
    total_earnings INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Deep work sessions table
CREATE TABLE public.deep_work_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    duration INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    revenue INTEGER DEFAULT 0,
    status TEXT DEFAULT 'development',
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Twitter posts table
CREATE TABLE public.twitter_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tweet_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_username TEXT NOT NULL,
    author_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0
);

-- Daily actions table
CREATE TABLE public.daily_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    action_type TEXT NOT NULL, -- 'deep_work', 'x_post', 'push', 'manual_earning'
    completed BOOLEAN DEFAULT FALSE,
    coins_earned INTEGER DEFAULT 0,
    description TEXT,
    duration INTEGER, -- for deep work sessions in minutes
    amount INTEGER, -- for manual earnings in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date, action_type)
);

-- Manual earnings table
CREATE TABLE public.manual_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deep_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twitter_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_earnings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Similar policies for other tables
CREATE POLICY "Users can view their own sessions" ON public.deep_work_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.deep_work_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.deep_work_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.deep_work_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Public projects are viewable by everyone
CREATE POLICY "Public projects are viewable by everyone" ON public.projects
    FOR SELECT USING (true);

-- Daily actions policies
CREATE POLICY "Users can view their own daily actions" ON public.daily_actions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily actions" ON public.daily_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily actions" ON public.daily_actions
    FOR UPDATE USING (auth.uid() = user_id);

-- Manual earnings policies
CREATE POLICY "Users can view their own earnings" ON public.manual_earnings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earnings" ON public.manual_earnings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own earnings" ON public.manual_earnings
    FOR UPDATE USING (auth.uid() = user_id);
```

## 2. X (Twitter) API Setup

### Create a Twitter Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Apply for a developer account
3. Create a new app in the Twitter Developer Portal
4. Get your API keys:
   - Client ID
   - Client Secret
   - Bearer Token

### Configure OAuth Settings
In your Twitter app settings:
- **App Type**: Web App
- **Callback URL**: `http://localhost:3000/api/auth/callback/twitter`
- **Website URL**: `http://localhost:3000`
- **Scopes**: `users.read`, `tweet.read`, `offline.access`

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Twitter API Configuration
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
```

## 4. Features Implemented

### X Feed Integration
- **Dashboard**: Replaced "Fellow Builders" section with user's X feed
- **Profile Pages**: Added X feed display in user profiles
- **Authentication**: Uses X OAuth for user login and account creation
- **Data Sync**: Automatically syncs user profile data from X

### Gamification System
- **9 Level System**: Revenue-based progression from Goomba Squasher to World Champion
- **Coin System**: Daily tasks worth up to 35 coins with milestone rewards
- **Achievement System**: 6 achievements with rarity levels (Common to Legendary)
- **Daily Actions**: Deep work logging, X post tracking, manual earnings entry

### Supabase Backend
- **Database**: Complete schema for users, projects, deep work sessions, and X posts
- **Authentication**: Integrated with NextAuth for seamless user management
- **Row Level Security**: Proper security policies for data access
- **Real-time**: Ready for real-time updates when needed

### User Experience
- **Mario Theme**: Maintained throughout the X feed components
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Beautiful loading animations
- **Error Handling**: Graceful error states

## 5. Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 6. Next Steps

### To Enable Live X Feed:
1. Implement Twitter API v2 integration in `/api/twitter/` endpoints
2. Create a background job to sync tweets periodically
3. Add real-time updates using Supabase subscriptions

### To Enable Stripe Integration:
1. Add Stripe API keys to environment variables
2. Create `/api/stripe/` endpoints for earnings tracking
3. Implement webhook handling for automatic earnings updates

### To Add More Features:
- Direct messaging between builders
- Project collaboration features
- Achievement system with badges
- Leaderboards and community features

## 7. Security Considerations

- All sensitive data is stored in Supabase with RLS enabled
- X API tokens are securely handled server-side
- Environment variables are properly configured
- User authentication is handled by NextAuth with secure sessions

## 8. Troubleshooting

### Common Issues:
1. **Supabase Connection**: Ensure URLs and keys are correct
2. **X Authentication**: Check callback URLs and app permissions
3. **TypeScript Errors**: Run `npm run type-check` to identify issues
4. **Build Errors**: Clear `.next` folder and rebuild

### Getting Help:
- Check the console for detailed error messages
- Verify all environment variables are set
- Test API endpoints individually
- Review Supabase logs for database issues

## 9. Netlify Deployment

### Build Settings
In your Netlify dashboard:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 or higher

### Environment Variables
Set these in Netlify's Environment Variables section (Site settings > Environment variables):

```env
# NextAuth Configuration
NEXTAUTH_URL=https://100kchallenge.dev
NEXTAUTH_SECRET=your-production-secret-here

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Twitter API Configuration
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
```

### Twitter App Configuration Updates
In your Twitter Developer Portal, update:
- **Callback URL**: `https://100kchallenge.dev/api/auth/callback/twitter`
- **Website URL**: `https://100kchallenge.dev`

### Netlify-Specific Configuration
Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Deploy Steps
1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Update Twitter app callback URLs
4. Deploy!

### Custom Domain Setup
If using a custom domain on Netlify:
1. Add your domain in Netlify DNS settings
2. Update `NEXTAUTH_URL` to your custom domain
3. Update Twitter callback URLs to match

## 10. General Deployment Notes

When deploying to any platform:
1. Ensure all environment variables are set correctly
2. Update Twitter callback URLs to match your domain
3. Test authentication flow in production
4. Verify Supabase connection works
5. Check that all API routes are accessible 