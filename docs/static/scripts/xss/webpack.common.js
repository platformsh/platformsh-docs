const path = require('path')

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'),
  entry: ['babel-polyfill', 'index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
        {test: /\.css$/i,  use: ['style-loader', 'css-loader']},
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
      }
    ]
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      path: "path-browserify",
      stream: "stream-browserify"
    }
  }
}
