'use strict';

const Path = require('path');

const dest = Path.join(__dirname, '../dist');

module.exports = {
  entry: [
    "@babel/polyfill",
    Path.resolve(__dirname, '../src/index.js')
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  "browsers": ["last 2 versions", "ie >= 10"],
                },
                useBuiltIns: "entry" // built ins are polyfilled via babel-polyfill
              }],
              "@babel/preset-react",
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { 
                "loose": false 
              }],
            ]
          },
          
        }
      }
    ],
  }
};

