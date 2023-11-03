import axios from '@/libs/api.request'
import { urlSplicing } from '@/libs/util'

export const common = {
  getDocList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSearchDoctor',
      data,
      method: 'post'
    })
  },

  getPatList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSearchPatient',
      data,
      method: 'post'
    })
  },

  editPwd: param => {
    const data = param
    return axios.request({
      url: '/api/saas/index/ajaxSavePassword',
      data,
      method: 'post'
    })
  },

  login: ({ username, password }) => {
    const data = {
      username,
      password
    }
    return axios.request({
      url: '/api/saas/login/ajaxCheckLogin',
      data,
      method: 'post'
    })
  },

  patientInfo: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatInfo',
      data,
      method: 'post'
    })
  },

  /**
   * 获取科室/科室
   * 参数：type/类型 具体类型名称可看下方，多个可以以英文逗号分隔，例：section,postitle
   * section/科室
   * postitle/职称
   * yuan/院区
   * classcate/排班类别
   * diagnose/诊断结果
   * postype/职称类型
   * doctor/医生
   * nurse/护士
   * rate/服用频率
   * unit/剂量单位/组装单位
   * dose/服用剂量
   * usage/服用方式
   */
  getSelect: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetBookData',
      data,
      method: 'post'
    })
  },

  // 就诊完成
  ajaxConfirmFinish: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxConfirmFinish',
      data,
      method: 'post'
    })
  },

  // 搜索宣教
  searchXuan: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/searchXuanData',
      data,
      method: 'post'
    })
  },

  // 搜索量表
  searchEva: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/searchEvluation',
      data,
      method: 'post'
    })
  },

  downloadExcel: param => {
    const data = param
    return axios
      .request({
        url: urlSplicing('/api/saas/Research/downloadFile', data),
        data,
        method: 'get',
        responseType: 'blob'
      })
      .then(res => {
        const filestream = res.data // 返回的文件流
        // {type: 'application/vnd.ms-excel'}指定对应文件类型为.XLS (.XLS的缩写就为application/vnd.ms-excel)
        const blob = new Blob([filestream], { type: 'application/vnd.ms-excel' })
        const a = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载连接
        a.href = href
        // console.log(data)
        a.download = data.filename
        document.body.appendChild(a)
        // return
        a.click()
        document.body.removeChild(a) // 下载完移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
  }
}
