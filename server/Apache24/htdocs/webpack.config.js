const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/js/script.jsx",
    output: {
        path: path.join(__dirname, "/build"),
        filename: "index_bundle.js"
    },
    devServer: {
        inline: true,
        port: 8080
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    resolve: {
        alias: {
            "history/createMemoryHistory": path.resolve(__dirname, "node_modules/history/es/createMemoryHistory"),
            "history/createHashHistory": path.resolve(__dirname, "node_modules/history/es/createHashHistory"),
            "history/createBrowserHistory": path.resolve(__dirname, "node_modules/history/es/createBrowserHistory"),
            "history/PathUtils": path.resolve(__dirname, "node_modules/history/es/PathUtils")
        }
    }
};