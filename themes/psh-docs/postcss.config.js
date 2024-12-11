const themeDir = '../../themes';

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')(themeDir + '/psh-docs/tailwind.config.js'),
    require('autoprefixer')({
      path: [themeDir]
    }),
    ...process.env.HUGO_ENVIRONMENT === 'production'
      ? [
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true }, // Ensure all comments are removed
            normalizeWhitespace: true, // Ensures that whitespace is minimized
          }]
        })
      ]
      : []
  ]
}
