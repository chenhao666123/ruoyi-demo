import axios from 'axios'
import { Notification, MessageBox, Message } from "element-ui";
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'

axios.defaults.headers['Content-type'] = 'application/json;charset=uft-8'
// 创建axios 实例
const service = axios.create({
  // axios 中请求配置有baseURL选择, 表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // timeout
  timeout: 10000
})

service.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer' + getToken()
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName in Object.keys(config.params)) {
      const value = config.params[propName]
      var part = encodeURIComponent(propName) + '='
      if (value !== null && typeof(value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key in Object.keys(value)) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        url += part + encodeURIComponent(value) + "&"
      }
    }
    // 清空地址
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
})

service.interceptors.response.use(res => {
    // 未设置状态码则成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (msg === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          Location.href = '/index'
        })
      }).catch(() => {})
      return Promise.reject()
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.include('timeout')) {
      message =  "系统接口请求超时"
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
