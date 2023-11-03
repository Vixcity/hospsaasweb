<template>
  <div class="tmzl">
    <div v-show="step === 1">
      <div class="flex jcsb">
        <!-- <div style="font-size: 14px">诊断：过敏性鼻炎；哮喘</div> -->
        <!-- <div class="tmxx" @click="showNext">脱敏信息</div> -->
      </div>
      <!-- <div class="flex" style="margin-top: 16px"> -->
      <!-- <div class="flex aic">
          <div>脱敏药物</div>
          <Select
            v-model="tmyw"
            :transfer="true"
            placeholder="请选择脱敏药物"
            style="width: 180px; margin-left: 8px"
          >
            <Option
              :label-in-value="true"
              v-for="(item, index) in medicList"
              :key="index + 'medicList'"
              :value="index"
            >
              {{ item.label }}
            </Option>
          </Select>
        </div> -->
      <!-- <div class="flex aic">
          <div>脱敏方案</div>
          <Select
            v-model="tmfa"
            :transfer="true"
            placeholder="请选择脱敏方案"
            style="width: 180px; margin-left: 8px"
          >
            <Option value="常规方案">常规方案</Option>
            <Option value="集群方案">集群方案</Option>
          </Select>
        </div> -->
      <!-- </div> -->
      <div class="flex">
        <div class="flexItem">
          <div class="label">初次治疗日期</div>
          <DatePicker
            :editable="false"
            @on-change="firstdate = $event"
            type="date"
            v-model="firstdate"
            placeholder="请选择初次注射日期"
            style="margin-left: 8px"
          ></DatePicker>
        </div>
        <div class="flexItem">
          <div class="label">PEF预计值</div>
          <Input
            v-model="pefyj"
            style="width: 213px; margin-left: 8px"
            type="number"
            disabled
            placeholder="请填写FEV1"
          ></Input>
          <!-- <Input
            v-model="pev1"
            style="width: 213px; margin-left: 8px"
            type="number"
            placeholder="请填写FEV1"
          ></Input> -->
        </div>
      </div>
      <Table style="margin-top: 16px" v-loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="medic">
          <Select
            v-model="row.tuomin_name"
            @on-change="changeMedic($event, row)"
            filterable
            :transfer="true"
            v-if="row.tuomin_status === '0'"
          >
            <Option
              :label-in-value="true"
              v-for="(item, index) in medicList"
              :key="index"
              :value="item.tuomin_name"
              :label="item.tuomin_name"
            ></Option>
          </Select>
          <span v-else>{{ row.tuomin_name }}</span>
        </template>
        <template slot-scope="{ row }" slot="tmfa">
          <Select
            v-model="row.tuomin_tmfa"
            :transfer="true"
            :disabled="row.tuomin_tag === 'cd'"
            placeholder="请选择脱敏方案"
            @on-change="getDetail(row)"
            v-if="row.tuomin_status === '0'"
          >
            <Option
              value="cgfa"
              v-if="row.tuomin_tag === 'atd' || row.tuomin_tag === 'alg'"
              label="常规方案"
            ></Option>
            <Option value="jqfa" v-if="row.tuomin_tag === 'atd'" label="集群方案"></Option>
            <Option
              value="gmfa"
              v-if="row.tuomin_tag !== 'atd' && row.tuomin_tag !== 'alg'"
              label="高敏方案"
            ></Option>
          </Select>
          <span v-else>
            {{
              row.tuomin_tmfa === 'cgfa'
                ? '常规方案'
                : row.tuomin_tmfa === 'jqfa'
                ? '集群方案'
                : row.tuomin_tmfa === 'gmfa'
                ? '高敏方案'
                : ''
            }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="status">
          <span>
            {{
              row.tuomin_status === '0'
                ? '待付款'
                : row.tuomin_status === '1'
                ? '已退款'
                : row.tuomin_status === '2'
                ? '已付款'
                : '-'
            }}
          </span>
        </template>
        <template #action="{ row, index }">
          <div class="flex">
            <div class="tableAdd" v-if="index === tableData.length - 1" @click="addThis(row)">
              添加
            </div>
            <div class="tableAdd" @click="refund(row)" v-if="row.tuomin_status === '2'">退款</div>
            <div
              class="tableRemove"
              v-if="
                tableData.length !== 1 &&
                (row.tuomin_status === '0' ||
                  row.tuomin_status === '1' ||
                  row.dataid === 0 ||
                  row.dataid === '')
              "
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
    <div v-show="step === 2">
      <div class="flex jcsb aic">
        <div class="title">脱敏信息</div>
        <Button type="primary" @click="showPrev">返回上一级</Button>
      </div>
      <div class="flex">
        <div class="showInfo">
          <div class="label">脱敏方案：</div>
          <div class="info">皮下脱敏</div>
        </div>
        <div class="showInfo">
          <div class="label">脱敏药物：</div>
          <div class="info">安脱达</div>
        </div>
        <div class="showInfo">
          <div class="label">脱敏方案：</div>
          <div class="info">集群方案</div>
        </div>
        <div class="showInfo">
          <div class="label">剩余次数：</div>
          <div class="info">3</div>
        </div>
        <div class="showInfo">
          <div class="label">初次治疗日期：</div>
          <div class="info">2023-03-08</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="title">肺功能记录</div>
      <div class="flex jcsb">
        <myechart :option="option" style="width: 600px; height: 262px"></myechart>
        <myechart
          :option="option1"
          style="width: 600px; height: 262px; margin-left: 50px"
        ></myechart>
      </div>
      <div class="line"></div>
      <div class="title">注射记录</div>
      <Table :columns="columns1" :data="tableData1" style="margin-top: 16px" max-width="1378">
        <template slot-scope="{ row }" slot="fz">
          <span>{{ row.fz === 'Y' ? '是' : '否' }}</span>
        </template>
        <template #action="{ row }">
          <div class="tableAdd" @click="editZSJL(row)">编辑</div>
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
    <!-- 编辑 -->
    <el-dialog
      :title="chooseZSJL.originDate + ' 注射记录'"
      :visible.sync="openEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射周次</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.week" placeholder="请填写注射周次" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.date"
                placeholder="请选择注射日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射序号</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.index" placeholder="请填写注射序号" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射状态</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.status" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">PEF(前)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.pefq" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">分针</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.fz" style="width: 100%">
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射瓶号</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.ph" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射剂量(ml)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.rl" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射部位</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zsbw" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射时间</div>
            <div class="itemContent">
              <TimePicker
                :editable="false"
                format="HH:mm"
                v-model="chooseZSJL.zssj"
                placeholder="请选择注射时间"
                style="width: 100%"
              ></TimePicker>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">PEF(后)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.pefh" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应风团大小(mm)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.jkfyftdx" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应记录</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.jkfyjl" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应记录处理</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.jkfyjlcl" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应风团大小(mm)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.cfjbftdx" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应记录</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.cffyjl" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应处理</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.cffycl" placeholder="请填写迟发反应处理" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">备注</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.desc" type="textarea" :rows="5" placeholder="请填写备注" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary">提交</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import myechart from '../../../components/charts/myechart'
import { deepClone } from '@/libs/util'
export default {
  name: 'tmzl',
  components: {
    myechart
  },
  data () {
    return {
      step: 1,
      loading: false,
      loadingKD: false,
      pageNum: 0,
      currentPageIdx: 1,
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      openEdit: false,
      tmyw: '',
      tmfa: '',
      pev1: '',
      columns: [
        {
          title: '脱敏药物',
          slot: 'medic'
        },
        {
          title: '脱敏方案',
          slot: 'tmfa'
        },
        {
          title: '次数',
          key: 'tuomin_zstotal'
        },
        {
          title: '价格',
          key: 'tuomin_fee'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '操作',
          key: 'do',
          slot: 'action',
          fixed: 'right',
          width: 150
        }
      ],
      tableData: [],
      firstdate: this.$moment(new Date()).format('YYYY-MM-DD'),
      pefyj: '',
      columns1: [
        {
          title: '周次',
          key: 'week',
          fixed: 'left',
          width: 80
        },
        {
          title: '日期',
          key: 'date',
          width: 130
        },
        {
          title: '注射序号',
          key: 'index',
          width: 100
        },
        {
          title: '状态',
          key: 'status',
          width: 80
        },
        {
          title: 'PEF（前）',
          key: 'pefq',
          width: 120
        },
        {
          title: '分针',
          slot: 'fz',
          width: 70
        },
        {
          title: '瓶号',
          key: 'ph',
          width: 70
        },
        {
          title: '容量（ml）',
          key: 'rl',
          width: 110
        },
        {
          title: '注射部位',
          key: 'zsbw',
          width: 100
        },
        {
          title: '注射时间',
          key: 'zssj',
          width: 100
        },
        {
          title: 'PEF（后）',
          key: 'pefh',
          width: 120
        },
        {
          title: '即刻反应风团大小（mm）',
          key: 'jkfyftdx',
          width: 200
        },
        {
          title: '即刻反应记录',
          key: 'jkfyjl',
          width: 120
        },
        {
          title: '即刻反应记录处理',
          key: 'jkfyjlcl',
          width: 150
        },
        {
          title: '迟发局部风团大小（mm）',
          key: 'cfjbftdx',
          width: 200
        },
        {
          title: '迟发反应记录',
          key: 'cffyjl',
          width: 120
        },
        {
          title: '迟发反应记录处理',
          key: 'cffyjlcl',
          width: 150
        },
        {
          title: '备注',
          key: 'desc',
          width: 200
        },
        {
          title: '医生',
          key: 'doctor',
          width: 120
        },
        {
          title: '操作',
          key: 'do',
          slot: 'action',
          fixed: 'right',
          width: 80
        }
      ],
      medicList: [],
      tableData1: [],
      option: {
        color: ['#3171FF', '#00d48a', '#F75559'],
        title: {
          text: 'PEF变化曲线图',
          left: 'center',
          textStyle: { color: '#282D3C' }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: '0%',
          data: ['PEF前', 'PEF后', 'PEF预计值']
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['12-20', '12-21', '12-22', '12-23', '12-24', '12-25', '12-26']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'PEF前',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'PEF后',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'PEF预计值',
            lineStyle: {
              type: 'dashed'
            },
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      },
      option1: {
        title: {
          text: 'PEV1变化曲线图',
          left: 'center',
          textStyle: { color: '#282D3C' }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['12-20', '12-21', '12-22', '12-23', '12-24', '12-25', '12-26']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'PEF前',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      chooseZSJL: {}
    }
  },
  methods: {
    showNext () {
      this.gettuominInfo()
      this.getZSList()
      this.step = 2
    },
    showPrev () {
      this.step = 1
    },
    gettuominInfo () {
      treated
        .tuominInfo({
          patid: this.patid
        })
        .then(res => {
          // let data = res.data
          // console.log(data)
        })
    },
    getZSList () {
      treated
        .shotRecord({
          patid: this.patid
        })
        .then(res => {
          // let data = res.data
          // console.log(data)
        })
    },
    changePage () {},
    changeSize () {},
    editZSJL (e) {
      this.openEdit = true
      e.originDate = e.date
      this.chooseZSJL = deepClone(e)
    },
    // 获取数据
    getData () {
      this.loading = true
      treated
        .writeTMInit({
          appointid: this.appointid
        })
        .then(res => {
          if (res.data.lists.length) {
            this.tableData = res.data.lists
            let firstdate = this.$moment(res.data.firstdate || new Date()).format('YYYY-MM-DD')
            this.firstdate = firstdate
            this.pev1 = res.data.pev1 || ''
            this.pefyj = res.data.pefyj || ''
            this.loading = false
          } else {
            let firstdate = this.$moment(res.data.firstdate || new Date()).format('YYYY-MM-DD')
            this.firstdate = firstdate
            this.pev1 = res.data.pev1 || ''
            this.pefyj = res.data.pefyj || ''
            var cache = localStorage.patientTmzl ? JSON.parse(localStorage.patientTmzl) : []
            if (cache.length) {
              this.tableData = cache
              this.loading = false
            } else {
              this.tableData = [
                {
                  dataid: '', // 数据ID
                  tuomin_name: '', // 药物名称
                  tuomin_tag: '', // 脱敏药物标识，畅迪/cd，安脱达/atd，阿罗格/alg
                  tuomin_tmfa: '', // 脱敏方案，cgfa/常规方案，jqfa/集群方案，gmfa/高敏方案
                  tuomin_fee: '-', // 价格
                  tuomin_zsnum: '', // 单个注射次数
                  tuomin_num: '', // 开具数量
                  tuomin_zstotal: '-', // 总注射次数
                  tuomin_status: '0' // 状态
                }
              ]
              this.loading = false
            }
          }
        })
    },
    // 搜索药物
    getList (keyword = '') {
      treated
        .writeTMSearch({
          keyword
        })
        .then(res => {
          this.medicList = res.data
        })
    },
    // 选择脱敏药物
    changeMedic (index, row) {
      /**
       * index => 当前选择药物id
       * row => 当前选择行
       * i => 当前选择药物下标
       * item => 当前选择药物内容
       */
      var i = this.medicList.findIndex(item => item.tuomin_name === index)
      var item = this.medicList[i]
      var rows = this.tableData[row._index]
      if (!item) return
      rows.dataid = item.dataid
      rows.tuomin_name = item.tuomin_name
      rows.tuomin_tag = item.tuomin_tag
      rows.tuomin_tmfa = item.tuomin_tmfa
      rows.tuomin_fee = item.tuomin_fee
      rows.tuomin_zsnum = item.tuomin_zsnum
      rows.tuomin_num = item.tuomin_num
      rows.tuomin_zstotal = item.tuomin_zstotal
      rows.tuomin_status = item.tuomin_status
    },
    // tableData为最新值
    getDetail (row) {
      var rows = this.tableData[row._index]
      rows.dataid = row.dataid
      rows.tuomin_name = row.tuomin_name
      rows.tuomin_tag = row.tuomin_tag
      rows.tuomin_tmfa = row.tuomin_tmfa
      rows.tuomin_fee = row.tuomin_fee
      rows.tuomin_zsnum = row.tuomin_zsnum
      rows.tuomin_num = row.tuomin_num
      rows.tuomin_zstotal = row.tuomin_zstotal
      rows.tuomin_status = row.tuomin_status
    },
    // 添加
    addThis () {
      this.tableData.push({
        dataid: '', // 数据ID
        tuomin_name: '', // 药物名称
        tuomin_tag: '', // 脱敏药物标识，畅迪/cd，安脱达/atd，阿罗格/alg
        tuomin_tmfa: '', // 脱敏方案，cgfa/常规方案，jqfa/集群方案，gmfa/高敏方案
        tuomin_fee: '-', // 价格
        tuomin_zsnum: '', // 单个注射次数
        tuomin_num: '', // 开具数量
        tuomin_zstotal: '-', // 总注射次数
        tuomin_status: '0' // 状态
      })
    },
    // 删除
    removeThis (row, index) {
      if (row.dataid === 0 || row.dataid === '') {
        this.tableData.splice(index, 1)
      } else {
        this.$confirm('是否确认删除脱敏药物?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          treated
            .writeTMDelete({
              dataid: row.dataid
            })
            .then(res => {
              if (res.status === 200) {
                this.tableData.splice(index, 1)
                this.$Message.success('删除成功')
                this.getData()
              }
            })
        })
      }
    },
    // 退款
    refund (row) {
      this.$confirm('是否确认退款?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        treated
          .writeTMRefund({
            dataid: row.dataid
          })
          .then(res => {
            this.$Message.success('操作成功')
            this.getData()
          })
      })
    },
    // 开单
    goKD () {
      if (!this.firstdate) {
        this.$Message.error('请填写初次治疗日期')
        return
      }
      var arr = deepClone(this.tableData)
      if (arr.length) {
        arr.map((item, index) => {
          if (item.tuomin_name === '') {
            arr.splice(index, 1)
          }
        })
      }
      var data = {
        patid: this.patid,
        appointid: this.appointid,
        firstdate: this.firstdate ? this.$moment(this.firstdate).format('YYYY-MM-DD') : '',
        pev1: this.pev1,
        jsondata: JSON.stringify(arr)
      }

      this.loadingKD = true

      treated
        .writeTMBilling(data)
        .then(res => {
          if (res.status === 200) {
            this.$Message.success(res.msg)
            localStorage.patientTmzl = JSON.stringify([])
            this.getData()
          }
          this.loadingKD = false
        })
        .catch(() => {
          this.loadingKD = false
        })
    }
  },
  mounted () {
    this.getData()
    this.getList()
  },
  watch: {
    tableData: {
      handler (val) {
        localStorage.patientTmzl = JSON.stringify(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './common.less';
.flexItem {
  display: flex;
  align-items: center;
  margin-right: 24px;
  &:last-child {
    margin-right: 16px;
  }
  .label {
    font-size: 14px;
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
</style>
