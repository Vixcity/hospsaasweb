<template>
  <div class="toBeSettled">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="患者名称" v-model="keyword" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="btn" @click="openEdit(row)">结 算</span>
      </template>
    </Table>
    <div class="pageWrapper">
      <Page
        :total="pageNum"
        :current="currentPageIdx"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        prev-text="上一页"
        next-text="下一页"
        show-sizer
        show-elevator
        show-total
      ></Page>
    </div>
    <el-dialog
      title="结算"
      :visible.sync="showEdit"
      width="520px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <div class="info black">
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
      <div class="flexFrom black">
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
        <Button type="primary" @click="payMoney" :loading="loadingPay">支 付</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settlementCenter } from '@/api/settlementCenter/index'
export default {
  name: 'toBeSettled',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      showEdit: false,
      loading: false,
      loadingPay: false,
      choosePeoele: {},
      columns: [
        {
          key: 'jzcard',
          title: '就诊卡号',
          minWidth: 120
        },
        {
          key: 'patname',
          title: '姓名',
          minWidth: 70
        },
        {
          key: 'sex',
          title: '性别',
          minWidth: 60
        },
        {
          key: 'age',
          title: '年龄',
          minWidth: 60
        },
        {
          key: 'docname',
          title: '接诊医生',
          minWidth: 90
        },
        {
          key: 'treattime',
          title: '就诊时间',
          width: 170
        },
        {
          key: 'price',
          title: '待收费用',
          minWidth: 90
        },
        {
          slot: 'action',
          title: '操作',
          width: 100,
          fixed: 'right'
        }
      ],
      tableData: [],
      pageSize: 10,
      keyword: '',
      preject: {},
      pay_way: '',
      pay_title: '',
      pay: false,
      ruleForm: {},
      pay_index: 0
    }
  },
  methods: {
    changePage () {},
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    openEdit (row) {
      settlementCenter
        .ajaxGetNoDetail({
          appointid: row.appointid
        })
        .then(res => {
          this.choosePeoele = res.data.info
          this.preject = res.data
          this.showEdit = true
        })
    },
    cancel () {
      this.showEdit = false
      this.pay_way = ''
      this.preject = {}
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
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    getList () {
      this.loading = true
      settlementCenter
        .toBeSettledList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          this.tableData = res.data.lists
          this.pageNum = res.data.total
          this.loading = false
        })
    },
    cancelPay (res) {
      this.$Message.success(res.msg)
      this.pay = false
      this.cancel()
      this.getList()
    },
    // 查询订单
    queryOrder () {
      if (this.pay_index < 10) {
        settlementCenter
          .queryOrder({
            jmstr: this.ruleForm.jmstr
          })
          .then(res => {
            if (res.data === 'success') {
              this.cancelPay(res)
              this.pay_index = 0
            } else {
              this.pay_index++
              this.queryOrder()
            }
          })
      } else {
        settlementCenter
          .cancelOrder({
            jmstr: this.ruleForm.jmstr
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.pay = false
            this.pay_index = 0
          })
      }
    },
    payMoney () {
      this.loadingPay = true
      if (this.pay_way === 'alipay') {
        settlementCenter
          .alipayOrder({
            jmstr: this.ruleForm.jmstr,
            authcode: this.ruleForm.authcode
          })
          .then(res => {
            this.cancelPay(res)
            this.loadingPay = false
          })
          .catch(() => {
            this.loadingPay = false
          })
      } else if (this.pay_way === 'wxpay') {
        settlementCenter
          .wxpayOrder({
            jmstr: this.ruleForm.jmstr,
            authcode: this.ruleForm.authcode
          })
          .then(res => {
            this.queryOrder()
            this.loadingPay = false
          })
          .catch(() => {
            this.loadingPay = false
          })
      } else if (this.pay_way === 'cash') {
        settlementCenter
          .cashpayOrder({
            jmstr: this.ruleForm.jmstr
          })
          .then(res => {
            this.cancelPay(res)
            this.loadingPay = false
          })
          .catch(() => {
            this.loadingPay = false
          })
      }
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../settlementCenter.less';
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
