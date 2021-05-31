'use strict'
const resolve = dir => require('path').join(__dirname, dir)
const chalk = require('chalk')

const pageTitle = 'Vue Base FrameWork'

const apiHost = process.env.VUE_APP_HOST
const apiPort = process.env.VUE_APP_PORT
const preApi = process.env.VUE_APP_API

console.log(
  chalk.green('**********************************\n'),
  `${chalk.blue('target:')} ${chalk.green(`${apiHost}:${apiPort}${preApi}`)}`,
  chalk.green('\n\n**********************************')
)

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 10001,
    open: false,
    proxy: {
      // 将 localhost:10001/api/home 代理到 `${apiHost}:${apiPort}${preApi}/home`
      '/api': {
        target: `${apiHost}:${apiPort}`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': preApi
        }
      }
    }
  },
  configureWebpack: {
    name: pageTitle,
    // devtool: 'source-map',
    resolve: {
      alias: {
        // 别名 @
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.when(process.env.NODE_ENV === 'production',
      config => {
        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            // 分割 ant-design-vue 成单独的 package （暂时并未生效）
            antd: {
              name: 'chunk-Ant-design',
              priority: 20, // 优先级需要大于 libs 和 app，否则会被打到 libs 或 app 中
              test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
            },
            // 分割第三方包
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            // 将引用次数达到 3 次的组件抽离为独立 package
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'), // can customize your rules
              minChunks: 3, //  minimum common number
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })
        config.optimization.runtimeChunk('single')
      }
    )
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/styles/variables.scss";
          `
      },
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}
