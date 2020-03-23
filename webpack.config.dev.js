const webpack = require('webpack');
const path = require('path');
const getPort = require('get-port');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
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
      name: (filePath) => {
        const relativePath = path.relative(`${__dirname}/_ui/skin/src`, filePath);
        const prefixes = ['img/', 'js/'];
        let outputPath = '';
        prefixes.forEach((prefix) => {
          if (relativePath.indexOf(prefix) === 0) {
            outputPath = relativePath.split(prefix).slice(1).join('');
          }
        });

        return `img/${outputPath}`;
      },
      publicPath: '../',
    },
  },
};

const jsRules = {
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
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        sassOptions: {
          outputStyle: 'compact',
        },
      },
    },
  ],
};

const devServer = {
  enabled: false,
  port: 9000,
};
const browserSync = {
  enabled: true,
  port: 9000,
  host: 'localhost:8080',
};


const webpackConfig = {
  entry: {
    main: ['./_ui/skin/src/js/main.js', './_ui/skin/src/js/dev.js'],
    style: './_ui/skin/src/sass/style.scss',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve('./_ui/skin/src/'),
    },
  },
  output: {
    path: path.resolve('_ui/skin/dist'),
    filename: 'js/[name].js',
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
      jsRules,
      sassRules,
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('_ui/skin/src/templates/index.html'),
      minify: true,
      filename: '../../../index.html',
    }),
    new HtmlWebpackTagsPlugin({
      tags: [],
      scripts: externalScripts,
    }),
  ],
  devtool: 'source-map',
  stats: {
    all: false,
    builtAt: true,
  },
};

if (devServer.enabled) {
  webpackConfig.devServer = {
    contentBase: path.resolve('.'),
    host: 'localhost',
    port: devServer.port,
    publicPath: `http://localhost:${devServer.port}/_ui/skin/dist`,
    historyApiFallback: true,
    hot: true,
  };
}

module.exports = (async () => {
  const port = await getPort({
    port: getPort.makeRange(3005, 3100),
  });

  if (browserSync.enabled) {
    webpackConfig.plugins.push(
      new BrowserSyncPlugin({
        port,
        notify: true,
        proxy: browserSync.host,
        files: [
          '_ui/skin/dist/**/*',
          '_ui/skin/src/templates/**/*',
        ],
      }, {
        injectCss: true,
        reload: false,
      }),
    );
  }

  if (devServer.enabled) {
    webpackConfig.devServer = {
      port,
      contentBase: path.resolve('.'),
      host: 'localhost',
      publicPath: `http://localhost:${port}/_ui/skin/dist`,
      historyApiFallback: true,
      hot: true,
    };
  }

  return webpackConfig;
});
