import axios from '@/libs/api.request'

export const dataExport = {
  // 数据导出 - 初始化
  init: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxInitDataDao',
      data,
      method: 'post'
    })
  },

  // 导出条件
  export: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxPostDataDao',
      data,
      method: 'post'
    })
  }

  // 导出,直接调用接口,详情请看用药导出
  // exportExcel: param => {
  //   const data = param
  //   return axios.request({
  //     url: '/api/saas/Research/downloadFile',
  //     data,
  //     method: 'post'
  //   })
  // }
}

export const useMedic = {
  // 用药数据
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetDrugData',
      data,
      method: 'post'
    })
  }
}

export const pgData = {
  // 评估数据
  allList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetEvaLists',
      data,
      method: 'post'
    })
  },

  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetEvaData',
      data,
      method: 'post'
    })
  },

  // 查看明细
  detail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetEvaDetail',
      data,
      method: 'post'
    })
  },

  // 查看PDF
  viewPDF: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/reviewEvaPdf',
      data,
      method: 'post'
    })
  }
}

export const testData = {
  // 检测数据
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetInsData',
      data,
      method: 'post'
    })
  }
}

export const tuominData = {
  // 脱敏数据
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetTmData',
      data,
      method: 'post'
    })
  },

  // 单条数据导出
  export: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxExpTmData',
      data,
      method: 'post'
    })
  }
}

export const sfData = {
  // 随访数据
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/ajaxGetFollowData',
      data,
      method: 'post'
    })
  },

  // 查看PDF
  viewPDF: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Research/reviewFollowPdf',
      data,
      method: 'post'
    })
  }
}
