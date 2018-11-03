const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SW_PRECACHE_CONFIG = {
  runtimeCaching: [{
    urlPattern: /^https:\/\/publicdata-weather\.firebaseio\.com/,
    handler: 'cacheFirst'
  }]
};

module.exports = {
  entry: './src/app.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|gif|svg|jpg)$/,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.ico$/,
        use: [
          'file-loader?name=[name].[ext]'
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: 'src/favicon.ico'
    }),
    new CleanWebpackPlugin(['dist']),
    new SWPrecacheWebpackPlugin(SW_PRECACHE_CONFIG),
    new CopyWebpackPlugin([{
      from: 'src/images/icons',
    }, {
      from: 'manifest.json',
    }])
  ]
}
