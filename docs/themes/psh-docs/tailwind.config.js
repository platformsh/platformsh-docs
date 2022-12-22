/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/**/layouts/**/*.html",
    "./themes/**/content/**/*.{html,md}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '80-20': "minmax(20rem,80%) minmax(10rem,20%)",
      },
      spacing: {
        'fullv': '100vh',
        'nav-height': '84px'
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}