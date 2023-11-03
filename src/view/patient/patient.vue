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
    <div class="patient">
      <div class="patient_head">
        <div class="patient_head_left">
          <p>{{ patInfo.patname }}</p>
          <div>
            就诊卡号:
            <span>{{ patInfo.jzcard }}</span>
          </div>
          <div>
            年龄:
            <span>{{ patInfo.age }}</span>
          </div>
          <div>
            性别:
            <span>{{ patInfo.sex }}</span>
          </div>
          <div>
            出生日期:
            <span>{{ patInfo.birthday }}</span>
          </div>
        </div>
        <div class="patient_head_right">
          <Button type="primary" style="margin-right: 8px" @click="openEdit">诊间结算</Button>
          <div class="btnComplete" @click="confirm">就诊完成</div>
          <!-- <Button style="margin-right: 8px" type="primary" ghost @click="openEdit()">
            诊间结算
          </Button> -->
          <!-- <Button style="margin-right: 8px" type="primary" @click="confirm">就诊完成</Button> -->
          <Button @click="goBack">关 闭</Button>
        </div>
      </div>
      <div class="line"></div>
      <div class="flex jcc">
        <div class="patient_list">
          <div
            class="patient_list_item"
            v-for="(item, i) in arrList"
            :key="i"
            @click="handleSelect(item.value)"
          >
            <img
              v-if="index == item.value"
              :src="require(`@/assets/images/patient/patient_active${i + 1}.png`)"
              alt=""
            />
            <img v-else :src="require(`@/assets/images/patient/patient${i + 1}.png`)" alt="" />
            <div :class="index == item.value ? 'patient_list_item_active' : ''">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="patient_cont">
        <QXST v-if="index == 'qxst'" ref="qxst"></QXST>
        <TXBL v-if="index == 'txbl'" ref="txbl" :patInfo="patInfo"></TXBL>
        <LBPG v-if="index == 'lbpg'" ref="lbpg"></LBPG>
        <TXYZ v-if="index == 'txyz'" ref="txyz"></TXYZ>
        <JYJC v-if="index == 'jyjc'" ref="jyjc"></JYJC>
        <TMZL v-if="index == 'tmzl'" ref="tmzl"></TMZL>
        <JKXJ v-if="index == 'jkxj'" ref="jkxj"></JKXJ>
      </div>
    </div>
    <el-dialog
      title="结算"
      :visible.sync="showEdit"
      width="520px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <div class="info">
        <div class="flex">
          <div style="width: 44%">姓名：{{ choosePeoele.patname }}</div>
          <div style="width: 44%">性别：{{ choosePeoele.sex }}</div>
          <div style="width: 12%">年龄：{{ choosePeoele.age }}</div>
        </div>
        <div class="flex" style="margin-top: 4px">
          <div style="width: 44%">就诊卡号：{{ choosePeoele.jzcard }}</div>
          <div style="width: 56%">临床诊断：{{ choosePeoele.diagnose }}</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="flexFrom">
        <div style="width: 25%; font-size: 20px">Rp</div>
        <div class="from_right">
          <div class="from_right_item" v-for="(item, index) in preject.lists" :key="index">
            <div class="from_right_item_txt">{{ item.name }}</div>
            <div class="from_right_item_txt">{{ item.price || 0 }}元</div>
          </div>
          <div class="from_right_item">
            <div class="from_right_item_txt"></div>
            <div class="from_right_item_txt">
              合计：
              <span style="font-weight: 700">{{ preject.total }}元</span>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="gray" style="font-size: 14px">支付方式</div>
      <div class="flex jcsb" style="margin-top: 10px">
        <div
          class="payWay"
          :class="pay_way === item.type ? 'active' : ''"
          @click="pay_way = item.type"
          v-for="(item, index) in preject.paymode"
          :key="index"
        >
          <i
            v-if="item.type === 'alipay'"
            class="iconfont icon-zhifubao"
            style="color: #008cf1"
          ></i>
          <i v-if="item.type === 'wxpay'" class="iconfont icon-weixin" style="color: #28c445"></i>
          <i v-if="item.type === 'cash'" class="iconfont icon-xianjin" style="color: #ffbd38"></i>
          {{ item.name }}
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">确认支付</Button>
      </div>
    </el-dialog>
    <el-dialog
      :title="pay_title"
      :visible.sync="pay"
      width="520px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :label-width="100">
        <FormItem label="订单名称: " prop="ordertit">
          <Input v-model="ruleForm.ordertit" placeholder="请输入订单名称" disabled></Input>
        </FormItem>
        <FormItem v-if="pay_way === 'alipay'" label="商户订单号: " prop="ordersn">
          <Input v-model="ruleForm.ordersn" placeholder="请输入商户订单号" disabled></Input>
        </FormItem>
        <FormItem label="支付金额: " prop="payfee">
          <Input v-model="ruleForm.payfee" placeholder="请输入支付金额" disabled></Input>
        </FormItem>
        <FormItem
          v-if="pay_way === 'alipay' || pay_way === 'wxpay'"
          :label="pay_way === 'alipay' ? '付款条码: ' : pay_way === 'wxpay' ? '授权码: ' : ''"
          prop="authcode"
        >
          <Input
            id="authcode"
            ref="authcode"
            v-model="ruleForm.authcode"
            placeholder="请输入付款条码"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="payMoney" :loading="loadingEdit">支 付</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { common } from '@/api/index'
