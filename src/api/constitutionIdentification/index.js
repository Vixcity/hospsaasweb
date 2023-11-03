import axios from '@/libs/api.request'

export const TZBS = {
  // 患者列表
  getPatLists: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Phy/getPatLists',
      data,
      method: 'post'
    })
  },

  // 答题列表
  getQuesLists: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Phy/getQuesRecord',
      data,
      method: 'post'
    })
  },

  // 辨识结果
  getResult: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Phy/getPhyResult',
      data,
      method: 'post'
    })
  }
}
