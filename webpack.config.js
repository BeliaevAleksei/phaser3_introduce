const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/main.js",
    output: {
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    mode: isProd ? "production" : "development",
    cache: {
      type: "filesystem",
    },
    devtool: isProd ? "hidden-source-map" : "inline-source-map",
    devServer: !isProd && {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 8000,
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|svg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: "[path][name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          use: "raw-loader",
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 10000,
        maxSize: 500000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
      minimize: isProd,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "index.html",
        minify: isProd
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "assets", to: "assets" }],
      }),
      new Dotenv(),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
        }),
    ].filter(Boolean),
  };
};
