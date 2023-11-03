import axios from '@/libs/api.request'

export const digitalDictionary = {
  // 院区管理列表
  yuanList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetYuanLists',
      data,
      method: 'post'
    })
  },

  // 院区管理详情
  yuanDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetYuanInfo',
      data,
      method: 'post'
    })
  },

  // 院区管理保存
  yuanSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveYuan',
      data,
      method: 'post'
    })
  },

  // 院区管理删除
  yuanDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelYuan',
      data,
      method: 'post'
    })
  },

  // 排班类别列表
  pbList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetClasscateLists',
      data,
      method: 'post'
    })
  },

  // 排班类别详情
  pbDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetClasscateInfo',
      data,
      method: 'post'
    })
  },

  // 排班类别保存
  pbSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveClasscate',
      data,
      method: 'post'
    })
  },

  // 排班类别删除
  pbDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelClasscate',
      data,
      method: 'post'
    })
  },

  // 科室管理列表
  ksList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetSectionLists',
      data,
      method: 'post'
    })
  },

  // 科室管理详情
  ksDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetSectionInfo',
      data,
      method: 'post'
    })
  },

  // 科室管理保存
  ksSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveSection',
      data,
      method: 'post'
    })
  },

  // 科室管理删除
  ksDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelSection',
      data,
      method: 'post'
    })
  },

  // 职称管理列表
  titleList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetPostitleLists',
      data,
      method: 'post'
    })
  },

  // 职称管理详情
  titleDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetPostitleInfo',
      data,
      method: 'post'
    })
  },

  // 职称管理保存
  titleSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSavePostitle',
      data,
      method: 'post'
    })
  },

  // 职称管理删除
  titleDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelPostitle',
      data,
      method: 'post'
    })
  }
}
