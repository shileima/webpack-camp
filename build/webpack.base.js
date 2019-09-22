const path = require('path');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const glob = require('glob');
const PurgeCssWebpackPlugin = require('purgecss-webpack-plugin');
const AddCdnPlugin = require('add-asset-html-cdn-webpack-plugin');
const DLLReferencePlugin = require('webpack').DllReferencePlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = env => {
    let isDev = env.development
    const base = {
        entry: {
            "index": path.resolve(__dirname, '../src/index.js'),
            "a":path.resolve(__dirname, '../src/a.js')
        },
        externals: {
            'jquery': '$'
        },
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
                    use: [ // loader 从下往上执行
                        {
                            loader: 'url-loader',
                            options: {
                                name:'img/[contentHash].[ext]',
                                limit: 8*1024
                            }
                        }, // 默认功能是拷贝的作用
                        // 我希望8k以下的图片可以转化成 base64
                        !isDev && {
                            // file-loader 之前对图片压缩
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                  },
                                  // optipng.enabled: false will disable optipng
                                  optipng: {
                                    enabled: false,
                                  },
                                  pngquant: {
                                    quality: [0.65, 0.90],
                                    speed: 4
                                  },
                                  gifsicle: {
                                    interlaced: false,
                                  },
                                  // the webp option will enable WEBP
                                  webp: {
                                    quality: 75
                                  }
                            },
                        }
                    ].filter(Boolean)
                }
            ]
        },
        output:{
            filename: '[name].bundle.js',
            // chunkFilename: '[name].min.js', // import 同步加载文件命名 与 splitChunks 有冲突
            path:path.resolve(__dirname,'../dist')
        },
        optimization: {
            // usedExports:true,
            splitChunks: {
                chunks: 'initial', // async 只打包异步的chunks initial 只打包同步 all 打包全部
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                automaticNameMaxLength: 30,
                name: true,
                cacheGroups: {
                  /* react: {
                    test: /[\\/]node_modules[\\/]\/react|react-dom//,
                    priority: 1
                  }, */
                  vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                  },
                  common: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                  }
                }
              }
        },
        plugins: [
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/main.css'
            }),
            new VueLoaderPlugin(),
            new PurgeCssWebpackPlugin({
                paths: glob.sync('./src/**/*', {nodir:true})
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname,'../publick/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true
                },
                chunksSortMode:'manual', // 手动按照我的顺序排序，默认按照上面entry自上问下
                chunks:['a','index'] // 结合 chunksSortMode:'manual' ，打包的顺序按照手动
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname,'../publick/index.html'),
                filename: 'a.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true
                },
                chunks:['a','index']
            }),
            // dll plugin
            new DLLReferencePlugin({
                manifest: path.resolve(__dirname,'../dll/manifest.json')
            }),
            // 把单独打包的react引入到html中
            new AddAssetHtmlPlugin({
                filepath:path.resolve(__dirname,'../dll/react.dll.js')
            }),
            // add cdn config
            new AddCdnPlugin(true,{
                'jquery':'https://cdn.bootcss.com/jquery/3.3.0/jquery.min.js',
                'moment':'https://cdn.bootcss.com/moment.js/2.24.0/locale/zh-cn.js'
            })
        ].filter(Boolean)
    }
    if(isDev){
        return merge(base,dev)
    }else{
        return merge(base,prod)
    }
}