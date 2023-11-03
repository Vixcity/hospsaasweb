import axios from '@/libs/api.request'

export const pbgl = {
  // 固定排班列表
  gdList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班删除
  gdDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxDelClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班详情
  gdDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxEditClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班保存
  gdSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveClasses',
      data,
      method: 'post'
    })
  },

  // 调班列表
  changeList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetChange',
      data,
      method: 'post'
    })
  },

  // 获取上一次排班数据
  getLastDoctorInfo: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxAddDoctor',
      data,
      method: 'post'
    })
  },

  // 调班删除
  changeDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxDelChange',
      data,
      method: 'post'
    })
  },

  // 调班保存
  changeSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveChange',
      data,
      method: 'post'
    })
  },

  // 节假日停诊列表
  feastList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetFeast',
      data,
      method: 'post'
    })
  },

  // 节假日停诊删除
  feastDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxDelFeast',
      data,
      method: 'post'
    })
  },

  // 节假日停诊保存
  feastSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveFeast',
      data,
      method: 'post'
    })
  },

  // 节假日停诊列表
  stopList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetStop',
      data,
      method: 'post'
    })
  },

  // 节假日停诊删除
  stopDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxDelStop',
      data,
      method: 'post'
    })
  },

  // 节假日停诊保存
  stopSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveStop',
      data,
      method: 'post'
    })
  },

  // 动态排班列表
  dynaList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetDynamic',
      data,
      method: 'post'
    })
  },

  // 动态排班详情
  dynaDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxEditDynamic',
      data,
      method: 'post'
    })
  },

  // 动态排班保存
  dynaSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveDynamic',
      data,
      method: 'post'
    })
  },

  // 动态/固定排班删除
  dynaDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxDelClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班列表
  classesList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班详情
  classesDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxEditClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班保存
  classesSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveClasses',
      data,
      method: 'post'
    })
  },

  // 固定排班终止
  classesStop: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSuspClasses',
      data,
      method: 'post'
    })
  },

  // 基础配置 - 初始化
  getConfig: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxGetConfig',
      data,
      method: 'post'
    })
  },

  // 基础配置 - 保存
  saveConfig: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Classes/ajaxSaveConfig',
      data,
      method: 'post'
    })
  }
}
