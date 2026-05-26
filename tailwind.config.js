/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        card: '#FFFFFF',
        accent: {
          DEFAULT: '#E07A5F', // Warm terracotta
          light: '#F4A261', // Soft orange
          dark: '#D0604A'
        },
        surface: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F3EFE6',
          300: '#E8E2D5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'float': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
