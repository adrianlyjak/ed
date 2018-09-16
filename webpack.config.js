const javascript = require('./config/javascript.webpack')
const browserfs = require('./config/browserfs.webpack')
const typescript = require('./config/typescript.webpack')
const defaults = require('./config/defaults.webpack')
const merge = require('webpack-merge')
const css = require('./config/css.webpack')
const html = require('./config/html.webpack')
// module.exports = merge(
//   defaults,
//   javascript, 
//   browserfs, 
//   typescript)



module.exports = merge(defaults, typescript, browserfs, javascript, css, html)