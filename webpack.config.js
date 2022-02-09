const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const mode = () => {
  if (process.env.NODE_ENV === "development") {
    return { mode: "development" };
  }

  if (process.env.NODE_ENV === "production") {
    return { mode: "production" };
  }

  return {};
};

const devtool = () => {
  if (process.env.NODE_ENV === "development") {
    return { devtool: "inline-source-map" };
  }

  if (process.env.NODE_ENV === "production") {
    return { devtool: "source-map" };
  }

  return {};
};

const devServer = () => {
  if (process.env.NODE_ENV === "development") {
    return {
      devServer: {
        static: "./dist",
        open: false,
      },
    };
  }

  return {};
};

module.exports = {
  ...mode(),
  ...devtool(),
  ...devServer(),

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // because it's jacking up my property names and breaking code && mangle.properties = false don't do shit
          // probably related to babel class properties...
          mangle: false,
        },
      }),
    ],
  },

  entry: "./src/index.js",

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: "skrimshank",
      template: "index.html",
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)\/(?!geotic)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-private-methods",
            ],
          },
        },
      },
    ],
  },
};
