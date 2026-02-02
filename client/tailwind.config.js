export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFBF5', 100: '#FFF6E6' },
        pastel: {
          pink: '#FFD6D6',
          orange: '#FFBCBC',
          yellow: '#FFE7A0',
          green: '#B8E6C1',
          purple: '#D4C1EC',
          blue: '#B2D2FF',
        },
        text: {
          primary: '#2D3748', // Soft black
          secondary: '#718096', // Muted gray
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}