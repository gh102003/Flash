/* global require, module, __dirname*/

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    context: __dirname,
    entry: "./src/js/script.jsx",
    devtool: "inline-source-map",
    output: {
        path: path.join(__dirname, "/build"),
        filename: "index_bundle.js"
    },
    devServer: {
        inline: true,
        contentBase: path.join(__dirname, "/build"),
        port: 3001,
        historyApiFallback: {
            rewrites: [
                { from: /index_bundle.js$/, to: "/index_bundle.js" },
                { from: /^\/category\/\w*$/, to: "/index.html" }
            ]
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    resolve: {
        alias: {
            "history/createMemoryHistory": path.resolve(__dirname, "../node_modules/history/es/createMemoryHistory"),
            "history/createHashHistory": path.resolve(__dirname, "../node_modules/history/es/createHashHistory"),
            "history/createBrowserHistory": path.resolve(__dirname, "../node_modules/history/es/createBrowserHistory"),
            "history/PathUtils": path.resolve(__dirname, "../node_modules/history/es/PathUtils")
        }
    }
};