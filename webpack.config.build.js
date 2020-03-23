const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const packageJson = require('./package.json');

// Settings.
const digadSettings = packageJson.digad;

const gsapExternals = {
  core: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/gsap_3.0.1_min.js',
    packageName: 'gsap',
    variableName: 'gsap',
  },
  cssrule: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/cssruleplugin_3.0.1_min.js',
    packageName: 'CSSRulePlugin',
    variableName: 'CSSRulePlugin',
  },
  draggable: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/draggable_3.0.1_min.js',
    packageName: 'Draggable',
    variableName: 'Draggable',
  },
  easel: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/easelplugin_3.0.1_min.js',
    packageName: 'EaselPlugin',
    variableName: 'EaselPlugin',
  },
  easepack: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/easepack_3.0.1_min.js',
    packageName: 'EasePack',
    variableName: 'EasePack',
  },
  motionpath: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/motionpathplugin_3.0.1_min.js',
    packageName: 'MotionPathPlugin',
    variableName: 'MotionPathPlugin',
  },
  pixi: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/pixiplugin_3.0.1_min.js',
    packageName: 'PixiPlugin',
    variableName: 'PixiPlugin',
  },
  scrollto: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/scrolltoplugin_3.0.1_min.js',
    packageName: 'ScrollToPlugin',
    variableName: 'ScrollToPlugin',
  },
  text: {
    path: 'https://s0.2mdn.net/ads/studio/cached_libs/textplugin_3.0.1_min.js',
    packageName: 'TextPlugin',
    variableName: 'TextPlugin',
  },
};

// External Scripts (e.g., GSAP).
const externalScripts = [];
if (digadSettings.gsapExternals !== false) {
  if (typeof digadSettings.gsapExternals === 'object') {
    Object.entries(digadSettings.gsapExternals).forEach(([key, externalEnabled]) => {
      if (Object.prototype.hasOwnProperty.call(gsapExternals, key) && externalEnabled) {
        externalScripts.push({
          path: gsapExternals[key].path,
          usePublicPath: false,
          external: {
            packageName: gsapExternals[key].packageName,
            variableName: gsapExternals[key].variableName,
          },
        });
      }
    });
  }
}

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
  // externals: {
  //   gsap: 'gsap',
  // },
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
        useShortDoctype: true,
      },
      filename: 'index.html',
    }),
    new HtmlWebpackTagsPlugin({
      tags: [],
      scripts: externalScripts,
    }),
  ],
  devtool: false,
  stats: {
    all: false,
    builtAt: true,
  },
};

module.exports = webpackConfig;