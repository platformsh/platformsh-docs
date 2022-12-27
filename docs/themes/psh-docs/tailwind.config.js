/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/**/layouts/**/*.html",
    "./themes/**/content/**/*.{html,md}",
    "./static/scripts/xss/**/*.js"
  ],
  theme: {
    extend: {
      backgroundPosition: {
        "center-4": "1rem center"
      },
      colors: {
        "primary-darker": "#171719",
        "skye": "#4786FF",
        "skye-light": "#E7F0FF",
        "skye-dark": "#1664FF",
        "slate": "#5F5E70"
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