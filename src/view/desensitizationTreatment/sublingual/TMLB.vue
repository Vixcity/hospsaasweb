<template>
  <div class="tmlb">
    <div class="filterCtn">
      <div class="itemFather">
        <!-- <div class="filterItem">
          <div class="label">检验项目</div>
          <div>
            <Select style="width: 180px">
              <Option v-for="(item, index) in jcList" :value="item" :key="index + 'jcList'">
                {{ item }}
              </Option>
            </Select>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">剩余针数</div>
          <div>
            <Select v-model="synum" style="width: 160px">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
              <Option value="0">0</Option>
            </Select>
          </div>
        </div>
        <!-- <div class="filterItem">
          <div class="label">时间</div>
          <div>
            <DatePicker
              :editable="false"
              type="daterange"
              v-model="chooseDate"
              :transfer="true"
              :options="dateList"
              placement="bottom-end"
              placeholder="请选择就诊时间"
            ></DatePicker>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">预约时间</div>
          <div>
            <DatePicker
              :editable="false"
              v-model="yydate"
              :transfer="true"
              placeholder="请选择预约时间"
            ></DatePicker>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="患者姓名/项目名称" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">新增患者</Button>
          <Button type="primary" @click="getYYXQ">预约详情</Button>
          <Button type="primary">导 入</Button>
          <Button type="primary">导 出</Button>
        </div>
      </div>
    </div> -->
    <Table
      v-loading="loading"
      :row-class-name="rowClassName"
      :columns="columns"
      :data="tableData"
      style="margin-top: 16px"
    >
      <template #isdrop="{ row }">
        <span>{{ row.isdrop === 'Y' ? '是' : '否' }}</span>
      </template>
      <template #synum="{ row }">
        <span v-if="row.synum < 2" class="red">{{ row.synum }}</span>
        <span v-else>{{ row.synum }}</span>
      </template>
      <template #action="{ row }">
        <span class="btn" @click="doZS(row)">编辑</span>
        <span class="btn blue" @click="getDetail(row)">详情</span>
        <span class="btn blue" @click="tuoluo(row)">脱落</span>
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
      title="舌下脱敏编辑"
      :visible.sync="showZS"
      width="400px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">初次治疗日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.zsdate"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.zsdate = $event"
                placeholder="请选择初次治疗日期"
                disabled
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">治疗瓶号</div>
            <div class="itemContent">
              <Select
                v-model="chooseZSJL.zsnum"
                @on-change="changezsnum"
                placeholder="请选择治疗瓶号"
                style="width: 100%"
              >
                <Option
                  v-for="(item, index) in chooseZSJL.option"
                  :key="index + 'chooseZSJL.option'"
                  :value="item.num"
                  :label="item.num"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">治疗剂量(ml)</div>
            <div class="itemContent">
              <Select
                v-model="chooseZSJL.zsdose"
                ref="zsdose"
                :clearable="true"
                not-found-text="请先选择治疗瓶号"
                placeholder="请选择治疗剂量"
                style="width: 100%"
              >
                <Option
                  v-for="(item, index) in doseList"
                  :key="index + 'doseList'"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">复诊日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.visitdate"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.visitdate = $event"
                :clearable="false"
                placeholder="请选择复诊日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="finishZS" :loading="loadingSubmit">提 交</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="脱落原因"
      :visible.sync="showAdd"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :label-width="100">
        <FormItem label="脱落原因" prop="title">
          <Input
            v-model="ruleForm.dropmark"
            type="textarea"
            :rows="4"
            placeholder="请输入脱落原因"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingQD">确 定</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pxzs } from '@/api/desensitizationTreatment/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'tmlb',
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns = showjzno === 'Y' ? [
      {
        key: 'jzcard',
        title: '就诊卡号',
        minWidth: 120
      },
      {
        key: 'jzno',
        title: '编号',
        minWidth: 120
      },
      {
        key: 'realname',
        title: '姓名',
        minWidth: 80
      },
      {
        key: 'gender',
        title: '性别',
        minWidth: 80
      },
      {
        key: 'age',
        title: '年龄',
        minWidth: 80
      },
      {
        key: 'zsnum',
        title: '治疗瓶号',
        minWidth: 100
      },
      {
        key: 'zsdose',
        title: '治疗剂量（ml）',
        minWidth: 130
      },
      {
        key: 'medicine',
        title: '脱敏药品',
        minWidth: 130
      },
      {
        key: 'stages',
        title: '所处阶段',
        minWidth: 130
      },
      {
        key: 'nextdate',
        title: '复诊日期',
        width: 220
      },
      {
        key: 'nextdays',
        title: '距离复诊天数',
        width: 220
      },
      {
        slot: 'action',
        title: '操作',
        minWidth: 145,
        fixed: 'right',
        className: 'defaultInfo'
      }
    ] : [
      {
        key: 'jzcard',
        title: '就诊卡号',
        minWidth: 120
      },
      {
        key: 'realname',
        title: '姓名',
        minWidth: 80
      },
      {
        key: 'gender',
        title: '性别',
        minWidth: 80
      },
      {
        key: 'age',
        title: '年龄',
        minWidth: 80
      },
      {
        key: 'zsnum',
        title: '治疗瓶号',
        minWidth: 100
      },
      {
        key: 'zsdose',
        title: '治疗剂量（ml）',
        minWidth: 130
      },
      {
        key: 'medicine',
        title: '脱敏药品',
        minWidth: 130
      },
      {
        key: 'stages',
        title: '所处阶段',
        minWidth: 130
      },
      {
        key: 'nextdate',
        title: '复诊日期',
        width: 220
      },
      {
        key: 'nextdays',
        title: '距离复诊天数',
        width: 220
      },
      {
        slot: 'action',
        title: '操作',
        minWidth: 145,
        fixed: 'right',
        className: 'defaultInfo'
      }
    ]
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      synum: '',
      doseList: [],
      keyword: '',
      showZS: false,
      loading: false,
      loadingSubmit: false,
      loadingQD: false,
      showAdd: false,
      ruleForm: {},
      jcList: [
        '血常规',
        '血沉',
        '吸入物变应原筛查',
        '变应原检测',
        '食入物变应原筛查',
        '食物特异性IgG4抗体检测',
        '肺功能',
        '耳鼻喉内窥镜检查'
      ],
      columns,
      tableData: [],
      today: this.$moment().startOf('day').format('YYYY-MM-DD'),
      dateList: {
        shortcuts: [
          {
            text: '今天',
            value: () => {
              const start = this.$moment().startOf('day')._d
              return [start, start]
            }
          },
          {
            text: '本周',
            value: () => {
              const start = this.$moment().startOf('week').add(1, 'day')._d
              const end = this.$moment().endOf('week').add(1, 'day')._d
              return [start, end]
            }
          },
          {
            text: '本月',
            value: () => {
              const start = this.$moment().startOf('month')._d
              const end = this.$moment().endOf('month')._d
              return [start, end]
            }
          },
          {
            text: '今年',
            value () {
              const start = new Date().getFullYear() + '01-01'
              const end = new Date().getFullYear() + '12-31'
              return [start, end]
            }
          }
        ]
      },
      chooseDate: [
        this.$moment().startOf('day').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ],
      yydate: '',
      chooseZSJL: {}
    }
  },
  methods: {
    rowClassName (row) {
      if (row.isdrop === 'Y') {
        return 'garyInfo'
      } else if (row.nextdays < 0) {
        return 'redInfo'
      } else if (row.nextdays === 0) {
        return 'orangeInfo'
      } else {
        return ''
      }
    },
    tuoluo (row) {
      this.ruleForm = row
      this.showAdd = true
    },
    saveEdit () {
      if (!this.ruleForm.dropmark) {
        this.$Message.error('请填写脱落原因')
        return
      }

      this.loadingQD = true

      pxzs
        .saveDrop({
          tuominid: this.ruleForm.tuominid,
          isdrop: 'Y',
          dropmark: this.ruleForm.dropmark
        })
        .then(res => {
          this.$Message.success('保存成功')
          this.$emit('changeTab', 'tl')
          this.loadingQD = false
        })
        .catch(err => {
          console.log('舌下脱敏-保存脱落:', err)
          this.loading = false
          this.loadingQD = false
        })
    },
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    // 详情
    getDetail (row) {
      this.$router.push({ path: '/detail?patid=' + row.patid })
    },
    getYYXQ () {
      this.$emit('getYYXQ')
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.synum = ''
      this.keyword = ''
      this.yydate = ''
      this.changeFilter()
    },
    getList () {
      this.loading = true
      pxzs
        .sxList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          synum: this.synum,
          yydate: this.yydate,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
        .catch(err => {
          console.log('舌下脱敏列表:', err)
          this.loading = false
        })
    },
    changezsnum (e) {
      let index = this.chooseZSJL.option.findIndex(item => item.num === e)
      if (this.chooseZSJL.scheme === 'jqfa') {
        this.chooseZSJL.jqnum = e.split(',').length
        this.chooseZSJL.jqno =
          e.split(',').length === this.oldzhenInfo.jqnum ? this.oldzhenInfo.jqno : 1
      }
      this.doseList = this.chooseZSJL.option[index].dose
      this.$refs.zsdose.clearSingleSelect()
    },
    doZS (row) {
      pxzs
        .sxInit({
          projectid: row.tuominid
        })
        .then(res => {
          let data = res.data
          data.zsnum = Number(data.zsnum)
          data.zsdose = Number(data.zsdose)
          this.chooseZSJL = {
            ...data
          }
          // eslint-disable-next-line
          let index = this.chooseZSJL.option.findIndex(item => item.num == data.zsnum - 1)
          this.doseList = this.chooseZSJL.option[index].dose
          this.showZS = true
        })
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    finishZS () {
      if (!this.chooseZSJL.zsnum) {
        this.$Message.error('请填写治疗瓶号')
        return
      }
      if (!this.chooseZSJL.zsdose) {
        this.$Message.error('请填写治疗剂量')
        return
      }

      let param = deepClone(this.chooseZSJL)
      param.zsdate = param.zsdate ? this.$moment(param.zsdate).format('YYYY-MM-DD') : ''
      param.visitdate = param.visitdate ? this.$moment(param.visitdate).format('YYYY-MM-DD') : ''

      this.loadingSubmit = true

      pxzs
        .sxSave(param)
        .then(res => {
          this.$Message.success('编辑成功')
          this.showZS = false
          this.getList()
          this.loadingSubmit = false
        })
        .catch(() => {
          this.loadingSubmit = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './sublingual.less';
/deep/ .ivu-table .redInfo td {
  background-color: #fdddde;
}
/deep/ .ivu-table .orangeInfo td {
  background-color: #fff2d7;
}
/deep/ .ivu-table td.defaultInfo {
  background-color: #fff;
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
      color: #282d3c;
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
.line {
  border-bottom: 1px solid #d2d7e1;
  margin: 8px 0 24px;
}
.info {
  width: 100%;
  flex-wrap: wrap;
  div {
    // width: 120px;
    margin-right: 40px;
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
