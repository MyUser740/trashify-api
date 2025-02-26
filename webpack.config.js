const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
    entry: path.join(__dirname, './index.ts'),
    target: "node",
    devtool: 'inline-source-map',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'] //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                path.join(__dirname, './db/data/db.sqlite')
            ]
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.DB_PATH': 'require("path").join(__dirname, "./db.sqlite")'
        })
    ]
}