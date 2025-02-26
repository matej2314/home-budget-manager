/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#303641',
      },
      screens: {
        ...defaultTheme.screens,
        indirect: '450px',
      }
    },
  },
  plugins: [],
}

