// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Print from 'vue-print-nb'
import router from './router'
import store from './store'
import moment from 'moment'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import './variables.less'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* eslint-disable */
Vue.prototype.$moment = moment

Vue.use(iView)
Vue.use(Print)
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(ElementUI)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * @description 限制input输入框只能输入两位小数
 * @param {*} value
 * @returns
 * @example @input="value = $clearNoNum(value)"
 */
Vue.prototype.$clearNoNum = value => {
  value = value.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
  value = value.replace(/^\./g, '') //验证第一个字符是数字而不是字符
  value = value.replace(/\.{2,}/g, '.') //只保留第一个.清除多余的
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
  return value
}

/**
 * pef百分比计算
 * @param {*} pef pef值
 * @param {*} yjpef pef预计值
 * @returns 
 */
Vue.prototype.$percentage = function (pef, yjpef) {
  if (yjpef && yjpef != '-') {
    var num = Number(((Number(pef) / Number(yjpef)) * 100).toFixed(2))
    return {
      val: num + '%',
      color: num > 80 ? 'green' : num >= 60 && num <= 80 ? 'orange' : 'red'
    }
  } else {
    return {
      val: '-',
      color: '#000'
    }
  }
}

/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
