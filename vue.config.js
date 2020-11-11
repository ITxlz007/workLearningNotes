const path = require('path')
const isProduction = process.env.NODE_ENV === 'production';

// 代理
const proxyContext = ['/oaApi', '/user-service', '/vibe-web', '/norb-service'];
const proxyTarget = 'http://192.168.1.136:9001';

module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: 8081, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: createProxy() // 配置多个代理
  },
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: true, // false则不打包map文件
  css: { sourceMap: !isProduction },
  chainWebpack: config => {
    // 配置less预加载
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    // 配置别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("api", resolve("src/service/api"))
      .set("utils", resolve("src/utils"))
  }
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

function addStyleResource(rule) {
  rule.use('style-resource').loader('style-resources-loader').options({
    patterns: [
      path.resolve(__dirname, './src/less/common.less'),
    ],
  })
}

function createProxy() {
  let proxy = {};

  proxyContext.forEach(item => {
    proxy[item] = {
      target: proxyTarget,
    }
  });

  return proxy;
}