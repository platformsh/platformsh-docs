const themeDir = '../../themes';

module.exports = {
  plugins: [
    require('tailwindcss')(themeDir + '/psh-docs/tailwind.config.js'),
    require('autoprefixer')({
      path: [themeDir]
    }),
  ]
}