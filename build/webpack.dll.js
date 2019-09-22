const path = require('path')
const DLLPlugin = require('webpack').DllPlugin

module.exports = {
    mode:'development',
    /* entry: './src/calc.js',
    output: {
        filename:'calc.js',
        path:path.resolve(__dirname,'dll'),
        library:'calc',
        libraryTarget:'commonjs2'
    } */
    entry:['react','react-dom'],
    output: {
        filename:'react.dll.js',
        path:path.resolve(__dirname,'../dll'),
        library:'react',
        libraryTarget:'var'
    },
    plugins:[
        new DLLPlugin({
            name:'react',
            path:path.resolve(__dirname,'../dll/manifest.json')
        })
    ]
}