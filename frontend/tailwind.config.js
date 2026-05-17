/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f4',
          100: '#f9e1e7',
          200: '#f4c4d2',
          300: '#ec9aac',
          400: '#e16581',
          500: '#cf3c5a',
          600: '#4A0E1C', // deep maroon matching user's color
          700: '#340711', // darker maroon for hover
          800: '#26040C',
          900: '#1A0207',
          950: '#0D0103',
        },
        gold: {
          50: '#fffcf2',
          100: '#fff8e1',
          200: '#ffecaf',
          300: '#ffdf7d',
          400: '#ffce4b',
          500: '#d4af37', // primary gold
          600: '#b8860b',
          700: '#996515',
          800: '#7a5230',
          900: '#5c3d25',
          950: '#3d2919',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
