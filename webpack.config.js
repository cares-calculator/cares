const path = require('path')
const webpack = require('webpack')

const base = {
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}

module.exports = [
  {
    ...base,
    output: {
      path: path.join(__dirname, 'calculator'),
      filename: 'calculator.bundle.js',
    },
    entry: ['babel-polyfill', path.join(__dirname, 'src/calculator/main.js')],
  }
]
