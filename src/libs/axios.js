import axios from 'axios'
// import store from '@/store'
import Vue from 'vue'
import router from '@/router'
import { deepClone } from '@/libs/util'
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const {
//     statusText,
//     status,
//     request: { responseURL }
//   } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        if (url !== '/api/saas/login/ajaxCheckLogin') {
          // 过期token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2Fhcy5oenN6eWp5bC5jb20iLCJhdWQiOiIxMjcuMC4wLjEiLCJpYXQiOjE2Nzk2MjAzMzEsIm5iZiI6MTY3OTYyMDMzMSwiZXhwIjoxNjc5NjI3NTMxLCJ1ZGF0YSI6eyJhaWQiOjF9fQ.zQrua7wMSs_vfBo7fDgxc8i7rPEQM5wXbPIdHQjCJQ0
          config.headers['token'] = localStorage.getItem('token')
        }
        // 添加全局的loading...
        // if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
        // }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        // console.log(res)
        if (res.request.responseType === 'blob') {
          return res
        } else if (res.data.code !== '200' && res.data.code !== '401') {
          Vue.prototype.$Message.error(res.data.msg)
          return Promise.reject(res.data.msg)
        } else if (res.data.code === '401') {
          Vue.prototype.$Message.error(res.data.msg)
          localStorage.token = ''
          localStorage.tagNaveList = ''
          router.push('/login')
          return Promise.reject(res.data.msg)
        } else {
          this.destroy(url)
          const { status } = res
          const data = res.data.data
          const msg = res.data.msg
          return { data, status, msg }
        }
      },
      error => {
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const {
            request: { statusText, status },
            config
          } = deepClone(error)
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        }
        // addErrorLog(errorInfo)
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
