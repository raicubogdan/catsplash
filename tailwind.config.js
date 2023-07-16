/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        varela: ['Varela Round', 'sans-serif'],
      },
      colors: {
        first: '#323345',
        second: '#f3de8a',
        third: '#eb9486',
        fourth: '#7e7f9a',
        fifth: '#f9f8f8',
      },
    },
  },
  plugins: [],
}
