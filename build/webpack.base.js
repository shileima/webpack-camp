const path = require('path');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = env => {
    let isDev = env.development
    const base = {
        entry: path.resolve(__dirname, '../src/index.ts'),
        module:{
            rules:[
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                },
                {
                    test:/\.css$/,
                    use:[
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader:'css-loader',
                            options: {
                                importLoaders:2
                            }
                        },'postcss-loader','sass-loader']
                },
                {
                    test:/\.scss$/,
                    use:['style-loader','css-loader','sass-loader']
                },
                {
                    test:/\.less$/,
                    use:['style-loader','css-loader','less-loader']
                },
                {
                    test: /\.(woff|ttf|eot)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            name:'img/[contentHash].[ext]',
                            limit: 8*1024
                        }
                    } // 默认功能是拷贝的作用
                    // 我希望当前比较小的图片可以转化成 base64
                }
            ]
        },
        output:{
            filename: 'bundle.js',
            path:path.resolve(__dirname,'../dist')
        },
        plugins: [
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/main.css'
            }),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname,'../publick/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true
                }
            })
        ].filter(Boolean)
    }
    if(isDev){
        return merge(base,dev)
    }else{
        return merge(base,prod)
    }
}