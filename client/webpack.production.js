/* global require, module, __dirname*/

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    context: __dirname,
    entry: "./src/js/script.jsx",
    devtool: "none",
    output: {
        filename: "index_bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/" // Sets root folder for assets including .js files, so an absolute import will be used in HTML
    },
    module: {
        rules: [
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/i,
                exclude: /node_modules/,
                loader: "file-loader?name=[name].[ext]"
            },
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
            template: "./src/index.html",
            filename: "index.html"
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