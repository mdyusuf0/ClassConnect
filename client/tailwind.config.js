/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#001845',
          container: '#002B70',
          light: '#244488',
          fixed: '#DAE2FF',
        },
        secondary: {
          DEFAULT: '#A93100',
          container: '#D44000',
          hover: '#EE4A03',
          fixed: '#FFDBD0',
        },
        success: {
          DEFAULT: '#76A72C',
          green: '#76A72C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F9FA',
          container: '#F0EDED',
          dim: '#DCD9D9',
        },
        'on-surface': {
          DEFAULT: '#1B1B1B',
          variant: '#444651',
        },
        border: {
          muted: '#DEDEDE',
        },
        action: {
          blue: '#5C88D5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Hanken Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(0, 43, 112, 0.2)',
        'glow-secondary': '0 0 25px rgba(238, 74, 3, 0.25)',
        'card-hover': '0 12px 35px rgba(0, 43, 112, 0.15)',
        'card-glow': '0 4px 18px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
