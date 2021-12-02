const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg= require ('imagemin-mozjpeg');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins : [
  new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

  new CopyPlugin({
      patterns: [
        { from: "src/images", to: "img" },
      ],
    }),

  new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i,
    pngquant : {
      quality : '50-70'
    },
  plugins: [
        imageminMozjpeg({
          quality: 50,
          progressive: true
        })
      ]

  }),
  new MiniCssExtractPlugin()

  ],

  module : {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',   
      },
    ],
  }

};