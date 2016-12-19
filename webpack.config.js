'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname,
    entry: "./lib/index.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "fuzzyis-v1.0.0.js",
        library: "fuzzyis"
    },

    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }]
    },

    plugins: [new webpack.optimize.UglifyJsPlugin()]
};
