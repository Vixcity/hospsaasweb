import axios from '@/libs/api.request'

export const healthEducation = {
  // 类型列表
  cateList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxGetCateLists',
      data,
      method: 'post'
    })
  },

  // 类型详情
  cateDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxGetCateInfo',
      data,
      method: 'post'
    })
  },

  // 保存类型
  cateSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxSaveCate',
      data,
      method: 'post'
    })
  },

  // 删除类型
  cateDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxDelCate',
      data,
      method: 'post'
    })
  },

  // 宣教分类
  getCate: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxGetXuanCate',
      data,
      method: 'post'
    })
  },

  // 宣教列表 - 上传图片
  uploadImg: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/uploadFileOne',
      data,
      method: 'post'
    })
  },

  // 宣教列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxGetXuanLists',
      data,
      method: 'post'
    })
  },

  // 宣教详情
  detail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxGetXuanInfo',
      data,
      method: 'post'
    })
  },

  // 保存宣教
  save: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxSaveXuanData',
      data,
      method: 'post'
    })
  },

  // 删除宣教
  delete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Xuan/ajaxDelXuan',
      data,
      method: 'post'
    })
  }
}
