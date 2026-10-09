/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beverage: {
          orange: '#FF6B00',
          mango: '#FFA800',
          lemon: '#E5D000',
          lime: '#22C55E',
          dew: '#00D26A',
          cola: '#1E1B18',
          colaLight: '#2D2926',
          guava: '#EC4899',
          grape: '#8B5CF6',
          slate: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
