const Path = require('path')
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'eval-source-map',
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  
}