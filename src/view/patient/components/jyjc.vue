<template>
  <div class="jyjc">
    <div v-show="step === 1">
      <div class="flex jcsb">
        <div style="font-size: 14px"></div>
        <div class="jcls" @click="showNext">检查历史</div>
      </div>
      <div v-if="!isKD">
        <Table :columns="columns" :data="tableData" style="margin-top: 16px">
          <template slot-scope="{ row }" slot="medic">
            <Select
              v-model="row.inspect_id"
              filterable
              @on-change="changeMedic($event, row)"
              :transfer="true"
              style="width: 200px"
            >
              <Option
                v-for="(item, index) in jcList"
                :value="item.inspect_id"
                :key="index"
                :label="item.inspect_name"
              ></Option>
            </Select>
          </template>
          <template #action="{ row, index }">
            <div class="flex">
              <div class="tableAdd" v-if="index === tableData.length - 1" @click="addThis(row)">
                添加
              </div>
              <div
                class="tableRemove"
                v-if="tableData.length !== 1"
                @click="removeThis(row, index)"
              >
                删除
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 40px; text-align: center">
          <Button type="primary" @click="goKD" :loading="loadingKD">开 单</Button>
        </div>
      </div>
      <div v-else>
        <Table
          v-loading="loading"
          :columns="columnsKD"
          :data="tableDataKD"
          style="margin-top: 16px"
        >
          <template slot-scope="{ row }" slot="status">
            <span>
              {{
                row.inspect_status === '0'
                  ? '待支付'
                  : row.inspect_status === '1'
                  ? '待检验'
                  : row.inspect_status === '2'
                  ? '检验中'
                  : row.inspect_status === '3'
                  ? '已检查'
                  : row.inspect_status === '4'
                  ? '已退款'
                  : ''
              }}
            </span>
          </template>
          <template #action="{ row, index }">
            <div class="flex">
              <div class="tableAdd" @click="refund(row)" v-if="row.inspect_status === '1'">
                退款
              </div>
              <div
                class="tableRemove"
                @click="removeThis(row, index)"
                v-if="
                  row.inspect_status === '0' ||
                  row.inspect_status === '4' ||
                  row.dataid === 0 ||
                  row.dataid === ''
                "
              >
                删除
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 40px; text-align: center">
          <Button type="primary" @click="ZJJM">增加检验</Button>
        </div>
        <el-dialog
          title="增加检验"
          :visible.sync="openAdd"
          width="768px"
          :close-on-click-modal="false"
          class="vertical-center-modal"
        >
          <div class="table_style">
            <Table :columns="columns" :data="tableDataAdd">
              <template slot-scope="{ row }" slot="medic">
                <Select
                  :transfer="true"
                  v-model="row.inspect_id"
                  @on-change="changeMedicAdd($event, row)"
                  filterable
                  style="width: 180px"
                >
                  <Option
                    v-for="(item, index) in jcList"
                    :value="item.inspect_id"
                    :key="index"
                    :label="item.inspect_name"
                  ></Option>
                </Select>
              </template>
              <template #action="{ row, index }">
                <div class="flex">
                  <div
                    class="tableAdd"
                    v-if="index === tableDataAdd.length - 1"
                    @click="addSmallTable(row)"
                  >
                    添加
                  </div>
                  <div
                    class="tableRemove"
                    v-if="tableDataAdd.length !== 1"
                    @click="removeSmallThis(index)"
                  >
                    删除
                  </div>
                </div>
              </template>
            </Table>
          </div>
          <div slot="footer">
            <Button type="primary" @click="submit" style="margin-left: 8px" :loading="loadingSubmit">提 交</Button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-show="step === 2">
      <div class="flex jcsb aic">
        <div class="title">检查历史</div>
        <Button type="primary" @click="showPrev">返回上一级</Button>
      </div>
      <Table v-loading="loadingLS" :columns="columns1" :data="tableData1" style="margin-top: 16px">
        <template #result="{ row }">
          <span>{{ row.result || '-' }}</span>
        </template>
        <template #action="{ row }">
          <div class="tableAdd" @click="seeBG(row)">
            {{ row.result === null ? '' : '查看报告单' }}
          </div>
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
    </div>
    <!-- 报告单 -->
    <el-image
      ref="watchReport"
      style="display: none"
      :src="showImgPath"
      :preview-src-list="watchImgList"
    ></el-image>
  </div>
