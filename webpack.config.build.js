const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const imgRules = {
  test: /\.(png|jpe?g|gif|webp)$/,
  exclude: /node_modules/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]'
    },
  },
};

const tsRules = {
  test: /\.(js)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
  ],
};

const sassRules = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: false,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: false,
      },
    },
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: false,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: false,
        sassOptions: {
          outputStyle: 'compressed',
        },
      },
    },
  ],
};

const webpackConfig = {
  entry: {
    main: './_ui/skin/src/js/main.js',
    style: './_ui/skin/src/sass/style.scss',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve('./_ui/skin/src/'),
    },
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      imgRules,
      tsRules,
      sassRules,
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('_ui/skin/src/templates/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      filename: 'index.html',
    }),
  ],
  devtool: false,
  stats: {
    all: false,
    builtAt: true,
  },
};

module.exports = webpackConfig;