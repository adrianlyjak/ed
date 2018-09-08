const Path = require('path')
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  
}