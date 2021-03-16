import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
import router from '@/router'
import log from 'b-pretty-log'

// 创建一个 axios 实例
const service = axios.create({
  // 如果不需要跨域即可访问，则可以打开 baseURL，并在 vue.config.js 中关掉代理
  // baseURL: `${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}${process.env.VUE_APP_API}`,
  // withCredentials: true, // 是否在跨域请求中发送 cookie
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 让请求携带令牌，有些后端可能并不使用 Authorization 头部，则需要在这里改掉
    if (store.getters.token) {
      config.headers.Authorization = store.getters.token
    }
    return config
  },
  error => {
    log.pretty('axios request error', error.url, error, 'danger')
    message.error({
      content: error.message || 'Error: 请求错误',
      duration: 5
    })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 每个请求都打印出来，方便调试
    log('resInfo', response, 'success', true)
    // 判断自定义 code 值，需要跟后端协商，可能是其他值
    if (+res.code !== 200) {
      // 响应失败
      if (+res.code === 401) {
        // 未认证，可能是未登录，一般会跳转到登录页
        router.replace('#')
      }
      if (+res.code === 403) {
        // 拒绝，一般是没权限之类的，跳转到错误页
        router.replace('#')
      }
      if (+res.code >= 500) {
        // 后台错误，一般跳转到错误页
        router.replace('#')
      }
      message.error({
        content: res.message || 'Error: 响应错误',
        duration: 5
      })
      return Promise.reject(new Error(res.message || 'Error: 响应错误'))
    } else {
      // 获取响应成功，返回信息给组件
      const { data } = response
      const { code } = data
      // 自定义状态码为 200 表示 api 成功
      if (+code === 200) {
        return data
      } else {
        return res
      }
    }
  },
  error => {
    log.pretty('axios response error', error?.config?.url, error?.toJSON() || error, 'danger')
    message.error({
      content: error.message || 'Error',
      duration: 5
    })
    return Promise.reject(error)
  }
)

export default service
