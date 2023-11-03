import axios from '@/libs/api.request'

export const allPatient = {
  // 患者管理列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatientLists2',
      data,
      method: 'post'
    })
  },

  // 开具脱敏
  kjtm: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxOpenTuomin',
      data,
      method: 'post'
    })
  },

  // 开具脱敏 - 初始化
  kjtmInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxInitTuomin',
      data,
      method: 'post'
    })
  },

  // 患者分组列表
  groupList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/getGroup',
      data,
      method: 'post'
    })
  },

  // 添加分组
  addGroup: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/addGroup',
      data,
      method: 'post'
    })
  },

  // 删除分组
  delGroup: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/delGroup',
      data,
      method: 'post'
    })
  },

  // 修改分组名称
  editGroup: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/saveGroup',
      data,
      method: 'post'
    })
  },

  // 获取患者分组
  getPatientGroup: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/initPatientGroup',
      data,
      method: 'post'
    })
  },

  // 保存患者分组
  savePatientGroup: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/savePatientGroup',
      data,
      method: 'post'
    })
  }
}
