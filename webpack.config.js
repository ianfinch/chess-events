const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        "combined-css": [
            path.resolve(__dirname, "src/board.css"),
            path.resolve(__dirname, "src/modal.css"),
            path.resolve(__dirname, "src/page.css")
        ],
        "js/chess.js": path.resolve(__dirname, "src/index.js"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, "public")
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "src/index.html",
                    to: "index.html"
                },
                {
                    context: "assets/",
                    from: "*.svg",
                    to: "images/"
                },
                {
                    context: "node_modules/@chrisoakman/chessboardjs/dist/",
                    from: "chessboard-*.min.{js,css}",
                    to: "lib/"
                },
                {
                    from: "node_modules/jquery/dist/jquery.js",
                    to: "lib/jquery.js"
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "css/chess.css"
        })
    ]
};
