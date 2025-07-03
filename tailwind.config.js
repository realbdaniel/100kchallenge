/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mario-inspired color palette
        mario: {
          red: '#DC143C',
          blue: '#4169E1',
          yellow: '#FFD700',
          green: '#00AA00',
          orange: '#FF8C00',
          brown: '#8B4513',
          purple: '#8A2BE2',
        },
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#9a3412',
        },
        success: '#00AA00',
        warning: '#FFD700',
        danger: '#DC143C',
      },
      fontFamily: {
        'mario': ['Courier New', 'monospace'],
        'pixel': ['Courier New', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'coin-flip': 'coinFlip 0.6s ease-in-out',
        'power-up': 'powerUp 0.8s ease-in-out',
      },
      keyframes: {
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        powerUp: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 