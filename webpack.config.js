const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack')
const Webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const optimization = () => {
  const configObj = {splitChunks: {chunks: 'all'}}
  if (isProd) {
    configObj.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return configObj
}

const plugins = () => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/barrier.html'),
      filename: 'services/barrier.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/fan.html'),
      filename: 'services/fan.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/fire.html'),
      filename: 'services/fire.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/home.html'),
      filename: 'services/home.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/phone.html'),
      filename: 'services/phone.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/tv.html'),
      filename: 'services/tv.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/services/videowatch.html'),
      filename: 'services/videowatch.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/source/photo.html'),
      filename: 'source/photo.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/source/info.html'),
      filename: 'source/info.html',
      minify: {collapseWhitespace: isProd}
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/source/videoonline.html'),
      filename: 'source/videoonline.html',
      minify: {collapseWhitespace: isProd}
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'src/assets') , to: path.resolve(__dirname, 'dist')}
      ]
    }),
    new Webpack.HotModuleReplacementPlugin(),
  ]

  if (isProd) {
    basePlugins.push(
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            ["svgo", {plugins: [{removeViewBox: false}]}]
          ]
        }
      })
    )
  }

  return basePlugins
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3005,
  },
  optimization: optimization(),
  plugins: plugins(),
  devtool: isProd ? false : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      }, {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
           options: {
                hmr: true,
                reloadAll: true
           }
          }, {
              loader: 'css-loader'
          }, {
              loader: 'postcss-loader',
          }
        ]
      }, {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            }
          }, {
              loader: 'css-loader',
          }, {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                    plugins: function () {
                        return [require('autoprefixer')]
                    }
                }
              }
          }, {
            loader: 'sass-loader'
          }
        ],
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }, {
        test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./imgs/${filename('[ext]')}`
          }
        }],
      }, {
        test: /\.(?:|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./fonts/${filename('[ext]')}`
          }
        }],
      }
    ]
  }
}
