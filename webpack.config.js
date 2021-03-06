const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

const APP_PATH = path.resolve(__dirname, "src");

const isProduction = process.env.NODE_ENV === "production";

const devConfig = {
  srcmap: true,
  asyncTypeChecking: true,
};

const prodConfig = {
  autoprefixer: true,
  minimize: true,
  extractCss: true,
  useHashInFilename: true,
};

const config = isProduction ? prodConfig : devConfig;

const styleLoaders = {
  test: /\.s?css$/,
  loader: [
    "style-loader",
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    "css-loader",
    "sass-loader",
    {
      loader: require.resolve("postcss-loader"),
      options: {
        plugins: () => [
          require("postcss-preset-env")({
            autoprefixer: config.autoprefixer
              ? {
                  flexbox: "no-2009",
                }
              : false,
            stage: 3,
          }),
          require("postcss-normalize")(),
        ],
      },
    },
  ].filter(Boolean),
};

module.exports = {
  entry: APP_PATH,
  mode: isProduction ? "production" : "development",
  bail: isProduction,
  devtool: config.srcmap ? "source-map" : false,
  stats: "minimal",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: config.useHashInFilename ? "[name].[hash].js" : "bundle.js",
    chunkFilename: config.useHashInFilename
      ? "[name].[hash].chunk.js"
      : "[name].chunk.js",
    publicPath: "/",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  optimization: {
    minimize: config.minimize,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ["babel-loader", "source-map-loader"],
        exclude: /node_modules/,
      },
      styleLoaders,
      {
        test: /\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
        loader: "file-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(APP_PATH, "index.html"),
      ...(config.minimize
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : {}),
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
      }),
    new ForkTsCheckerWebpackPlugin({
      async: config.asyncTypeChecking,
      useTypescriptIncrementalApi: true,
    }),
  ].filter(Boolean),
};
