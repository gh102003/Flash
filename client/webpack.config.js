/* global require, module, __dirname */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    mode: "development",
    context: __dirname,
    entry: "./src/js/script.jsx",
    devtool: "inline-source-map",
    output: {
        filename: "index_bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/" // Sets root folder for assets including .js files, so an absolute import will be used in HTML
    },
    devServer: {
        host: "0.0.0.0",
        stats: "normal",
        inline: true,
        port: 3000,
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new CopyWebpackPlugin([
            { from: "./src/manifest.json", to: "." },
            { from: "./src/robots.txt", to: "." }
        ]),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,

            navigateFallback: "/index.html",

            // Runtime caching - remember last 10 backend GET requests for 5 minutes
            runtimeCaching: [{
                urlPattern: /^.*:(444|3001)/,
                handler: "NetworkFirst",
                options: {
                    networkTimeoutSeconds: 10,
                    cacheName: "backend-runtime-cache",
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 5,
                    },
                    cacheableResponse: {
                        statuses: [200]
                    }
                }
            }]
        })
    ],
    optimization: {
        usedExports: true,
    },
    resolve: {
        alias: {
            "history/createMemoryHistory": path.resolve(__dirname, "../node_modules/history/es/createMemoryHistory"),
            "history/createHashHistory": path.resolve(__dirname, "../node_modules/history/es/createHashHistory"),
            "history/createBrowserHistory": path.resolve(__dirname, "../node_modules/history/es/createBrowserHistory"),
            "history/PathUtils": path.resolve(__dirname, "../node_modules/history/es/PathUtils")
        }
    }
};