const merge = require('webpack-merge')
const browserfsWebpack = require('./config/browserfs.webpack')
const typescriptWebpack = require('./config/typescript.webpack');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  const merged = merge(
    config,
    browserfsWebpack,
    typescriptWebpack
  )
  // merged.entry = "./src/index.tsx"
  // throw "foo"
  return merged
}
