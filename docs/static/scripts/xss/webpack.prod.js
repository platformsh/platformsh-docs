const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require("platformsh-config").config();

module.exports = merge(common, {

});