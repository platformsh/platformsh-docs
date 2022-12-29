/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/**/layouts/**/*.html",
    "./themes/**/content/**/*.{html,md}",
    "./static/scripts/xss/**/*.js"
  ],
  safelist: ['-rotate-90'],
  theme: {
    extend: {
      backgroundPosition: {
        "left-4": "1rem center",
        "right-2": "right 0.5rem center"
      },
      colors: {
        "grey": "#F0F2F5",
        "pink": "#FFBDBB",
        "pink-light": "#FFD9D9",
        "primary-darker": "#171719",
        "skye": "#4786FF",
        "skye-light": "#E7F0FF",
        "skye-dark": "#1664FF",
        "slate": "#5F5E70",
        "stone": "#E7E7E7",
      },
      gridTemplateColumns: {
        "80-20": "minmax(20rem,80%) minmax(10rem,20%)",
      },
      spacing: {
        "fullv": "100vh",
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}