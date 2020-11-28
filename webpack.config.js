const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'productionAnalyze';
const isProductionAnalyze = process.env.NODE_ENV === 'productionAnalyze';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const package = require('./package.json');

module.exports = {
  context: sourcePath,
  entry: {
    app: './main.tsx',
  },
  output: {
    path: outPath,
    publicPath: '',
    filename: isProduction ? '[contenthash].app.js' : '[name].[fullhash].app.js',
    chunkFilename: '[id].[chunkhash].chunk.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      icons: path.resolve(__dirname, 'src/app/assets/icons/'),
      store: path.resolve(__dirname, 'src/app/store/'),
      sounds: path.resolve(__dirname, 'src/app/assets/sounds/'),
      utils: path.resolve(__dirname, 'src/app/utils/'),
      components: path.resolve(__dirname, 'src/app/components/index'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: {
              plugins: [
                'react-hot-loader/babel',
                [
                  'transform-imports',
                  {
                    'react-bootstrap': {
                      transform: 'react-bootstrap/lib/${member}',
                      preventFullImport: true,
                    },
                    lodash: {
                      transform: 'lodash/${member}',
                      preventFullImport: true,
                    },
                  },
                ],
                ['import', { libraryName: '@material-ui/core', camel2DashComponentName: false }],
              ],
            },
          },
          'ts-loader',
        ].filter(Boolean),
      },
      // css
      {
        test: /\.s(c|a)ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-preset-env')({
                    /* use stage 2 features (defaults) */
                    stage: 2,
                  }),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction,
                  }),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { ref: true, memo: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-preset-env')({
                    /* use stage 2 features (defaults) */
                    stage: 2,
                  }),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction,
                  }),
                ],
              },
            },
          },
        ],
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|png)$/,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en-gb/),
    new CopyPlugin({
      patterns: [{ from: 'assets/', to: outPath }],
      options: {
        concurrency: 100,
      },
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
    }),
    new CleanWebpackPlugin(),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: '[fullhash].css',
          }),
        ]
      : []),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      },
      append: {
        head: '<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>',
      },
      meta: {
        title: package.name,
        description: package.description,
        keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined,
      },
    }),
    ...(isProductionAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],

  devServer: {
    port: 3000,
    host: 'localhost',
    contentBase: sourcePath,
    open: true,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    stats: 'minimal',
    clientLogLevel: 'warning',
    https: true,
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
};
