import axios from '@/libs/api.request'

// 人工随访
export const manualFollowUp = {
  // 列表
  renList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetRenLists',
      data,
      method: 'post'
    })
  },

  // 随访记录
  sfjl: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetFollowRecord',
      data,
      method: 'post'
    })
  },

  // 开始随访 - 初始化
  startSFInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxStartPatientFollow',
      data,
      method: 'post'
    })
  },

  // 开始随访 - 下一步
  next: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxNextPatientFollow',
      data,
      method: 'post'
    })
  },

  // 开始随访 - 获取题库
  getTK: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetFollowQues',
      data,
      method: 'post'
    })
  },

  // 开始随访 - 保存
  save: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxSavePatientFollow',
      data,
      method: 'post'
    })
  }
}

// AI随访
export const ai = {
  // 随访计划列表
  planList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetPlanLists',
      data,
      method: 'post'
    })
  },

  // 计划编辑初始化
  editPlan: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxEditPlan',
      data,
      method: 'post'
    })
  },

  // 保存计划
  savePlan: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxSavePlan',
      data,
      method: 'post'
    })
  },

  // 删除计划
  deletePlan: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxDelPlan',
      data,
      method: 'post'
    })
  },

  // 随访记录列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetDataLists',
      data,
      method: 'post'
    })
  },

  // 随访记录 一键更新
  update: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxPlanOneClick',
      data,
      method: 'post'
    })
  },

  // 记录编辑
  edit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxEditPlanData',
      data,
      method: 'post'
    })
  },

  // 保存计划
  save: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxSavePlanData',
      data,
      method: 'post'
    })
  },

  // 记录列表
  delete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxDelPlanData',
      data,
      method: 'post'
    })
  },

  detail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetPlanDataInfo',
      data,
      method: 'post'
    })
  },

  detailList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetPlanDataLists',
      data,
      method: 'post'
    })
  },

  detailResult: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetPlanDataDetail',
      data,
      method: 'post'
    })
  }
}

// 量表随访
export const eva = {
  // 列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetEvaLists',
      data,
      method: 'post'
    })
  },

  // 编辑
  edit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxEditEva',
      data,
      method: 'post'
    })
  },

  // 保存
  save: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxSaveEva',
      data,
      method: 'post'
    })
  },

  // 删除
  del: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxDelEva',
      data,
      method: 'post'
    })
  },

  // 量表随访 - 一键更新
  update: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxEvaOneClick',
      data,
      method: 'post'
    })
  },

  // 基本信息
  getInfo: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetEvaDataInfo',
      data,
      method: 'post'
    })
  },

  // 查看结果
  detailResult: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetEvaDataDetail',
      data,
      method: 'post'
    })
  },

  // 详情列表
  detailList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetEvaDataLists',
      data,
      method: 'post'
    })
  }
}

// 随访模板
export const sfmb = {
  // 列表
  list: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxGetFollowLists',
      data,
      method: 'post'
    })
  },

  // 编辑初始化
  edit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxEditFollowData',
      data,
      method: 'post'
    })
  },

  // 保存
  save: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxSaveFollowData',
      data,
      method: 'post'
    })
  },

  // 删除计划
  delete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Follow/ajaxDelFollowData',
      data,
      method: 'post'
    })
  }
}
