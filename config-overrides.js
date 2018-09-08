const merge = require('webpack-merge')
const browserfsWebpack = require('./config/browserfs.webpack')
const typescriptWebpack = require('./config/typescript.webpack');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  const merged = merge(
    typescriptWebpack,
    config,
    browserfsWebpack,
  )
  // console.log(JSON.stringify(merged, (_, v) => {
  //   if (typeof v === 'function') {
  //     return v.toString()
  //   } else if ((typeof v === 'object') && (v !== null) && ('multiline' in v)) {
  //     return v.toString()
  //   } else {
  //     return v
  //   }
  // }, 2))
  // throw "foo"
  return merged
}
