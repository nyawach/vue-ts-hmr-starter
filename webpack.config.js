const webpack = require('webpack')
const path    = require('path')

const config = require('./config')

const production = process.env.NODE_ENV === 'production'

const basePlugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]

const plugins = production
  ? [
      ...basePlugins,
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({ minimize: true })
    ]
  : [
      ...basePlugins,
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]

const devtool = production
  ? "cheap-module-eval-source-map"
  : false

module.exports = {
  entry: {
    script: [`./src/ts/script.ts`],
  },
  output: {
    path: path.resolve(__dirname, `./${config.dev.dist}/js`),
    publicPath: '/js/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['vue-style-loader', 'css-loader']
      }, {
        test: /\.scss$/,
        loader: ['vue-style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.sass$/,
        loader: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      }, {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          esModule: true,
          postcss: require('./postcss.config'),
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
          },
        },
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.js', '.vue', '.json'],
    alias: {
      vue: production
        ? 'vue/dist/vue.esm.js'
        : 'vue/dist/vue.js',
    },
  },
  performance: {
    hints: false,
  },
  devServer: {
    contentBase: config.dev.dist,
    port: config.dev.port,
  },
  devtool: devtool,
  plugins: plugins,
}
