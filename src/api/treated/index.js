import axios from '@/libs/api.request'

export const treated = {
  // 预约接诊列表
  treatedList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Appoint/ajaxGetAppointLists',
      data,
      method: 'post'
    })
  },

  diagroomAccept: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxAcceptDiag',
      data,
      method: 'post'
    })
  },

  // 取消接诊
  cancel: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Appoint/ajaxCancelAppoint',
      data,
      method: 'post'
    })
  },

  // 全息视图列表
  patView: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatView',
      data,
      method: 'post'
    })
  },

  // 病历详情
  blView: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetCaseDetail',
      data,
      method: 'post'
    })
  },

  // 用药医嘱
  drugAdvice: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetDrugAdvice',
      data,
      method: 'post'
    })
  },

  // 健康宣教初始化
  xuanInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitXuan',
      data,
      method: 'post'
    })
  },

  // 根据类型获取文章列表
  getListByXuanType: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxGetXuanData',
      data,
      method: 'post'
    })
  },

  // 发送选择的宣教
  sendXuan: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSaveSendXuan',
      data,
      method: 'post'
    })
  },

  // 量表评估列表
  evalTrend: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetEvaluateTrend',
      data,
      method: 'post'
    })
  },

  // 健康档案详情
  jkdaDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatDangan',
      data,
      method: 'post'
    })
  },

  // 评估趋势
  evalData: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetEvaluateData',
      data,
      method: 'post'
    })
  },

  // 脱敏信息
  tuominInfo: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetTuominInfo',
      data,
      method: 'post'
    })
  },

  // 肺功能记录
  lungRec: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetLungRecord',
      data,
      method: 'post'
    })
  },

  // 舌下治疗方案
  sheRec: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetSheRecord',
      data,
      method: 'post'
    })
  },

  // 脱敏注射记录
  shotRecord: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetShotRecord',
      data,
      method: 'post'
    })
  },

  // 检查记录
  checkHist: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatInspect',
      data,
      method: 'post'
    })
  },

  // 随访记录
  fllowUpHist: param => {
    const data = param
    return axios.request({
      url: '/api/saas/patient/ajaxGetFollowRecord',
      data,
      method: 'post'
    })
  },

  // 填写病历 - 初始化
  writeBLInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitFillCase',
      data,
      method: 'post'
    })
  },

  // 保存病历
  saveBL: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSavePatCase',
      data,
      method: 'post'
    })
  },

  // 病历列表
  BLList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Patient/ajaxGetPatCase',
      data,
      method: 'post'
    })
  },

  // 保存病历模板
  saveBLTem: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSaveCaseTemp',
      data,
      method: 'post'
    })
  },

  // 量表列表
  LBList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitEvaluate',
      data,
      method: 'post'
    })
  },

  // 发送量表
  sendSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSaveSendEva',
      data,
      method: 'post'
    })
  },

  // 医生量表 - 获取题目
  getQuestion: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxGetEvaQuestion',
      data,
      method: 'post'
    })
  },

  // 医生量表 - 保存题目
  saveQuestion: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSaveEvaQuestion',
      data,
      method: 'post'
    })
  },

  // 填写医嘱
  // 初始化
  writeYZInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitPrescribe',
      data,
      method: 'post'
    })
  },

  // 搜索药物
  writeYZSearch: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSearchPrescribe',
      data,
      method: 'post'
    })
  },

  // 删除
  writeYZDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxDelPrescribe',
      data,
      method: 'post'
    })
  },

  // 退款
  writeYZRefund: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxRefundPrescribe',
      data,
      method: 'post'
    })
  },

  // 开单
  writeYZBilling: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxOpenPrescribe',
      data,
      method: 'post'
    })
  },

  // 外派开单初始化
  ajaxInitOutOpen: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitOutOpen',
      data,
      method: 'post'
    })
  },

  // 外派开单保存
  ajaxSaveOutOpen: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSaveOutOpen',
      data,
      method: 'post'
    })
  },

  // 检验检查
  // 初始化
  writeCheckInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitInspect',
      data,
      method: 'post'
    })
  },

  // 搜索项目
  writeCheckSearch: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSearchInspect',
      data,
      method: 'post'
    })
  },

  // 开单
  writeCheckBilling: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxOpenInspect',
      data,
      method: 'post'
    })
  },

  // 删除
  writeCheckDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxDelInspect',
      data,
      method: 'post'
    })
  },

  // 退款
  writeCheckRefund: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxRefundInspect',
      data,
      method: 'post'
    })
  },

  // 脱敏治疗
  // 初始化
  writeTMInit: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxInitTuomin',
      data,
      method: 'post'
    })
  },

  // 搜索药物
  writeTMSearch: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxSearchTuomin',
      data,
      method: 'post'
    })
  },

  // 删除
  writeTMDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxDelTuomin',
      data,
      method: 'post'
    })
  },

  // 退款
  writeTMRefund: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxRefundTuomin',
      data,
      method: 'post'
    })
  },

  // 开单
  writeTMBilling: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Diagroom/ajaxOpenTuomin',
      data,
      method: 'post'
    })
  }
}
