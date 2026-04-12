/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          bg: '#F5F5F7',
          surface: '#FFFFFF',
          text: '#1D1D1F',
          secondary: '#6E6E73',
          blue: '#0071E3',
          red: '#FF3B30',
          green: '#34C759',
          border: 'rgba(0,0,0,0.06)',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        input: '0 0 0 3px rgba(0,113,227,0.25)',
      },
    },
  },
  plugins: [],
}

