import axios from '@/libs/api.request'

export const payService = {
  // 用药医嘱列表
  yzList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDrugLists',
      data,
      method: 'post'
    })
  },

  // 用药医嘱详情
  yzDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDrugInfo',
      data,
      method: 'post'
    })
  },

  // 用药医嘱保存
  yzSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveDrug',
      data,
      method: 'post'
    })
  },

  // 用药医嘱删除
  yzDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelDrug',
      data,
      method: 'post'
    })
  },

  // 服用剂量列表
  doseList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDoseLists',
      data,
      method: 'post'
    })
  },

  // 服用剂量详情
  doseDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetDoseInfo',
      data,
      method: 'post'
    })
  },

  // 服用剂量保存
  doseSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveDose',
      data,
      method: 'post'
    })
  },

  // 服用剂量删除
  doseDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelDose',
      data,
      method: 'post'
    })
  },

  // 服用频率列表
  rateList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetRateLists',
      data,
      method: 'post'
    })
  },

  // 服用频率详情
  rateDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetRateInfo',
      data,
      method: 'post'
    })
  },

  // 服用频率保存
  rateSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveRate',
      data,
      method: 'post'
    })
  },

  // 服用频率删除
  rateDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelRate',
      data,
      method: 'post'
    })
  },

  // 用药方式列表
  useList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetUsageLists',
      data,
      method: 'post'
    })
  },

  // 用药方式详情
  useDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetUsageInfo',
      data,
      method: 'post'
    })
  },

  // 用药方式保存
  useSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveUsage',
      data,
      method: 'post'
    })
  },

  // 用药方式删除
  useDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelUsage',
      data,
      method: 'post'
    })
  },

  // 用药方式列表
  insList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetInspectLists',
      data,
      method: 'post'
    })
  },

  // 用药方式详情
  insDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetInspectInfo',
      data,
      method: 'post'
    })
  },

  // 用药方式保存
  insSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveInspect',
      data,
      method: 'post'
    })
  },

  // 用药方式删除
  insDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelInspect',
      data,
      method: 'post'
    })
  },

  // 脱敏药物列表
  tmList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetTuominLists',
      data,
      method: 'post'
    })
  },

  // 脱敏药物详情
  tmDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetTuominInfo',
      data,
      method: 'post'
    })
  },

  // 脱敏药物保存
  tmSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveTuomin',
      data,
      method: 'post'
    })
  },

  // 脱敏药物删除
  tmDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelTuomin',
      data,
      method: 'post'
    })
  },

  // 单位列表
  dwList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetUnitLists',
      data,
      method: 'post'
    })
  },

  // 单位详情
  dwDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxGetUnitInfo',
      data,
      method: 'post'
    })
  },

  // 单位保存
  dwSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxSaveUnit',
      data,
      method: 'post'
    })
  },

  // 单位删除
  dwDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Book/ajaxDelUnit',
      data,
      method: 'post'
    })
  }
}
