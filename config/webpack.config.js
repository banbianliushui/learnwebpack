const path = require('path')

//const ExtractTextPlugin = require('extract-text-webpack-plugin')
//loader加载css文件，tonggplugin将主任bundle.js文件里的css提取到单独到文件
//DeprecationWarning: Tapable.apply is deprecated. Call apply on the plugin directly instead
//DeprecationWarning: Tapable.plugin is deprecated. Use new API on .hooks instead
//如果在运行过程中遇到这两个警告，就表示你有loader或者plugin没有升级。造成这两个错误的原因是，webpack4使用的新的插件系统
//关于plugin，有两个坑，一个是extract-text-webpack-plugin，还一个是html-webpack-plugin。
//替换下插件，然后改动下css相关的loader

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

//配置详情： https://webpack.js.org/configuration/#options
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = {
    mode: "development",
    //webpack-dev-server的配置，只有通过它启动webpack，配置中的devServer才会生效。

    devServer: {
        //告诉服务器服务内容来源。适用于提供静态资源。
        //contentBase: false 禁用contentBase，关闭暴露本地文件。配置DevServer http服务器的文件根目录，默认为党当前执行目录。
        //DevServer服务器通过http服务暴露文件，一是暴露本地文件，二是暴露webpack构建的结果，由于构建出的结果交给DevServer,使用DevServer会在本地找不到构建出的文件。

        // contentBase: [path.join(__dirname,'dist'), path.join(__dirname, 'assets')],
        compress: true, //是否启用 gzips压缩 ？
        port: 9200,
        headers: { //可以在http响应中注入一些http响应头
            'X-foo': 'bar'
        },
        // host 用于配置DevServer服务监听的地址，只能通过命令行参数传入， --host 0.0.0.0 可以让局域网中的其他设备访问自己的本地服务。
        //默认值127.0.0.1直邮本地可以访问http服务。
        // allowedHosts:['localhost','host.com','.host2.com'],
        //配置是否关闭用于DNS重新绑定的http请求的host检查。默认只接收来自本地的请求，关闭后可以接收来自任意host的情趣。
        //和--host 0.0.0.0 搭配使用，可以让其他设备访问自己的本地服务，访问直接通过ip地址而不是host 访问，所以需要关闭host检查
        disableHostCheck: true,
        //http2 和service worker必须运行在https上，需切换称https服务
        https: false,
        //自己的证书
        /*  https:{
             key: fs.readFileSync('path/to/server.key'),
             cert: fs.readFileSync('path/to/server.crt'),
             ca: fs.readFileSync('path/to/ca.pem')

         } */
        clientLogLevel: 'info',
        //在DevServer启动且第一次构建完时，自动用系统默认浏览器打开开发的网页
        open: true,
        //打开指定 URL网页，或webpack-dev-server --open-page "/different/page"
        //openPage:'/page',//打开后为 http://localhost:9200//page

        proxy: { //代理到后端服务接口
            '/api': 'http://localhost:3000'

        },
        historyApiFallback: true, //是否开发html5 history api网页
        hot: true, //是否开启模块热替换功能, 可能导致library有问题？ 热替换是为提高开发效率而产生，不能用于线上
        //profile: true,//没有这个属性，暂时删除，有可能写错位置，是否捕捉webpack构建到性能信息，用于分析是什么原因导致构建性能不佳
        //cache: false,//没有这个属性，暂时删除，有可能写错位置，是否启用缓存提升构建速度
        //inline: false, //默认true。false时一个页面注入一个客户端，进行自动刷新，而不是每个chunk都注入一个客户端
    },
    //webpack寻找相对露肩文件时以context为根目录，context默认为之行启动webpack时所在的当前工作目录。

    context: path.resolve(__dirname, '../'),
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
        //发布到线上的所有资源的URL前缀，
        /*  publicPath:path.resolve(__dirname,'../static'),//放到指定目录下 */
        crossOriginLoading: 'use-credentials',
        // libraryTarget: 'var',//
        // library: 'mylib',//bundle.js 文件导出var mylib = (function(modules)
        // 如果在 HTML 页面中使用script标签引入打包结果文件，那么变量mylib对应的值将会是入口文件(entry file)的返回值。
        //生成的source map文件的名称
        sourceMapFilename: '[file].map', //bundle.js 文件中到注释//# sourceMappingURL=bundle.js.map
        //是否包含有用的文件路径信息到生成到代码里,bundle.js 注释中？
        pathinfo: true, //如打包文件中到注释： !*** (webpack)/buildin/global.js ***!
    },
    //配置模块的解析方式。即配置寻找模块的规则 例如，在ES2015中调用import“lodash”时，解析选项可以更改webpack去寻找“lodash”的位置（参见模块）。
    resolve: {
        alias: { //模块别名设置，用于映射模块
            components: './src/components',
            'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'

        },
        mainFields: ['browser', 'main'], //webpack会按照数组里的顺序去package.json文件里面找，只会使用找到的第一个。https://segmentfault.com/a/1190000013176083?utm_source=tag-newest
        // mainFields:['jsnext:main','browser','main']
        extensions: ['.js', '.json'], //在导入语句没带文件后缀时，webpack会自动带上后缀去常识访问文件是否存在。遇到require('./data)则webpack会先查找./data.js，如果文件不存在，则查找./data.json
        //modules 告诉webpack在解析模块时应该搜索哪些目录。(配置webpack去哪些目录下找第三方模块，默认只会去node_modules)
        //相对路径：通过查看当前目录及其祖先（即./node_modules，.. / node_modules等等），类似于Node扫描node_modules的方式扫描相对路径。
        //绝对路径：它只会在给定目录中搜索。
        //如果大量被导入等模块都在src下，(如果 button在src下面))配置如下后，可以简单通过import 'button'
        modules: [path.resolve(__dirname, 'src'), 'node_modules'], //寻找模块的根目录,指明第三方模块存放位置，减少搜索步骤。
        //配置描述第三方模块都文件名称，package.json
        descriptionFiles: ['package.json'],
        //如果enforceExtension为true则所有导入文件必须带文件后缀。
        enforceExtension: false,
        //只对node_modules下带模块生效
        enforceModuleExtension: false,
        //配置webpack查找loader的方式，因为使用loader时通过其包名称去引用的，webpack根据配置的loader包名查找loader的实际代码，来处理源文件。

    },
    resolveLoader: {
        modules: ['node_modules'], //去哪个目录找loader
        extensions: ['.js', '.json'], //入口文件的后缀
        mainFields: ['loader', 'main'] //指明入口文件位置
    },
    performance: {
        hints: 'warning', //有性能问题时输出警告， error（有性能问题输出错误） false关闭性能检查
        maxAssetSize: 200000, //最大文件的大小(bytes)
        maxEntrypointSize: 400000, //最大入口文件的大小
        assetFilter: function(assetFileName) {
            return assetFileName.endsWith('.css') || assetFileName.endsWith('.js')
        }

    },
    module: {
        //防止webpack解析与给定正则表达式匹配的任何文件。 忽略的文件不应该有import，require，define或任何其他导入机制的调用。
        // 这可以在忽略大型库时提高构建性能。
        noParse: /jquery|lodash/,
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        }, {
            //sass-loader将scss源码转换为css代码，再将css代码交给css-loader处理，它
            //会找出css代码中@import和url()导入的语句，webpack得到依赖的资源。还支持css modules、
            //压缩css等功能。然后style-loader将css代码转换成字符串，注入到js代码中，通过js想dom增加样式。
            //如果想将css提取到单独到文件可以使用extracttextplugin或MiniCssExtractPlugin

            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.js$/,
            use: ['babel-loader'],
            include: path.resolve(__dirname, 'src')
        }, {
            test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
            use: ['file-loader']
        }, {
            //遇到以.css结尾的文件，先使用css-loader读取css文件，再由style－loader将css的内容注入js里。
            //css-loader?minimize 开启css压缩
            //https://github.com/webpack-contrib/css-loader/blob/master/lib/css-base.js
            test: /\.css$/,
            /*  use: ['style-loader','css-loader'] */
            //转换.css文件需要使用loader
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        minimize: process.env.NODE_ENV === 'production'
                    }
                },
                {
                    loader: 'postcss-loader'
                }
            ]

        }]
    },
    //构建出针对不同运行环境等代码
    target: 'web', //web默认，编译在类浏览器环境下使用。其他如：webworker、node等,node 使用 require价值chunk代码 electron-renderer,electron渲染现场
    devtool: 'source-map', //默认false.设置如何生成资源映射

    stats: { //控制台输出日志控制
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
    },
    //webpack的监听模式，监听文件更新，在文件变化时，重新编译。默认关闭。使用devserver监听模式默认开启。
    watch: true,
    watchOptions: {
        //不监听的文件或文件夹
        ignored: /node_modules/,
        //监听到变化后等待300ms再去执行
        aggregateTimeout: 300, //
        //判断文件是否发生变化是通过不停询问系统执行文件有没有变化实现。 默认每秒询问1000次
        poll: 1000,
    },
    //告诉webpack要构建的代码中使用了哪些不用被打包的模块，即这些模块由外部环境提供。打包时被忽略。
    //防止捆绑某些import导入的包，而是在运行时检索这些外部依赖项。
    //externals告诉webpack在js运行环境中已经内置了哪些全局变量，不用酱这些全局变量打包可直接使用。
    externals: {
        'jquery': 'jQuery', // 引入  import $ from 'jquery';值 jQuery将检索jQuery全局变量。当提供字符串时，它将被视为root（在上面和下面定义）。
        // Object
        lodash: {
            commonjs: 'lodash',
            amd: 'lodash',
            root: '_' // indicates global variable
        },
    },
    plugins: [
        //[name]_[contenthash:8].css  打包后在dist文件夹下生成main_1a4cac39.css文件，然后将该文件引入index.html;
        // 是否可以直接注入?
        //[name]_[contenthash:8].css
        new MiniCssExtractPlugin({
            filename: `[name].css`
        }),
        new VueLoaderPlugin(),

        new HotModuleReplacementPlugin(),

    ]

}