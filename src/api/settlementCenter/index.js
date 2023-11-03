import axios from '@/libs/api.request'

export const settlementCenter = {
  // 结算中心
  // 待结算
  // 列表
  toBeSettledList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Settle/ajaxGetNoSettle',
      data,
      method: 'post'
    })
  },

  // 结算
  ajaxGetNoDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Settle/ajaxGetNoDetail',
      data,
      method: 'post'
    })
  },

  // 确认支付方式
  ajaxCreateOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Settle/ajaxCreateOrder',
      data,
      method: 'post'
    })
  },

  // 支付宝支付
  alipayOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Order/alipayOrder',
      data,
      method: 'post'
    })
  },

  // 微信支付
  wxpayOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Order/wxpayOrder',
      data,
      method: 'post'
    })
  },

  // 微信支付 - 查询订单
  queryOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Order/queryOrder',
      data,
      method: 'post'
    })
  },

  // 微信支付 - 撤销订单
  cancelOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Order/cancelOrder',
      data,
      method: 'post'
    })
  },

  // 现金支付
  cashpayOrder: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Order/cashpayOrder',
      data,
      method: 'post'
    })
  },

  // 已结算
  // 列表
  settledList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Settle/ajaxGetYesSettle',
      data,
      method: 'post'
    })
  },

  // 查看明细
  ajaxGetYesDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Settle/ajaxGetYesDetail',
      data,
      method: 'post'
    })
  }
}
