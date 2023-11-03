import axios from '@/libs/api.request'

export const check = {
  // 检验检查列表
  checkList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Inspect/ajaxGetInspectLists',
      data,
      method: 'post'
    })
  },

  // 执行
  checkDo: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Inspect/ajaxCarryOutInspect',
      data,
      method: 'post'
    })
  },

  // 完成
  checkSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Inspect/ajaxSaveInspectResult',
      data,
      method: 'post'
    })
  },

  // 获取报告单
  getReport: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Inspect/ajaxGetInspectReport',
      data,
      method: 'post'
    })
  }
}
