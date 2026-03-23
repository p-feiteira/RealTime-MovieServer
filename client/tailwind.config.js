/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campfire: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b87d',
          400: '#f5934a',
          500: '#f27522',
          600: '#e35a18',
          700: '#bc4516',
          800: '#963819',
          900: '#7a3018',
        }
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #f27522, 0 0 10px #f27522, 0 0 15px #f27522' },
          '100%': { boxShadow: '0 0 10px #f27522, 0 0 20px #f27522, 0 0 30px #f27522' },
        }
      }
    },
  },
  plugins: [],
} 