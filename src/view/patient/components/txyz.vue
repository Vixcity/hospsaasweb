<template>
  <div class="txyz">
    <!-- <div class="flex jcsb">
      <div style="font-size: 14px">诊断：过敏性鼻炎；哮喘</div>
    </div> -->
    <div class="title" style="margin-top: 0">用药医嘱</div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #medic="{ row }">
        <Select
          v-model="row.medical_id"
          filterable
          @on-change="changeMedic($event, row)"
          :transfer="true"
          style="width: 200px"
          v-if="row.medical_status === '0'"
        >
          <Option
            :label-in-value="true"
            v-for="(item, index) in medicList"
            :key="index"
            :value="item.medical_id"
            :label="item.medical_name"
          ></Option>
        </Select>
        <span v-else>{{ row.medical_name }}</span>
      </template>
      <template slot-scope="{ row }" slot="jl">
        <Select
          v-model="row.medical_dose"
          :transfer="true"
          placeholder="请选择剂量"
          @on-change="getDetail(row)"
          v-if="row.medical_status === '0'"
        >
          <Option v-for="(item, index) in selectData.doses" :value="item.name" :key="index">
            {{ item.name }}
          </Option>
        </Select>
        <span v-else>{{ row.medical_dose }}</span>
      </template>
      <template slot-scope="{ row }" slot="fyfs">
        <Select
          v-model="row.medical_usage"
          :transfer="true"
          placeholder="请选择服用方式"
          @on-change="getDetail(row)"
          v-if="row.medical_status === '0'"
        >
          <Option v-for="(item, index) in selectData.usages" :value="item.name" :key="index">
            {{ item.name }}
          </Option>
        </Select>
        <span v-else>{{ row.medical_usage }}</span>
      </template>
      <template slot-scope="{ row }" slot="howuse">
        <Select
          v-model="row.medical_rate"
          :transfer="true"
          placeholder="请选择用法"
          @on-change="getDetail(row)"
          v-if="row.medical_status === '0'"
        >
          <Option v-for="(item, index) in selectData.rates" :value="item.name" :key="index">
            {{ item.name }}
          </Option>
        </Select>
        <span v-else>{{ row.medical_rate }}</span>
      </template>
      <template slot-scope="{ row }" slot="days">
        <InputNumber
          v-model="row.medical_days"
          :min="1"
          @on-change="getDetail(row)"
          v-if="row.medical_status === '0'"
        ></InputNumber>
        <span v-else>{{ row.medical_days }}</span>
      </template>
      <template slot-scope="{ row }" slot="number">
        <InputNumber
          v-model="row.medical_num"
          :min="1"
          @on-change="getDetail(row)"
          v-if="row.medical_status === '0'"
        ></InputNumber>
        <span v-else>{{ row.medical_num }}</span>
      </template>
      <template slot-scope="{ row }" slot="status">
        <span>
          {{
            row.medical_status == 0
              ? '待支付'
              : row.medical_status == 1
              ? '待开药'
              : row.medical_status == 2
              ? '已开药'
              : row.medical_status == 3
              ? '已退回-未退款'
              : row.medical_status == 4
              ? '已退款'
              : ''
          }}
        </span>
      </template>
      <template #action="{ row, index }">
        <div class="flex">
          <div class="tableAdd" @click="addTableData(row)" v-if="index === tableData.length - 1">
            添加
          </div>
          <div
            class="tableAdd"
            @click="refund(row)"
            v-if="row.medical_status === '1' || row.medical_status === '3'"
          >
            退款
          </div>
          <div
            class="tableRemove"
            @click="removeThis(row, index)"
            v-if="
              tableData.length !== 1 &&
              (row.medical_status === '0' ||
                row.medical_status === '4' ||
                row.prescribeid === 0 ||
                row.prescribeid === '')
            "
          >
            删除
          </div>
        </div>
      </template>
    </Table>
    <div class="title">规避医嘱</div>
    <Input
      v-model="gbzy"
      :rows="5"
      style="margin-top: 16px"
      type="textarea"
      placeholder="请填写用药医嘱"
    />
    <Select
      :transfer="true"
      style="width: 126px; margin-top: 24px"
      placeholder="请选择模板"
      @on-change="getZy"
      clearable
    >
      <Option v-for="(item, index) in selectData.evades" :value="item.name" :key="index">
        {{ item.name }}
      </Option>
    </Select>
    <div class="btnCtn">
      <Button @click="openCFJ">外配开单</Button>
      <Button type="primary" style="margin-left: 8px" @click="billing" :loading="loadingKD">
        开 单
      </Button>
    </div>
    <el-dialog
      :title="outside.hospital + '（门诊西药处方笺）'"
      :visible.sync="showCFJ"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div id="printMe">
        <div class="printTitle">{{ outside.hospital + '（门诊西药处方笺）' }}</div>
        <div style="margin-top: 32px">
          <div class="listTable">
            <div class="st listItem">姓名</div>
            <div class="lt listItem">{{ outside.patname }}</div>
            <div class="st listItem">性别</div>
            <div class="lt listItem">{{ outside.patsex }}</div>
            <div class="st listItem">年龄</div>
            <div class="lt listItem">{{ outside.patage }}</div>
          </div>
          <div class="listTable">
            <div class="st listItem">就诊卡号</div>
            <div class="lt listItem">{{ outside.jzcard }}</div>
            <div class="st listItem">就诊科室</div>
            <div class="lt listItem">{{ outside.section }}</div>
            <div class="st listItem">地址</div>
            <div class="lt listItem list_item_textarea">
              <Input
                type="textarea"
                v-model="address"
                :autosize="true"
                placeholder="请输入处方药购买地址"
              />
            </div>
          </div>
          <div class="listTable">
            <div class="st listItem">联系电话</div>
            <div class="lt listItem">{{ outside.mobile }}</div>
            <div class="st listItem">临床诊断</div>
            <div class="lt listItem">{{ outside.diagnose }}</div>
            <div class="st listItem">处方日期</div>
            <div class="lt listItem">{{ outside.diagdate }}</div>
          </div>
          <div class="listTable" style="height: 380px; overflow: hidden">
            <div class="RP">Rp</div>
            <textarea
              class="textarea"
              placeholder="请在该区域输入药品名称、规格、数量、用法用量~"
              v-model="Rp"
            ></textarea>
          </div>
        </div>
        <div class="otherCtn">
          <div class="moneyCtn">
            <div>
              药品费
              <div style="display: inline-block; border-bottom: 1px solid #000; width: 60%"></div>
            </div>
            <div style="margin-top: 20px">
              注射费
              <div style="display: inline-block; border-bottom: 1px solid #000; width: 60%"></div>
            </div>
          </div>
          <div>
            收款
            <br />
            盖章
          </div>
          <div style="width: 200px">
            <div class="flex aic">
              医生签名
              <img style="width: 30%" :src="outside.autograph" alt="" />
            </div>
            <div style="margin-top: 20px">
              调配药师
              <div style="display: inline-block; border-bottom: 1px solid #000; width: 70%"></div>
            </div>
            <div style="margin-top: 20px">
              核对药师
              <div style="display: inline-block; border-bottom: 1px solid #000; width: 70%"></div>
            </div>
            <div style="margin-top: 20px">
              发药药师
              <div style="display: inline-block; border-bottom: 1px solid #000; width: 70%"></div>
            </div>
          </div>
        </div>
        <div class="attention">注意：请勿遗失，处方当日有效；因特殊情况，该处方有效期为____天</div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="preserve">打印</Button>
        <button ref="print_me" v-print="'#printMe'" style="display: none">打印</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'txyz',
  data () {
    return {
      showCFJ: false,
      loading: false,
      loadingKD: false,
      Rp: '',
      address: '',
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      columns: [
        {
          title: '药品名称',
          slot: 'medic',
          width: 220
        },
        {
          title: '规格',
          width: 100,
          key: 'medical_spec'
        },
        {
          title: '剂量',
          width: 130,
          slot: 'jl'
        },
        {
          title: '剂量单位',
          width: 120,
          key: 'medical_unit'
        },
        {
          title: '服用方式',
          width: 180,
          slot: 'fyfs'
        },
        {
          title: '用法',
          width: 120,
          slot: 'howuse'
        },
        {
          title: '服用天数',
          width: 140,
          slot: 'days'
        },
        {
          title: '数量',
          width: 140,
          slot: 'number'
        },
        {
          title: '单位',
          width: 100,
          key: 'medical_units'
        },
        {
          title: '单价',
          width: 100,
          key: 'medical_fee'
        },
        {
          title: '总价',
          width: 100,
          key: 'medical_total_fee'
        },
        {
          title: '状态',
          width: 100,
          slot: 'status'
        },
        {
          title: '操作',
          width: 150,
          slot: 'action',
          fixed: 'right'
        }
      ],
      tableData: [],
      gbzy: '',
      medicList: [],
      mbList: [],
      selectData: {},
      outside: {}
    }
  },
  methods: {
    // 外派开单初始化
    openCFJ () {
      this.showCFJ = true
      treated
        .ajaxInitOutOpen({
          appointid: this.appointid
        })
        .then(res => {
          this.outside = res.data
        })
    },
    // 外派开单保存
    preserve () {
      var data = {
        appointid: this.appointid,
        address: this.address,
        content: this.Rp
      }
      if (!this.address) {
        this.$Message.error('请填写地址')
        return
      }
      if (!this.Rp) {
        this.$Message.error('请填写药品名称')
        return
      }
      treated.ajaxSaveOutOpen(data).then(res => {
        this.$refs.print_me.click()
      })
    },
    // 删除
    removeThis (row, index) {
      if (row.prescribeid === 0 || row.prescribeid === '') {
        this.tableData.splice(index, 1)
      } else {
        this.$confirm('是否确认删除医嘱?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          treated
            .writeYZDelete({
              prescribeid: row.prescribeid
            })
            .then(res => {
              if (res.status === 200) {
                this.tableData.splice(index, 1)
                this.$Message.success('删除成功')
                this.getList()
              }
            })
        })
      }
    },
    // 添加医嘱
    addTableData () {
      this.tableData.push({
        prescribeid: '', // 数据id
        medical_id: '', // 药物id
        medical_trade: '', // 化学名
        medical_name: '', // 商品名
        medical_spec: '-', // 规格
        medical_unit: '-', // 剂量单位
        medical_units: '-', // 组装单位
        medical_fee: '-', // 药品单价
        medical_total_fee: '-', // 总价
        medical_dose: '', // 服用剂量
        medical_usage: '', // 服用方式
        medical_rate: '', // 服用频率
        medical_days: 3, // 服用天数
        medical_num: 1, // 开具数量
        medical_status: '0' // 状态
      })
    },
    // 选择医嘱药品
    changeMedic (index, row) {
      /**
       * index => 当前选择药物id
       * row => 当前选择行
       * i => 当前选择药物下标
       * item => 当前选择药物内容
       */
      var i = this.medicList.findIndex(item => item.medical_id === index)
      var item = this.medicList[i]
      var rows = this.tableData[row._index]
      if (!item) return
      rows.prescribeid = item.prescribeid
      rows.medical_id = item.medical_id
      rows.medical_trade = item.medical_trade
      rows.medical_name = item.medical_name
      rows.medical_spec = item.medical_spec
      rows.medical_unit = item.medical_unit
      rows.medical_units = item.medical_units
      rows.medical_fee = item.medical_fee
      rows.medical_total_fee = (Number(item.medical_fee) * 1).toFixed(2)
      rows.medical_dose = Number(item.medical_dose)
      rows.medical_usage = item.medical_usage
      rows.medical_rate = item.medical_rate
      rows.medical_num = 1
      rows.medical_days = 3
      rows.medical_status = item.medical_status
    },
    // 获取数据
    getList () {
      this.loading = true
      treated
        .writeYZInit({
          appointid: this.appointid
        })
        .then(res => {
          this.selectData = res.data
          var arr = res.data.prescribe
          var cache = localStorage.patientTxyz ? JSON.parse(localStorage.patientTxyz) : []
          this.gbzy = res.data.nowevade
          if (cache.length) {
            this.tableData = cache
            this.loading = false
          } else {
            if (arr.length) {
              arr.map(item => {
                item.medical_dose = Number(item.medical_dose)
                item.medical_total_fee = (Number(item.medical_fee) * item.medical_num).toFixed(2)
              })
              this.tableData = arr
              localStorage.patientTxyz = JSON.stringify(this.tableData)
              this.loading = false
            } else {
              this.tableData = [
                {
                  prescribeid: '', // 数据id
                  medical_id: '', // 药物id
                  medical_trade: '', // 化学名
                  medical_name: '', // 商品名
                  medical_spec: '-', // 规格
                  medical_unit: '-', // 剂量单位
                  medical_units: '-', // 组装单位
                  medical_fee: '-', // 药品单价
                  medical_total_fee: '-', // 总价
                  medical_dose: '', // 服用剂量
                  medical_usage: '', // 服用方式
                  medical_rate: '', // 服用频率
                  medical_days: 3, // 服用天数
                  medical_num: 1, // 开具数量
                  medical_status: '0' // 状态
                }
              ]
              localStorage.patientTxyz = JSON.stringify(this.tableData)
              this.loading = false
            }
          }
        })
    },
    // tableData为最新值
    getDetail (row) {
      var rows = this.tableData[row._index]
      rows.prescribeid = row.prescribeid
      rows.medical_id = row.medical_id
      rows.medical_trade = row.medical_trade
      rows.medical_name = row.medical_name
      rows.medical_spec = row.medical_spec
      rows.medical_unit = row.medical_unit
      rows.medical_units = row.medical_units
      rows.medical_fee = row.medical_fee
      rows.medical_total_fee = (Number(row.medical_fee) * row.medical_num).toFixed(2)
      rows.medical_dose = row.medical_dose
      rows.medical_usage = row.medical_usage
      rows.medical_rate = row.medical_rate
      rows.medical_days = row.medical_days
      rows.medical_num = row.medical_num
      rows.medical_status = row.medical_status
    },
    // 搜索药物
    getMedicineList (keyword = '') {
      treated
        .writeYZSearch({
          keyword
        })
        .then(res => {
          this.medicList = res.data
        })
    },
    // 用药医嘱
    getZy (e) {
      if (e) {
        var index = this.selectData.evades.findIndex(item => item.name === e)
        this.gbzy = this.selectData.evades[index].content
      } else {
        this.gbzy = ''
      }
    },
    // 开单
    billing () {
      var arr = deepClone(this.tableData)
      if (arr.length) {
        arr.map((item, index) => {
          if (item.medical_id === '') {
            arr.splice(index, 1)
            return
          }
          delete item.medical_total_fee
        })
      }
      var data = {
        patid: this.patid,
        appointid: this.appointid,
        evade: this.gbzy,
        jsondata: JSON.stringify(arr)
      }

      this.loadingKD = true

      treated
        .writeYZBilling(data)
        .then(res => {
          if (res.status === 200) {
            this.$Message.success(res.msg)
            localStorage.patientTxyz = JSON.stringify([])
            this.getList()
          }
          this.loadingKD = false
        })
        .catch(() => {
          this.loadingKD = false
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
          .writeYZRefund({
            prescribeid: row.prescribeid
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
    this.getMedicineList()
  },
  watch: {
    tableData: {
      handler (val) {
        localStorage.patientTxyz = JSON.stringify(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './common.less';
.listItem {
  padding: 12px !important;
  box-sizing: border-box !important;
}

/deep/ .list_item_textarea {
  textarea.ivu-input {
    border: 0;
    outline: none;
    resize: none;
    color: #282d3c;
    font-size: 14px;
  }
  .ivu-input:hover {
    color: #282d3c;
    border-color: #fff;
  }
}
</style>
