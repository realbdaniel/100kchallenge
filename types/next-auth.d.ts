import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string
      total_earnings?: number
      level?: number
      xp?: number
      current_streak?: number
      twitter_username?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    username?: string
    total_earnings?: number
    level?: number
    xp?: number
    current_streak?: number
    twitter_username?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string
  }
} 