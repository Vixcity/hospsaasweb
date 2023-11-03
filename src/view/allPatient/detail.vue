<template>
  <div style="background-color: #fff; overflow-y: auto; height: 100%">
    <Layout class="main">
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
                    <div
                      v-show="!collapsed"
                      style="color: white; margin-left: 10px; font-size: 14px"
                    >
                      {{ realname }}
                    </div>
                    <i class="iconfont icon-xiala" style="color: white; margin-left: 8px"></i>
                    <img v-show="collapsed" src="@/assets/images/avatar.png" key="min-logo" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="openEditPwd">修改密码</el-dropdown-item>
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
            <el-input
              placeholder="请输入旧密码"
              show-password
              v-model="oldPwd"
              style="width: 80%"
            />
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
              <span :class="[label.includes('弱') ? 'low' : '']" v-if="label.includes('弱')">
                弱
              </span>
              <span :class="[label.includes('中') ? 'middle' : '']" v-if="label.includes('中')">
                中
              </span>
              <span :class="[label.includes('强') ? 'high' : '']" v-if="label.includes('强')">
                强
              </span>
            </div>
            <div class="warningtext">
              密码应由6-20位数字、大小写字母、符号组成。请勿使用易猜密码
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <Button @click="showEditPwd = false">取 消</Button>
            <Button style="margin-left: 8px" type="primary" @click="changePwd">确 定</Button>
          </span>
        </el-dialog>
      </Header>
    </Layout>
    <div class="patient_detail">
      <div class="patient_detail_head">
        <div class="patient_detail_head_left">{{ patInfo.patname }}</div>
        <div class="patient_detail_head_right">
          <Button style="margin-right: 8px" @click="$router.go(-1)">关 闭</Button>
        </div>
      </div>
      <div class="line"></div>
      <div class="flex jcc">
        <div class="patient_detail_list">
          <div
            class="patient_detail_list_item"
            v-for="(item, i) in arrList"
            :key="i"
            @click="handleSelect(item.value)"
          >
            <img
              v-if="index == item.value"
              :src="require(`@/assets/images/patient/patient_detail_active_${i + 1}.png`)"
              alt=""
            />
            <img
              v-else
              :src="require(`@/assets/images/patient/patient_detail_${i + 1}.png`)"
              alt=""
            />
            <div :class="index == item.value ? 'patient_detail_list_item_active' : ''">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="patient_detail_cont">
        <QXST v-if="index == 'qxst'"></QXST>
        <JKDA v-if="index == 'jkda'"></JKDA>
        <HZBL v-if="index == 'hzbl'"></HZBL>
        <TMXX v-if="index == 'tmxx'" :name="patInfo.patname"></TMXX>
        <LBJL v-if="index == 'lbjl'"></LBJL>
        <JYJC v-if="index == 'jyjc'"></JYJC>
        <SFJL v-if="index == 'sfjl'"></SFJL>
      </div>
    </div>
  </div>
</template>

<script>
import { common } from '@/api/index'
import HeaderBar from '_c/main/components/header-bar'
import Fullscreen from '_c/main/components/fullscreen'
import QXST from './components/qxst'
import JKDA from './components/jkda'
import HZBL from './components/hzbl'
import TMXX from './components/tmxx'
import LBJL from './components/lbjl'
import JYJC from './components/jyjc'
import SFJL from './components/sfjl'
export default {
  name: 'detail',
  data () {
    return {
      isFullscreen: false,
      collapsed: false,
      showEditPwd: false,
      patid: this.$route.query.patid,
      patInfo: {},
      index: 'qxst',
      label: '',
      newPwd: '',
      oldPwd: '',
      avatar: '',
      realname: '',
      arrList: [
        {
          title: '全息视图',
          value: 'qxst'
        },
        {
          title: '健康档案',
          value: 'jkda'
        },
        {
          title: '患者病历',
          value: 'hzbl'
        },
        {
          title: '脱敏信息',
          value: 'tmxx'
        },
        {
          title: '量表记录',
          value: 'lbjl'
        },
        {
          title: '检验检查',
          value: 'jyjc'
        },
        {
          title: '随访记录',
          value: 'sfjl'
        }
      ]
    }
  },
  components: {
    HeaderBar,
    Fullscreen,
    QXST,
    JKDA,
    HZBL,
    TMXX,
    LBJL,
    JYJC,
    SFJL
  },
  methods: {
    handleSelect (value) {
      if (this.index === value) return
      this.index = value
    },
    getDetail () {
      common
        .patientInfo({
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.patInfo = data
        })
    },
    handleCommand (e) {
      this[e]()
    },
    openEditPwd () {
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
    }
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.userInfo)
    this.avatar = userInfo.avatar
    this.realname = userInfo.realname
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
.patient_detail {
  .patient_detail_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    box-sizing: border-box;
    .patient_detail_head_left {
      font-size: 16px;
      font-weight: 500;
      color: #282d3c;
      line-height: 17px;
      margin-right: 20px;
    }
    .patient_detail_head_right {
      font-size: 14px;
      font-weight: 400;
      color: #3171ff;
      line-height: 20px;
      cursor: pointer;
    }
  }
  .line {
    width: 100%;
    height: 8px;
    background-color: #f5f5fa;
  }
  .patient_detail_cont {
    padding: 16px 20px 50px;
    max-width: 1460px;
    margin: 0 auto;
  }
  .patient_detail_list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 0;
    width: 788px;
    .patient_detail_list_item {
      text-align: center;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      img {
        width: 48px;
        height: 48px;
      }
      div {
        font-size: 14px;
        font-weight: 400;
        color: #282d3c;
        line-height: 20px;
        margin-top: 4px;
      }
      .patient_detail_list_item_active {
        color: #3171ff !important;
      }
    }
  }
}
</style>
