const path = require('path');

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const srcDir = path.resolve('src')
const publicDir = path.resolve('src', 'public')

const Title = 'JRPG';

// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", process.env)


module.exports = (env) => {

  const isDev = env == 'development';


  return {

    entry: {
      main: './src/index.js',
      vendor: [
        'babel-polyfill',
        'lodash',
        'react-dom',
        'react',
        'moment',
        'jquery',
        'react-spinners',
        'popper.js',
        'axios'
      ]
    },
    output: {
      filename: isDev ? 'js/[name].js' :'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.json$/,
          loader: "json-loader"
        },
        {
          test: /\.(png|jp(e*)g|svg)/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 200000,
              name: 'images/[hash]-[name].[ext]'
            }
          }]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    devtool: 'source-map',
    plugins: [
      // new FaviconsWebpackPlugin({
      //   logo: path.join(publicDir, 'myico.jpg'),
      //   statsFilename: 'iconstats-[hash].json',
      //   persistentCache: true,
      // }),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: Title,
        favicon: path.join(publicDir, 'favicon.ico'),
        template: path.join(publicDir, 'index.html'),
        inject: 'body',
        chunksSortMode: 'dependency'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        '_': 'lodash',
        'React': 'react',
        'ReactDOM': 'react-dom',
        'moment': 'moment',
        'Loader': 'react-spinners',
        'Popper': 'popper.js',
        'Axios': 'axios'

      }),
      new webpack.DefinePlugin({
        process: {
          env: {
            NODE_ENV: isDev ? JSON.stringify("development") : JSON.stringify("production")
          }
        }

      }),
      new CopyWebpackPlugin([
        {from: 'src/game/maps/*', to: 'maps/', flatten: true}
        // { from: 'src/public/index.html'}
      ])
    ].concat(
      !isDev
        ? // production only plugins
        [
          new UglifyJSPlugin({
            sourceMap: true,
            parallel: true,
            parallel: 4
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              drop_console: true,
              warnings: false,
            }
          }),
          new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: Infinity
          })
        ]
        :// dev only plugins
        [

        ]
    ),
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      historyApiFallback: true,
      port: 2000,
      proxy: {
        //Usage example - "/api": "http://localhost:3000"
      }
    }

  }
};