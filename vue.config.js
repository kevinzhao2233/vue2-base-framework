'use strict'
const resolve = dir => require('path').join(__dirname, dir)
const chalk = require('chalk')

const pageTitle = 'Vue Base FrameWork'

const apiHost = process.env.VUE_APP_HOST
const apiPort = process.env.VUE_APP_PORT
const preApi = process.env.VUE_APP_API

console.log(
  chalk.green('**********************************\n'),
  `${chalk.blue('target:')} ${chalk.bgGray(`${apiHost}:${apiPort}${preApi}`)}`,
  chalk.green('\n\n**********************************')
)

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 2233,
    open: false,
    proxy: {
      // 将 localhost:2233/api/home 代理到 `${apiHost}:${apiPort}${preApi}/home`
      '^/api': {
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
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/styles/variables.scss";
          `
      }
    }
  }
}
