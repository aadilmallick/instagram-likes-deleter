const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

console.log("environemnt", process.env.NODE_ENV);

/**
 * Content script entry points must not be optimzied by webpack
 * or else they can't use npm.
 *
 * They should also not be rendered as html
 */
class ContentScriptEntryPoint {
  constructor(name, filepath) {
    this.filepath = filepath;
    this.name;
  }

  shouldOptimize(chunkName) {
    if (chunkName === this.name) {
      return false;
    }
    return true;
  }
}

const contentScriptEntryPointFactory = {
  // add entry points here

  /** @type {ContentScriptEntryPoint[]} */
  entryPoints: [],
  optimize: function (chunkName) {
    if (this.entryPoints.length === 0) {
      return true;
    }
    return this.entryPoints.every((entryPoint) => {
      return entryPoint.shouldOptimize(chunkName);
    });
  },
};

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    popup: path.resolve("src/popup/popup.tsx"),
    offscreen: path.resolve("src/offscreen/offscreen.tsx"),
    options: path.resolve("src/options/options.tsx"),
    background: path.resolve("src/background/background.ts"),
    contentScript: path.resolve("src/contentScript/contentScript.tsx"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: process.env.NODE_ENV === "production",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve("src/shadcn"),
    },
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["popup", "options", "offscreen"]),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve("dist"),
  },
  optimization: {
    /**
     * Split chunks into separate files.
     *
     * We don't want to split the content script because it needs to be bundled
     * with the rest of the extension and use libraries.
     *
     * We also don't want to split the background script because it needs to be
     * bundled with the rest of the extension and use libraries.
     */
    splitChunks: {
      chunks(chunk) {
        const contentChunksOptimized = contentScriptEntryPointFactory.optimize(
          chunk.name
        );
        return (
          chunk.name !== "contentScript" &&
          chunk.name !== "background" &&
          contentChunksOptimized
        );
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map((chunk) => {
    if (chunk === "popup") {
      return new HtmlPlugin({
        title: "React Extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
        template: path.resolve("src/webpack-html-templates/popup.html"),
      });
    }
    return new HtmlPlugin({
      title: "React Extension",
      filename: `${chunk}.html`,
      chunks: [chunk],
    });
  });
}
