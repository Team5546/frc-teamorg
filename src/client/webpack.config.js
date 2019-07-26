const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: {
    index: './index.js'
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name]-[hash].bundle.js',
    chunkFilename: '[name]-[hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3
                }
              ],
              '@babel/preset-react'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin([{ from: './static' }])
  ],
  devServer: {
    contentBase: './',
    port: 3000,
    open: true,
    hot: true,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://api:8080'
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000
    }
  },
  mode: process.env.ENV === 'development' ? 'development' : 'production',
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
