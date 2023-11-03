<template>
  <Layout style="height: 100%" class="main">
    <Header class="header-con">
      <header-bar>
        <div class="flex">
          <fullscreen v-model="isFullscreen" style="margin-right: 16px; color: white" />
          <div class="flex">
            <!-- <div style="color: white; cursor: pointer" class="leftLine" @click="loginOut">
              <i class="iconfont icon-tuichu" style="font-size: 22px"></i>
            </div> -->
            <div class="leftLine">
              <el-dropdown @command="handleCommand" class="logo-con curpor">
                <div class="logo-con curpor">
                  <img
                    v-show="!collapsed"
                    :src="avatar || '@/assets/images/avatar.png'"
                    key="max-logo"
                    style="width: 28px; height: 28px; border-radius: 16px"
                  />
                  <div v-show="!collapsed" style="color: white; margin-left: 10px; font-size: 14px">
                    {{ realname }}
                  </div>
                  <i class="iconfont icon-xiala" style="color: white; margin-left: 8px"></i>
                  <img v-show="collapsed" src="@/assets/images/avatar.png" key="min-logo" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="openEdit">修改密码</el-dropdown-item>
                  <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </header-bar>
      <el-dialog
        title="修改密码"
        :visible.sync="showEditPwd"
        width="420px"
        :show-close="false"
        :close-on-click-modal="false"
        class="vertical-center-modal"
      >
        <div class="flex">
          <span style="margin-right: 8px">
            <span style="color: #f75559">*</span>
            <span>旧密码</span>
          </span>
          <el-input placeholder="请输入旧密码" show-password v-model="oldPwd" style="width: 80%" />
        </div>
        <div class="flex">
          <span style="margin-right: 8px">
            <span style="color: #f75559">*</span>
            <span>新密码</span>
          </span>
          <el-input
            placeholder="请输入新密码"
            show-password
            v-model="newPwd"
            @input="getPwdPower"
            style="width: 80%"
          />
        </div>
        <div class="intensity">
          <div class="flex aic">
            <span class="psdText">密码强度</span>
            <span class="line" :class="[label.includes('弱') ? 'low' : '']"></span>
            <span class="line" :class="[label.includes('中') ? 'middle' : '']"></span>
            <span class="line" :class="[label.includes('强') ? 'high' : '']"></span>
            <span :class="[label.includes('弱') ? 'low' : '']" v-if="label.includes('弱')">弱</span>
            <span :class="[label.includes('中') ? 'middle' : '']" v-if="label.includes('中')">
              中
            </span>
            <span :class="[label.includes('强') ? 'high' : '']" v-if="label.includes('强')">
              强
            </span>
          </div>
          <div class="warningtext">密码应由6-20位数字、大小写字母、符号组成。请勿使用易猜密码</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <Button @click="showEditPwd = false">取 消</Button>
          <Button style="margin-left: 8px" type="primary" @click="changePwd">确 定</Button>
        </span>
      </el-dialog>
    </Header>
    <Layout style="height: calc(100vh - 70px)">
      <Sider
        hide-trigger
        collapsible
        :width="200"
        :collapsed-width="64"
        v-model="collapsed"
        class="left-sider"
        style="position: relative"
        :style="{ overflow: 'hidden' }"
      >
        <side-menu
          accordion
          ref="sideMenu"
          :active-name="activeName"
          :collapsed="collapsed"
          @on-select="turnToPage"
          :menu-list="menuList"
        >
          <!-- <template v-slot:bottom> -->
          <!-- 常规写法 -->
          <!-- <div
              style="
                position: absolute;
                cursor: pointer;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                border-top: 1px solid rgba(255, 255, 255, 0.5);
                background: #364971;
                width: 100%;
                text-align: center;
                z-index: 901
              "
              @click="handleCollapsedChange(!collapsed)"
            >
              <i
                class="iconfont icon-cebianshouqi"
                style="color: white; font-size: 24px"
                v-if="!collapsed"

              ></i>
              <i
                class="iconfont icon-cebianzhankai"
                style="color: white; font-size: 24px"
                v-else
              ></i>
            </div>
          </template> -->
        </side-menu>
        <!-- <div style="height: 49px"></div> -->
      </Sider>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <div
              :style="
                bgcolor
                  ? 'background: #f5f5fa;height: 100%;position:relative;overflow-y:auto'
                  : 'background: white;height: 100%;position:relative;overflow-y:auto'
              "
            >
              <keep-alive :include="cacheList">
                <router-view />
              </keep-alive>
              <ABackTop
                :height="100"
                :bottom="80"
                :right="50"
                container=".content-wrapper"
              ></ABackTop>
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import { common } from '@/api/index'
import { home } from '@/api/home/index'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
import siderTrigger from './components/header-bar/sider-trigger'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    ErrorStore,
    ABackTop,
    siderTrigger
  },
  data () {
    return {
      collapsed: false,
      showEditPwd: false,
      oldPwd: '',
      newPwd: '',
      avatar: '',
      realname: '',
      activeName: '',
      label: '',
      minLogo,
      maxLogo,
      menuList: [],
      isFullscreen: false,
      bgcolor: false
    }
  },
  computed: {
    ...mapGetters(['errorCount']),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    cacheList () {
      const list = [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
          : [])
      ]
      return list
    },
    // menuList () {
    //   // return this.$store.getters.menuList
    //   // return this.$store.state.app.menuList
    //   return this.getMenu()
    // },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions(['handleLogin']),
    handleCommand (e) {
      this[e]()
    },
    openEdit () {
      this.showEditPwd = true
    },
    // 获取密码强度
    getPwdPower (str) {
      // 第一步先判断各分类长度
      let num = 0 // 数字
      let lowerCase = 0 // 小写字母
      let upperCase = 0 // 大写字母
      let special = 0 // 特殊字符
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
        if (c >= 48 && c <= 57) {
          // 数字
          num++
        } else if (c >= 65 && c <= 90) {
          // 大写字母
          upperCase++
        } else if ((c = 97 && c <= 122)) {
          // 小写字母
          lowerCase++
        } else {
          special++
        }
      }
      // 第二步 计算分数
      let wholeMark = 0
      let numMark = 0
      let caseMark = 0
      let specialMark = 0
      let reward = 0
      // 整长度分数
      if (str.length <= 4) {
        wholeMark = 5
      } else if (str.length > 4 && str.length <= 8) {
        wholeMark = 10
      } else {
        wholeMark = 25
      }
      // 奖励分数
      if ((lowerCase || upperCase) && num) {
        reward = 2
        if (special) {
          reward = 3
          if (lowerCase && upperCase) {
            reward = 5
          }
        }
      }
      // 字母分数
      if (lowerCase || upperCase) {
        caseMark = 10
        if (lowerCase && upperCase) {
          caseMark = 20
        }
      }
      // 数字分数
      if (num) {
        numMark = 10
        if (num >= 3) {
          numMark = 20
        }
      }
      // 符号分数
      if (special) {
        specialMark = 10
        if (special > 1) {
          specialMark = 25
        }
      }
      let totalMark = wholeMark + numMark + caseMark + specialMark + reward
      if (totalMark < 25) {
        this.label = '非常弱'
      } else if (totalMark >= 25 && totalMark < 50) {
        this.label = '弱'
      } else if (totalMark >= 50 && totalMark < 60) {
        this.label = '中等'
      } else if (totalMark >= 60 && totalMark < 70) {
        this.label = '强'
      } else if (totalMark >= 70 && totalMark < 80) {
        this.label = '非常强'
      } else if (totalMark >= 86 && totalMark < 90) {
        this.label = '安全强'
      } else {
        this.label = '非常安全强'
      }
    },
    changePwd () {
      if (this.newPwd.length < 6 || this.newPwd.length > 20) {
        this.$Message.error('密码长度为6到20位')
        return
      }
      if (this.oldPwd === '' || this.newPwd === '') {
        this.$Message.error('旧密码和新密码不能为空')
        return
      }

      common
        .editPwd({
          oldpwd: this.oldPwd,
          newpwd: this.newPwd
        })
        .then(res => {
          this.showEditPwd = false
          this.$Message.success('修改成功,请重新登录')
          localStorage.token = ''
          localStorage.tagNaveList = ''
          localStorage.showMenuList = ''
          localStorage.hasMenuList = ''
          this.$router.push('/login')
        })
    },
    loginOut () {
      this.$confirm('确认是否退出?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        localStorage.token = ''
        localStorage.tagNaveList = ''
        localStorage.showMenuList = ''
        localStorage.hasMenuList = ''
        this.$router.push('/login')
        this.$Message.success('退出成功')
      })
    },
    getMenu () {
      // if (JSON.parse(localStorage.userInfo).realname === '数智医济') {
      //   let allMenuList = this.$store.getters.menuList
      //   allMenuList.forEach(item => {
      //     item.meta.show = true
      //     if (item.children.length > 1) {
      //       item.children.forEach(itemChild => {
      //         itemChild.meta.show = true
      //       })
      //     }
      //   })

      //   this.menuList = allMenuList
      //   localStorage.showMenuList = JSON.stringify(allMenuList)
      //   return
      // }
      home.menuList().then(res => {
        let allMenuList = this.$store.getters.menuList
        allMenuList.forEach(item => {
          item.meta.show = false
          if (item.children.length > 1) {
            item.children.forEach(itemChild => {
              itemChild.meta.show = false
            })
          }
        })
        let roleMenuList = res.data
        roleMenuList.forEach(item => {
          allMenuList.forEach(itemMenu => {
            if (itemMenu.meta.tag === item.tag) {
              itemMenu.meta.show = true
              if (item.sub.length > 0) {
                item.sub.forEach(itemSub => {
                  itemMenu.children.forEach(itemChild => {
                    if (itemSub.tag === itemChild.meta.tag) {
                      itemChild.meta.show = true
                    }
                  })
                })
              }
            }
          })
        })
        this.menuList = allMenuList
        localStorage.showMenuList = JSON.stringify(this.menuList.filter(item => item.meta.show))
        localStorage.hasMenuList = JSON.stringify(res.data.reverse())
      })
    },
    turnToPage (route) {
      let { name, params, query, meta } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
        meta = route.meta
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query,
        meta
      })
      this.activeName = name
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      // console.log(newRoute.name)
      this.bgcolor = newRoute.name === 'home'
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.userInfo)
    this.avatar = userInfo.avatar
    this.realname = userInfo.realname
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    this.bgcolor = this.$route.name === 'home'
  },
  created () {
    this.getMenu()
  }
}
</script>
