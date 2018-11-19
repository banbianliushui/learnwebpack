const serve = require('webpack-serve')
const argv = {};
const config = require('./webpack.config');
//您还可以指示webpack-serve在不指定配置的情况下启动webpack构建。
// 这将在webpack中应用zero-config默认值，并且您的项目必须符合成功构建的情况。
serve(argv,{config}).then((result) => {
    console.log(result)
})

if(dev){
    module.exports.serve = {
        port:5600,
        host: '0.0.0.0',
        dev:{
            publicPath:'/assets/'
        },
        add: app => {
            app.use(convert(history({
                index: '/assets/'
            })))
        }
    }
}