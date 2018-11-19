const path = require('path')
const nodeExternals = require('webpack-node-externals')
module.exports ={
    context: path.resolve(__dirname,'../'),
    entry:'./src/main_server.js',
}