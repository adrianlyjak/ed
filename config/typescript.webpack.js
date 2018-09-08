const path = require('path')
module.exports = {
  entry: [
    path.join(__dirname, '../src/index.tsx')
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx', 'json']
  }
};
