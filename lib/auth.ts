import { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_KEY!,
  }),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        // Add user ID to session
        session.user.id = user.id
        
        // Fetch additional user data from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          session.user.username = profile.username
          session.user.total_earnings = profile.total_earnings
          session.user.level = profile.level
          session.user.xp = profile.xp
          session.user.current_streak = profile.current_streak
          session.user.twitter_username = profile.twitter_username
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'twitter' && profile) {
        // Store Twitter user data in our profiles table
        const twitterProfile = profile as any
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar_url: user.image,
            twitter_username: twitterProfile?.data?.username || twitterProfile?.username,
            twitter_id: twitterProfile?.data?.id || twitterProfile?.id,
            username: twitterProfile?.data?.username || twitterProfile?.username || user.name?.toLowerCase().replace(/\s+/g, '') || '',
            bio: twitterProfile?.data?.description || twitterProfile?.description || '',
            total_earnings: 0,
            level: 1,
            xp: 0,
            current_streak: 0,
            longest_streak: 0,
            updated_at: new Date().toISOString(),
          })

        if (error) {
          console.error('Error creating profile:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
} 