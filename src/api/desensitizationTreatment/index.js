import axios from '@/libs/api.request'

export const pxzs = {
  // 皮下注射
  // 列表 - 待执行
  // 脱敏注射记录
  shotRecord: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetShotRecord',
      data,
      method: 'post'
    })
  },

  willDoList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetTuominLists',
      data,
      method: 'post'
    })
  },

  willDoInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxInitCarryOut',
      data,
      method: 'post'
    })
  },

  willDoSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveCarryOut',
      data,
      method: 'post'
    })
  },

  // 轮询得到PEF之前的准备
  // 开始检测：参数：projectid/脱敏数据ID
  renewTime: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/renewTime',
      data,
      method: 'post'
    })
  },

  // 轮询得到PEF之前的准备
  // 肺功能仪 - 轮询获取数据：参数：projectid/脱敏数据ID
  getLungs: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/getLungs',
      data,
      method: 'post'
    })
  },

  // 肺功能仪 - 绑定设备 - 初始化：参数：projectid/脱敏数据ID
  initBind: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/initBind',
      data,
      method: 'post'
    })
  },

  // 肺功能仪 - 保存设备：projectid/脱敏数据ID，deviceno/设备号
  saveBind: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/saveBind',
      data,
      method: 'post'
    })
  },

  // 保存针数
  // 参数：
  // tuominid => 列表数据ID
  // type => add-增加，dec-减少
  // num => 增加或扣减的数量
  saveZS: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveTuominZhen',
      data,
      method: 'post'
    })
  },

  // 保存脱落
  saveDrop: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveTuominDrop',
      data,
      method: 'post'
    })
  },

  // 列表 - 已脱落
  dropList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetDropLists',
      data,
      method: 'post'
    })
  },

  // 列表 - 留观中
  duringDoList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetKeepLists',
      data,
      method: 'post'
    })
  },

  duringDoInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxInitFinish',
      data,
      method: 'post'
    })
  },

  duringDoSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveFinish',
      data,
      method: 'post'
    })
  },

  // 列表 - 已完成
  finishedDoList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetFinishLists',
      data,
      method: 'post'
    })
  },

  finishedDoInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxEditFinishData',
      data,
      method: 'post'
    })
  },

  finishedDoSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveFinishData',
      data,
      method: 'post'
    })
  },

  // 舌下
  sxList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetTuominShe',
      data,
      method: 'post'
    })
  },

  // 保存脱落
  // saveDrop: param => {
  //   const data = param
  //   return axios.request({
  //     url: '/api/saas/Tuomin/ajaxSaveTuominDrop',
  //     data,
  //     method: 'post'
  //   })
  // },

  // 列表 - 已脱落
  sxDropList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxGetDropShe',
      data,
      method: 'post'
    })
  },

  // 列表 - 编辑 - 初始化
  sxInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxEditSheData',
      data,
      method: 'post'
    })
  },

  // 列表 - 编辑 - 保存
  sxSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveSheData',
      data,
      method: 'post'
    })
  },

  // 列表 - 编辑 - 保存
  tzSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Tuomin/ajaxSaveTuominRefund',
      data,
      method: 'post'
    })
  }
}
