if (process.env.BOOK) {
  console.log('building : ./book_' + process.env.BOOK + '.json');
  module.exports = require('./book_' + process.env.BOOK + '.json')
}