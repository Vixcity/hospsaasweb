import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true,
      tag: 'graph',
      title: '数据看板'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '数据看板',
          notCache: true,
          icon: 'icon-shujukanban'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/treated',
    name: 'treated',
    component: Main,
    meta: {
      hideInBread: true,
      tag: 'appoint',
      title: '预约接诊'
    },
    children: [
      {
        path: 'treated',
        name: 'treated',
        meta: {
          icon: 'icon-yuyuejiezhen',
          title: '预约接诊'
        },
        component: () => import('@/view/treated/treated.vue')
      }
    ]
  },
  {
    path: '/patient',
    name: 'patient',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/patient/patient.vue')
  },
  {
    path: '/print',
    name: 'print',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/constitutionIdentification/print/print.vue')
  },
  {
    path: '/check',
    name: 'check',
    component: Main,
    meta: {
      hideInBread: true,
      tag: 'inspect',
      title: '检验检查'
    },
    children: [
      {
        path: 'check',
        name: 'check',
        meta: {
          icon: 'icon-jianyanjiancha',
          title: '检验检查'
        },
        component: () => import('@/view/check/check.vue')
      }
    ]
  },
  {
    path: '/desensitizationTreatment',
    name: 'desensitizationTreatment',
    meta: {
      icon: 'icon-tuominzhiliao',
      tag: 'tuomin',
      title: '脱敏治疗'
    },
    component: Main,
    children: [
      {
        path: 'hypodermicInjection',
        name: 'hypodermicInjection',
        meta: {
          tag: 'tuominpx',
          title: '皮下注射'
        },
        component: () =>
          import('@/view/desensitizationTreatment/hypodermicInjection/hypodermicInjection.vue')
      },
      {
        path: 'sublingual',
        name: 'sublingual',
        meta: {
          tag: 'tuominsx',
          title: '舌下脱敏'
        },
        component: () =>
          import('@/view/desensitizationTreatment/sublingual/sublingual.vue')
      },
      {
        path: 'zhenShuBuy',
        name: 'zhenShuBuy',
        meta: {
          title: '药品管理',
          tag: 'tuominzs'
        },
        component: () => import('@/view/desensitizationTreatment/zhenShuBuy/zhenShuBuy.vue')
      }
    ]
  },
  {
    path: '/outpatientPharmacy',
    name: 'outpatientPharmacy',
    meta: {
      hideInBread: true,
      tag: 'drugstore',
      title: '门诊药房'
    },
    component: Main,
    children: [
      {
        path: 'outpatientPharmacy',
        name: 'outpatientPharmacy',
        meta: {
          icon: 'icon-menzhenyaofang',
          title: '门诊药房'
        },
        component: () => import('@/view/outpatientPharmacy/outpatientPharmacy.vue')
      }
    ]
  },
  {
    path: '/settlementCenter',
    name: 'settlementCenter',
    meta: {
      hideInBread: true,
      tag: 'balance',
      title: '结算中心'
    },
    component: Main,
    children: [
      {
        path: 'settlementCenter',
        name: 'settlementCenter',
        meta: {
          icon: 'icon-jiesuanzhongxin',
          title: '结算中心'
        },
        component: () => import('@/view/settlementCenter/settlementCenter.vue')
      }
    ]
  },
  {
    path: '/constitutionIdentification',
    name: 'constitutionIdentification',
    component: Main,
    meta: {
      hideInBread: true,
      tag: 'phy',
      title: '体质辨识'
    },
    children: [
      {
        path: 'constitutionIdentification',
        name: 'constitutionIdentification',
        meta: {
          icon: 'icon-tizhibianshi',
          title: '体质辨识'
        },
        component: () => import('@/view/constitutionIdentification/constitutionIdentification.vue')
      }
    ]
  },
  {
    path: '/allpatient',
    name: 'allpatient',
    component: Main,
    meta: {
      hideInBread: true,
      tag: 'patient',
      title: '患者管理'
    },
    children: [
      {
        path: 'allpatient',
        name: 'allpatient',
        meta: {
          icon: 'icon-huanzheguanli',
          title: '患者管理'
        },
        component: () => import('@/view/allPatient/patient.vue')
      }
    ]
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/allPatient/detail.vue')
  },
  {
    path: '/specialistFollowUp',
    name: 'specialistFollowUp',
    meta: {
      icon: 'icon-zhuankesuifang',
      tag: 'follow',
      title: '专科随访'
    },
    component: Main,
    children: [
      {
        path: 'manualFollowUp',
        name: 'manualFollowUp',
        meta: {
          title: '人工随访',
          tag: 'followren'
        },
        component: () => import('@/view/specialistFollowUp/manualFollowUp/manualFollowUp.vue')
      },
      {
        path: 'AIFollowUp',
        name: 'AIFollowUp',
        meta: {
          title: 'AI随访',
          tag: 'followai'
        },
        component: () => import('@/view/specialistFollowUp/AIFollowUp/AIFollowUp.vue')
      },
      {
        path: 'EVAFollowUp',
        name: 'EVAFollowUp',
        meta: {
          title: '量表随访',
          tag: 'followeva'
        },
        component: () => import('@/view/specialistFollowUp/EVAFollowUp/EVAFollowUp.vue')
      },
      {
        path: 'followUpTemplate',
        name: 'followUpTemplate',
        meta: {
          title: '随访模板',
          tag: 'followtemp'
        },
        component: () => import('@/view/specialistFollowUp/followUpTemplate/followUpTemplate.vue')
      }
    ]
  },
  {
    path: '/healthEducation',
    name: 'healthEducation',
    meta: {
      hideInBread: true,
      tag: 'xuan',
      title: '健康宣教'
    },
    component: Main,
    children: [
      {
        path: 'healthEducation',
        name: 'healthEducation',
        meta: {
          icon: 'icon-jiankangxuanjiao',
          title: '健康宣教'
        },
        component: () => import('@/view/healthEducation/healthEducation.vue')
      }
    ]
  },
  {
    path: '/scientificData',
    name: 'scientificData',
    meta: {
      icon: 'icon-keyanshuju',
      tag: 'research',
      title: '科研数据'
    },
    component: Main,
    children: [
      {
        path: 'dataExport',
        name: 'dataExport',
        meta: {
          title: '数据导出',
          tag: 'daodata'
        },
        component: () => import('@/view/scientificData/dataExport/dataExport.vue')
      },
      {
        path: 'useMedicData',
        name: 'useMedicData',
        meta: {
          title: '用药数据',
          tag: 'drugdata'
        },
        component: () => import('@/view/scientificData/useMedicData/useMedicData.vue')
      },
      {
        path: 'assessmentData',
        name: 'assessmentData',
        meta: {
          title: '评估数据',
          tag: 'evadata'
        },
        component: () => import('@/view/scientificData/assessmentData/assessmentData.vue')
      },
      {
        path: 'testData',
        name: 'testData',
        meta: {
          title: '检测数据',
          tag: 'inspectdata'
        },
        component: () => import('@/view/scientificData/testData/testData.vue')
      },
      {
        path: 'lungFunctionData',
        name: 'lungFunctionData',
        meta: {
          title: '肺功能数据',
          tag: 'lungdata'
        },
        component: () => import('@/view/scientificData/lungFunctionData/lungFunctionData.vue')
      },
      {
        path: 'desensitizationData',
        name: 'desensitizationData',
        meta: {
          title: '脱敏数据',
          tag: 'tuomindata'
        },
        component: () => import('@/view/scientificData/desensitizationData/desensitizationData.vue')
      },
      {
        path: 'followUpData',
        name: 'followUpData',
        meta: {
          title: '随访数据',
          tag: 'followdata'
        },
        component: () => import('@/view/scientificData/followUpData/followUpData.vue')
      }
    ]
  },
  {
    path: '/templateSettings',
    name: 'templateSettings',
    meta: {
      icon: 'icon-mobanshezhi',
      tag: 'temp',
      title: '模板设置'
    },
    component: Main,
    children: [
      // {
      //   path: 'scaleEvaluation',
      //   name: 'scaleEvaluation',
      //   meta: {
      //     title: '量表评估',
      //     tag: "evatemp",
      //   },
      //   component: () => import('@/view/templateSettings/scaleEvaluation/scaleEvaluation.vue')
      // },
      {
        path: 'avoidingMedicalAdvice',
        name: 'avoidingMedicalAdvice',
        meta: {
          title: '规避医嘱',
          tag: 'evadetemp'
        },
        component: () =>
          import('@/view/templateSettings/avoidingMedicalAdvice/avoidingMedicalAdvice.vue')
      },
      {
        path: 'medicalRecordTemplate',
        name: 'medicalRecordTemplate',
        meta: {
          title: '病历模板',
          tag: 'casetemp'
        },
        component: () =>
          import('@/view/templateSettings/medicalRecordTemplate/medicalRecordTemplate.vue')
      }
    ]
  },
  {
    path: '/digitalDictionary',
    name: 'digitalDictionary',
    meta: {
      icon: 'icon-shujuzidian',
      tag: 'book',
      title: '数据字典'
    },
    component: Main,
    children: [
      {
        path: 'hospitalAreaManagement',
        name: 'hospitalAreaManagement',
        meta: {
          title: '院区管理',
          tag: 'yuanbook'
        },
        component: () =>
          import('@/view/digitalDictionary/hospitalAreaManagement/hospitalAreaManagement.vue')
      },
      {
        path: 'rosterCategory',
        name: 'rosterCategory',
        meta: {
          title: '排班类别',
          tag: 'typebook'
        },
        component: () => import('@/view/digitalDictionary/rosterCategory/rosterCategory.vue')
      },
      {
        path: 'departmentManagement',
        name: 'departmentManagement',
        meta: {
          title: '科室管理',
          tag: 'sectionbook'
        },
        component: () =>
          import('@/view/digitalDictionary/departmentManagement/departmentManagement.vue')
      },
      {
        path: 'titleManagement',
        name: 'titleManagement',
        meta: {
          title: '职称管理',
          tag: 'postitlebook'
        },
        component: () => import('@/view/digitalDictionary/titleManagement/titleManagement.vue')
      }
    ]
  },
  {
    path: '/payService',
    name: 'payService',
    meta: {
      icon: 'icon-shoufeixiangmu',
      tag: 'items',
      title: '收费项目'
    },
    component: Main,
    children: [
      {
        path: 'medicationOrder',
        name: 'medicationOrder',
        meta: {
          title: '用药医嘱',
          tag: 'drugitem'
        },
        component: () => import('@/view/payService/medicationOrder/medicationOrder.vue')
      },
      {
        path: 'inspectionItems',
        name: 'inspectionItems',
        meta: {
          title: '检验项目',
          tag: 'inspectitem'
        },
        component: () => import('@/view/payService/inspectionItems/inspectionItems.vue')
      },
      {
        path: 'desensitizingDrug',
        name: 'desensitizingDrug',
        meta: {
          title: '脱敏药物',
          tag: 'tuominitem'
        },
        component: () => import('@/view/payService/desensitizingDrug/desensitizingDrug.vue')
      }
    ]
  },
  {
    path: '/systemSetting',
    name: 'systemSetting',
    meta: {
      icon: 'icon-xitongshezhi',
      tag: 'system',
      title: '系统设置'
    },
    component: Main,
    children: [
      {
        path: 'cooperativeHospital',
        name: 'cooperativeHospital',
        meta: {
          title: '合作医院',
          tag: 'hospital'
        },
        component: () => import('@/view/systemSetting/cooperativeHospital/cooperativeHospital.vue')
      },
      {
        path: 'rolePermissions',
        name: 'rolePermissions',
        meta: {
          title: '角色权限',
          tag: 'authrole'
        },
        component: () => import('@/view/systemSetting/rolePermissions/rolePermissions.vue')
      },
      {
        path: 'authorityAccount',
        name: 'authorityAccount',
        meta: {
          title: '权限账户',
          tag: 'manage'
        },
        component: () => import('@/view/systemSetting/authorityAccount/authorityAccount.vue')
      },
      {
        path: 'doctorManagement',
        name: 'doctorManagement',
        meta: {
          title: '医生管理',
          tag: 'doctor'
        },
        component: () => import('@/view/systemSetting/doctorManagement/doctorManagement.vue')
      },
      {
        path: 'nurseManagement',
        name: 'nurseManagement',
        meta: {
          title: '护士管理',
          tag: 'nurse'
        },
        component: () => import('@/view/systemSetting/nurseManagement/nurseManagement.vue')
      },
      {
        path: 'workforceManagement',
        name: 'workforceManagement',
        meta: {
          title: '排班管理',
          tag: 'classes'
        },
        component: () => import('@/view/systemSetting/workforceManagement/workforceManagement.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
