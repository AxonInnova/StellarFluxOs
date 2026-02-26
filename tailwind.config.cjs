/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          dark: '#0a0e27',
          darker: '#050812',
          accent: '#00d4ff',
          secondary: '#a855f7',
          danger: '#ff006e',
          success: '#00ff88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
