import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
import { getToken, canTurnTo, setTitle } from '@/libs/util'

Vue.use(Router)

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

// push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// replace
Router.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'
const HOME_NAME = 'home'

const turnTo = (to, next) => {
  if (canTurnTo(to.name, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  let menuList = localStorage.showMenuList ? JSON.parse(localStorage.showMenuList) : ''
  let firstItem = localStorage.hasMenuList ? JSON.parse(localStorage.hasMenuList) : ''
  function firstIndex () {
    if (menuList[0].children.length > 1) {
      return menuList[0].children.findIndex(item => {
        return (
          item.meta.tag ===
          (firstItem[0].sub.length > 0 ? firstItem[0].sub[0].tag : firstItem[0].tag)
        )
      })
    } else {
      return 0
    }
  }
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    console.log(firstIndex)
    next({
      name: menuList[0].children[firstIndex()].name // 跳转到有权限的第一个页面页
    })
  } else if (token && to.name === HOME_NAME && menuList[0].children[0].name !== HOME_NAME) {
    // 已登录且要跳转的页面是首页
    // console.log(firstIndex())
    next({
      name: menuList[0].children[firstIndex()].name // 跳转到有权限的第一个页面页
    })
  } else {
    turnTo(to, next)
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
