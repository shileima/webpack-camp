const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
/* 以上两个优化插件似乎没用也可以压缩js/css */
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}