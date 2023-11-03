import axios from '@/libs/api.request'

export const outpatientPharmacy = {
  // 门诊药房列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Store/ajaxGetStoreLists',
      data,
      method: 'post'
    })
  },

  // 处方详情
  storeDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Store/ajaxGetStoreDetail',
      data,
      method: 'post'
    })
  },

  // 处方执行
  prescribeCarry: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Store/ajaxSavePrescribeCarry',
      data,
      method: 'post'
    })
  },

  // 处方退回
  backPrescribe: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Store/ajaxBackPrescribe',
      data,
      method: 'post'
    })
  }
}
