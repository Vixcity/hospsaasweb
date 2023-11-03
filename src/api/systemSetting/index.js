import axios from '@/libs/api.request'

export const systemSetting = {
  // 角色权限列表
  roleList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetRoleList',
      data,
      method: 'post'
    })
  },

  // 角色权限详情
  roleDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxEditRoleData',
      data,
      method: 'post'
    })
  },

  // 角色权限保存
  roleSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxSaveRoleData',
      data,
      method: 'post'
    })
  },

  // 角色权限删除
  roleDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxDelRoleData',
      data,
      method: 'post'
    })
  },

  // 权限账号列表
  userList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetAdminList',
      data,
      method: 'post'
    })
  },

  // 权限账号详情
  userDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxEditAdminData',
      data,
      method: 'post'
    })
  },

  // 获取医院
  getHospital: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetHospData',
      data,
      method: 'post'
    })
  },

  // 根据医院获取角色
  getRoleByHospital: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetRoleByHosp',
      data,
      method: 'post'
    })
  },

  // 权限账号保存
  userSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxSaveAdminData',
      data,
      method: 'post'
    })
  },

  // 权限账号删除
  userDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxDelAdminData',
      data,
      method: 'post'
    })
  },

  // 权限账号 - 重置密码
  userResetPwd: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxResetAdminPwd',
      data,
      method: 'post'
    })
  },

  // 合作医院列表
  hospList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Hospital/ajaxGetHosp',
      data,
      method: 'post'
    })
  },

  // 合作医院详情
  hospDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Hospital/ajaxEditHosp',
      data,
      method: 'post'
    })
  },

  // 合作医院保存
  hospSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Hospital/ajaxSaveHosp',
      data,
      method: 'post'
    })
  },

  // 合作医院删除
  hospDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Hospital/ajaxDelHosp',
      data,
      method: 'post'
    })
  },

  // 医生账号列表
  docList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetDoctorList',
      data,
      method: 'post'
    })
  },

  // 医生账号详情
  docDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxEditDoctorData',
      data,
      method: 'post'
    })
  },

  // 医生账号保存
  docSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxSaveDoctorData',
      data,
      method: 'post'
    })
  },

  // 医生账号删除
  docDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxDelDoctorData',
      data,
      method: 'post'
    })
  },

  // 护士账号列表
  nurseList: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxGetNurseList',
      data,
      method: 'post'
    })
  },

  // 护士账号详情
  nurseDetail: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxEditNurseData',
      data,
      method: 'post'
    })
  },

  // 护士账号保存
  nurseSave: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxSaveNurseData',
      data,
      method: 'post'
    })
  },

  // 护士账号删除
  nurseDelete: param => {
    const data = param
    return axios.request({
      url: '/api/saas/Auth/ajaxDelNurseData',
      data,
      method: 'post'
    })
  }
}
