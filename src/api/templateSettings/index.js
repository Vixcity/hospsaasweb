import axios from '@/libs/api.request'

export const templateSettings = {
  // 规避医嘱列表
  evadeList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetEvadeLists',
      data,
      method: 'post'
    })
  },

  // 规避医嘱详情
  evadeDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetEvadeInfo',
      data,
      method: 'post'
    })
  },

  // 规避医嘱详情
  evadeSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveEvade',
      data,
      method: 'post'
    })
  },

  // 规避医嘱详情
  evadeDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelEvade',
      data,
      method: 'post'
    })
  },

  // 病例模板列表
  temList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetCaseLists',
      data,
      method: 'post'
    })
  },

  // 病历模板详情
  temDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetCaseInfo',
      data,
      method: 'post'
    })
  },

  // 保存病历模板
  temSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveCase',
      data,
      method: 'post'
    })
  },

  // 删除模板
  temDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelCase',
      data,
      method: 'post'
    })
  },

  // 病例模板列表
  resultList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDiagLists',
      data,
      method: 'post'
    })
  },

  // 病历模板详情
  resultDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDiagInfo',
      data,
      method: 'post'
    })
  },

  // 保存病历模板
  resultSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveDiag',
      data,
      method: 'post'
    })
  },

  // 删除模板
  resultDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelDiag',
      data,
      method: 'post'
    })
  }
}
