const webpack = require('webpack')
module.exports = {
    configureWebpack: {
        externals: {
            'vue-router': 'VueRouter',
            axios: 'axios',
            $: 'jquery'
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    publicPath: './',
    devServer: {
        port: 8080, // 端口号
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: '<url>',
                ws: true,
                changeOrigin: true
            }
        }
    },
    // css: {
    //     // 是否使用css分离插件 ExtractTextPlugin
    //     extract: true,
    //     // 开启 CSS source maps?
    //     sourceMap: false,
    //     // css预设器配置项
    //     loaderOptions: {},
    //     // 启用 CSS modules for all css / pre-processor files.
    //     modules: false
    // },
    // productionSourceMap: false,
}
