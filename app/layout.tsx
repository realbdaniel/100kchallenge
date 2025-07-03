import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '100K Challenge - Break Free from 9-5',
  description: 'Track your journey to your first $100k online. Deep work streaks, project showcases, and gamified progress tracking.',
  keywords: ['entrepreneurship', '100k challenge', 'side hustle', 'deep work', 'streak tracking'],
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
            {/* Mario-style background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-8 h-8 bg-mario-yellow rounded-full opacity-20 animate-bounce-slow"></div>
              <div className="absolute top-20 right-20 w-6 h-6 bg-mario-green rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute bottom-20 left-20 w-10 h-10 bg-mario-orange rounded-full opacity-20 float-animation"></div>
              <div className="absolute bottom-10 right-10 w-7 h-7 bg-mario-red rounded-full opacity-20 animate-bounce"></div>
            </div>
            
            {children}
            
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  border: '2px solid #FFD700',
                  borderRadius: '8px',
                  fontFamily: 'Courier New, monospace'
                },
                success: {
                  iconTheme: {
                    primary: '#00AA00',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#DC143C',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </main>
        </Providers>
      </body>
    </html>
  )
} 