</template>

<script>
import { check } from '@/api/check/index'
import { treated } from '@/api/treated/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'jyjc',
  data () {
    return {
      step: 1,
      pageNum: 0,
      loading: false,
      loadingLS: false,
      loadingKD: false,
      loadingSubmit: false,
      report: '',
      showImgPath: '',
      watchImgList: [],
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      currentPageIdx: 1,
      pageSize: 10,
      openAdd: false,
      isKD: true,
      jcList: [],
      columns: [
        {
          title: '项目名称',
          slot: 'medic'
        },
        {
          title: '价格',
          key: 'inspect_fee'
        },
        {
          title: '操作',
          key: 'do',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      tableData: [],
      columnsKD: [
        {
          title: '项目名称',
          key: 'inspect_name'
        },
        {
          title: '价格',
          key: 'inspect_fee'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      tableDataKD: [],
      tableDataAdd: [
        {
          dataid: '', // 数据ID
          inspect_id: '', // 项目ID
          inspect_name: '', // 项目名称
          inspect_code: '', // 项目代码
          inspect_fee: '-', // 项目单价
          inspect_num: '', // 开具数量
          inspect_type: '', // 检查类型
          inspect_status: '' // 状态
        }
      ],
      columns1: [
        {
          title: '序号',
          key: 'insid',
          width: 110
        },
        {
          title: '项目名称',
          key: 'insname'
        },
        {
          title: '缴费时间',
          key: 'paydate'
        },
        {
          title: '就诊医生',
          key: 'docname'
        },
        {
          title: '检验结果',
          slot: 'result'
        },
        {
          title: '操作',
          key: 'do',
          fixed: 'right',
          width: 120,
          slot: 'action'
        }
      ],
      tableData1: [],
      histList: ''
    }
  },
  methods: {
    // 检查历史
    showNext () {
      // if (!this.histList) {
      //   this.getCheckHist()
      // }
      this.getCheckHist()

      this.step = 2
    },
    // 检查记录
    getCheckHist () {
      this.loadingLS = true
      treated
        .checkHist({
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.histList = data
          this.tableData1 = data.lists
          this.loadingLS = false
          this.pageNum = data.total
          // console.log(data)
        })
    },
    showPrev () {
      this.step = 1
    },
    changePage () {},
    changeSize () {},
    ZJJM () {
      this.openAdd = true
    },
    seeBG (row) {
      check
        .getReport({
          checkid: row.insid
        })
        .then(res => {
          let data = res.data
          this.showImgPath = data.jcfiles[0]
          this.watchImgList = data.jcfiles
          this.$nextTick(() => {
            this.$refs.watchReport.clickHandler()
          })
        })
    },
    // 添加项目
    addSmallTable () {
      this.tableDataAdd.push({
        dataid: '', // 数据ID
        inspect_id: '', // 项目ID
        inspect_name: '', // 项目名称
        inspect_code: '', // 项目代码
        inspect_fee: '-', // 项目单价
        inspect_num: '', // 开具数量
        inspect_type: '', // 检查类型
        inspect_status: '' // 状态
      })
    },
    // 删除项目
    removeSmallThis (index) {
      this.tableDataAdd.splice(index, 1)
    },
    // 选择检查项目
    changeMedicAdd (index, row) {
      /**
       * index => 当前选择项目id
       * row => 当前选择行
       * i => 当前选择项目下标
       * item => 当前选择项目内容
       */
      var i = this.jcList.findIndex(item => item.inspect_id === index)
      var item = this.jcList[i]
      var rows = this.tableDataAdd[row._index]
      this.selectProject(item, rows)
    },
    // 增加检查
    submit () {
      var arr = deepClone(this.tableDataAdd)
      this.preserve(arr, 'add')
    },
    // 添加检查项目
    addThis () {
      this.tableData.push({
        dataid: '', // 数据ID
        inspect_id: '', // 项目ID
        inspect_name: '', // 项目名称
        inspect_code: '', // 项目代码
        inspect_fee: '-', // 项目单价
        inspect_num: '', // 开具数量
        inspect_type: '', // 检查类型
        inspect_status: '' // 状态
      })
    },
    // 删除
    removeThis (row, index) {
      if (row.dataid === 0 || row.dataid === '') {
        this.tableData.splice(index, 1)
      } else {
        this.$confirm('是否确认删除检查项目?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          treated
            .writeCheckDelete({
              dataid: row.dataid
            })
            .then(res => {
              if (res.status === 200) {
                this.$Message.success('删除成功')
                this.getList()
              }
            })
        })
      }
    },
    // 获取数据
    getList () {
      this.loading = true
      treated
        .writeCheckInit({
          appointid: this.appointid
        })
        .then(res => {
          if (res.data.length) {
            this.isKD = true
            this.tableDataKD = res.data
            this.loading = false
          } else {
            var cache = localStorage.patientJyjc ? JSON.parse(localStorage.patientJyjc) : []
            this.isKD = false
            if (cache.length) {
              this.tableData = cache
              this.loading = false
            } else {
              this.tableData = [
                {
                  dataid: '', // 数据ID
                  inspect_id: '', // 项目ID
                  inspect_name: '', // 项目名称
                  inspect_code: '', // 项目代码
                  inspect_fee: '-', // 项目单价
                  inspect_num: '', // 开具数量
                  inspect_type: '', // 检查类型
                  inspect_status: '' // 状态
                }
              ]
              this.loading = false
            }
          }
        })
    },
    // 搜索项目
    getjcList (keyword = '') {
      treated
        .writeCheckSearch({
          keyword
        })
        .then(res => {
          this.jcList = res.data
        })
    },
    // 选择检查项目
    changeMedic (index, row) {
      /**
       * index => 当前选择项目id
       * row => 当前选择行
       * i => 当前选择项目下标
       * item => 当前选择项目内容
       */
      var i = this.jcList.findIndex(item => item.inspect_id === index)
      var item = this.jcList[i]
      var rows = this.tableData[row._index]
      this.selectProject(item, rows)
    },
    selectProject (item, rows) {
      if (!item) return
      rows.dataid = item.dataid
      rows.inspect_id = item.inspect_id
      rows.inspect_name = item.inspect_name
      rows.inspect_code = item.inspect_code
      rows.inspect_fee = item.inspect_fee
      rows.inspect_num = item.inspect_num
      rows.inspect_type = item.inspect_type
      rows.inspect_status = item.inspect_status
    },
    // 开单
    goKD () {
      var arr = deepClone(this.tableData)
      this.preserve(arr)
    },
    preserve (arr, sign) {
      if (arr.length) {
        arr.map((item, index) => {
          if (item.inspect_id === '') {
            arr.splice(index, 1)
          }
        })
      }
      var data = {
        patid: this.patid,
        appointid: this.appointid,
        jsondata: JSON.stringify(arr)
      }

      this.loadingKD = true
      this.loadingSubmit = true

      treated.writeCheckBilling(data).then(res => {
        if (res.status === 200) {
          if (sign === 'add') {
            this.tableDataAdd = [
              {
                dataid: '', // 数据ID
                inspect_id: '', // 项目ID
                inspect_name: '', // 项目名称
                inspect_code: '', // 项目代码
                inspect_fee: '-', // 项目单价
                inspect_num: '', // 开具数量
                inspect_type: '', // 检查类型
                inspect_status: '' // 状态
              }
            ]
            this.openAdd = false
          }
          this.$Message.success(res.msg)
          localStorage.patientJyjc = JSON.stringify([])
          this.getList()
          this.loadingKD = false
          this.loadingSubmit = false
        }
      }).catch(() => {
        this.loadingKD = false
        this.loadingSubmit = false
      })
    },
    // 退款
    refund (row) {
      this.$confirm('是否确认退款?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        treated
          .writeCheckRefund({
            dataid: row.dataid
          })
          .then(res => {
            if (res.status === 200) {
              this.$Message.success('操作成功')
              this.getList()
            }
          })
      })
    }
  },
  mounted () {
    this.getList()
    this.getjcList()
  },
  watch: {
    tableData: {
      handler (val) {
        localStorage.patientJyjc = JSON.stringify(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './common.less';
</style>
