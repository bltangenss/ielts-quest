/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D1117',
        surface: '#161B22',
        primary: '#7C3AED',
        gold: '#F59E0B',
        success: '#3FB950',
        danger: '#F85149',
        text: '#E6EDF3',
        muted: '#8B949E',
        rare: '#3B82F6',
        epic: '#7C3AED',
        legendary: '#F59E0B',
        common: '#6B7280',
        uncommon: '#3FB950',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'chest-bounce': 'chestBounce 1s ease-in-out infinite',
        'particle-burst': 'particleBurst 1s ease-out forwards',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        chestBounce: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.05)' },
        },
      }
    },
  },
  plugins: [],
}
