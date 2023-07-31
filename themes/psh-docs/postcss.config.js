const themeDir = __dirname + '/../../';

module.exports = {
  plugins: [
    require('tailwindcss')(themeDir + 'themes/psh-docs/tailwind.config.js'),
    require('autoprefixer')({
      path: [themeDir]
    }),
  ]
}