import { settlementCenter } from '@/api/settlementCenter/index'
import HeaderBar from '_c/main/components/header-bar'
import Fullscreen from '_c/main/components/fullscreen'
import QXST from './components/qxst'
import TXBL from './components/txbl'
import LBPG from './components/lbpg'
import TXYZ from './components/txyz'
import JYJC from './components/jyjc'
import TMZL from './components/tmzl'
import JKXJ from './components/jkxj'
export default {
  name: 'patient',
  data () {
    return {
      isFullscreen: false,
      pay: false,
      showEdit: false,
      collapsed: false,
      showEditPwd: false,
      loadingEdit: false,
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      label: '',
      oldPwd: '',
      newPwd: '',
      pay_way: '',
      pay_title: '',
      preject: {},
      choosePeoele: {},
      ruleForm: {},
      index: 'qxst',
      avatar: '',
      realname: '',
      patInfo: {},
      arrList: [
        {
          title: '全息视图',
          value: 'qxst'
        },
        {
          title: '填写病历',
          value: 'txbl'
        },
        {
          title: '量表评估',
          value: 'lbpg'
        },
        {
          title: '填写医嘱',
          value: 'txyz'
        },
        {
          title: '检验检查',
          value: 'jyjc'
        },
        {
          title: '脱敏治疗',
          value: 'tmzl'
        },
        {
          title: '健康宣教',
          value: 'jkxj'
        }
      ]
    }
  },
  components: {
    HeaderBar,
    Fullscreen,
    QXST,
    TXBL,
    LBPG,
    TXYZ,
    JYJC,
    TMZL,
    JKXJ
  },
  methods: {
    handleSelect (value) {
      if (this.index === value) return
      this.index = value
    },
    goBack () {
      this.$router.go(-1)
      localStorage.patientTxbl = ''
      localStorage.patientTxyz = ''
      localStorage.patientJyjc = ''
      localStorage.patientTmzl = ''
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

      this.loadingEdit = true

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
          this.loadingEdit = false
        })
        .catch(() => {
          this.loadingEdit = false
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
    openEdit () {
      settlementCenter
        .ajaxGetNoDetail({
          appointid: this.appointid
        })
        .then(res => {
          this.choosePeoele = res.data.info
          this.preject = res.data
          this.showEdit = true
        })
    },
    payMoney () {
      this.loadingEdit = true
      if (this.pay_way === 'alipay') {
        settlementCenter
          .alipayOrder({
            jmstr: this.ruleForm.jmstr,
            authcode: this.ruleForm.authcode
          })
          .then(res => {
            this.cancelPay(res)
            this.loadingEdit = false
          })
          .catch(() => {
            this.loadingEdit = false
          })
      } else if (this.pay_way === 'wxpay') {
        settlementCenter
          .wxpayOrder({
            jmstr: this.ruleForm.jmstr,
            authcode: this.ruleForm.authcode
          })
          .then(res => {
            this.queryOrder()
            this.loadingEdit = false
          })
          .catch(() => {
            this.loadingEdit = false
          })
      } else if (this.pay_way === 'cash') {
        settlementCenter
          .cashpayOrder({
            jmstr: this.ruleForm.jmstr
          })
          .then(res => {
            this.cancelPay(res)
            this.loadingEdit = false
          })
          .catch(() => {
            this.loadingEdit = false
          })
      }
    },
    saveEdit () {
      if (this.pay_way === '') {
        this.$Message.error('请选择支付方式')
        return
      }
      settlementCenter
        .ajaxCreateOrder({
          paytype: this.pay_way,
          jmdata: this.preject.jmdata
        })
        .then(res => {
          this.pay_title =
            this.pay_way === 'alipay'
              ? '支付宝支付'
              : this.pay_way === 'wxpay'
                ? '微信支付'
                : this.pay_way === 'cash'
                  ? '现金支付'
                  : '支付'
          this.ruleForm = res.data
          this.pay = true
          if (this.pay_way === 'alipay' || this.pay_way === 'wxpay') {
            this.$nextTick(() => {
              this.$refs.authcode.focus()
              document.querySelector('#authcode .ivu-input').select()
            })
          }
        })
    },
    cancel () {
      this.showEdit = false
      this.pay_way = ''
      this.preject = {}
    },
    cancelPay (res) {
      this.$Message.success(res.msg)
      this.pay = false
      this.cancel()
      if (this.index !== 'txbl') {
        if (this.index === 'qxst') {
          this.$refs[this.index].getData()
        }
        this.$refs[this.index].getList()
      }
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
    confirm () {
      this.$confirm('是否确认完成就诊?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        common
          .ajaxConfirmFinish({
            appointid: this.appointid
          })
          .then(res => {
            this.$Message.success('就诊完成')
            this.goBack()
          })
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
.patient {
  .patient_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    box-sizing: border-box;
    .patient_head_left {
      display: flex;
      align-items: center;
      p {
        font-size: 16px;
        font-weight: 500;
        color: #282d3c;
        line-height: 17px;
      }
      div {
        font-size: 14px;
        font-weight: 400;
        color: #969baa;
        line-height: 17px;
        margin-left: 20px;
        span {
          color: #282d3c;
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 8px;
    background-color: #f5f5fa;
    border: none;
  }
  .patient_cont {
    padding: 16px 20px 50px;
    max-width: 1460px;
    margin: 0 auto;
  }
  .patient_list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 0;
    width: 788px;
    .patient_list_item {
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
      .patient_list_item_active {
        color: #3171ff !important;
      }
    }
  }
}
.flexFrom {
  display: flex;
  justify-content: space-between;
  &:first-child {
    margin-top: 0;
  }
  .fromItem {
    .itemLabel {
      text-align: right;
      padding-right: 8px;
    }
    .itemContent {
      width: 236px;
      height: 32px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.info {
  font-size: 14px;
}
.line {
  border-bottom: 1px solid #d2d7e1;
  margin: 16px 0;
}
.payWay {
  width: 156px;
  height: 64px;
  border-radius: 4px;
  border: 1px solid #d2d7e1;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .iconfont {
    font-size: 32px;
    margin-right: 8px;
  }
  &.active {
    border-color: #3171ff;
    background-color: rgba(49, 113, 255, 0.1);
  }
}

.btnComplete {
  padding: 6px 15px;
  border: 1px solid #3171ff;
  color: #3171ff;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  user-select: none;
  cursor: pointer;
  background: #dee8ff;
  transform: translateY(1px);
  margin-right: 8px;
  transition: all 0.2s linear;
  &:hover {
    color: white;
    background: #3171ff;
  }
}

.from_right {
  flex: 1;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .from_right_item {
    width: 100%;
    display: flex;
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
    .from_right_item_txt {
      width: 50%;
    }
  }
}
</style>
