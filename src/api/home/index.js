import axios from '@/libs/api.request'

export const home = {
  // 权限菜单
  menuList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/index/ajaxGetMenu',
      data,
      method: 'post'
    })
  },

  // 患者数据
  homeHZSJ: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Graph/ajaxGetPatientData',
      data,
      method: 'post'
    })
  },

  // 数据概览
  homeSJGL: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Graph/ajaxGetViewData',
      data,
      method: 'post'
    })
  },

  // 收入占比
  homeSRZB: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Graph/ajaxGetIncomeScale',
      data,
      method: 'post'
    })
  },

  // 科室情况
  homeKSQK: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Graph/ajaxGetSectionData',
      data,
      method: 'post'
    })
  },

  // 接诊排行
  homeJZPH: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Graph/ajaxGetReceiveRank',
      data,
      method: 'post'
    })
  }
}
