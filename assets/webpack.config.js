const path = require("path");
const glob = require("glob");
const globAll = require("glob-all");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[\w-/:]+(?<!:)/g) || [];
  }
}

module.exports = (env, options) => ({
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({}),
      new PurgecssPlugin({
        paths: globAll.sync([
          "../lib/parenthese_web/templates/**/*.html.eex",
          "js/**/*.js"
        ]),
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ["html", "js", "eex"]
          }
        ]
      })
    ]
  },
  entry: {
    app: glob.sync("./vendor/**/*.js").concat(["./js/app.js"]),
    admin: "./js/admin.js",
    adminProject: "./js/admin/project.js",
    map: "./js/map.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../priv/static/js")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "../css/[name].css" }),
    new CopyWebpackPlugin([{ from: "static/", to: "../" }])
  ]
});
