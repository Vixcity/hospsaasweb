<template>
  <div class="view" v-loading="loading">
    <div class="view_head" v-if="!noData">
      <div class="view_head_left"></div>
      <div class="view_head_right">
        <div class="view_head_right_item">
          <i
            class="iconfont icon-quanxishitu-zhenduan gray"
            style="font-size: 16px; margin-right: 8px"
          ></i>
          <div>诊断</div>
        </div>
        <div class="view_head_right_item">
          <i
            class="iconfont icon-quanxishitu-yongyaoyizhu gray"
            style="font-size: 16px; margin-right: 8px"
          ></i>
          <div>用药医嘱</div>
        </div>
        <div class="view_head_right_item">
          <i
            class="iconfont icon-quanxishitu-jianyanjiancha gray"
            style="font-size: 16px; margin-right: 8px"
          ></i>
          <div>检验检查</div>
        </div>
        <div class="view_head_right_item">
          <i
            class="iconfont icon-quanxishitu-liangbiaopinggu gray"
            style="font-size: 16px; margin-right: 8px"
          ></i>
          <div>量表评估</div>
          <i
            @click="examinePG"
            class="iconfont icon-quanxishitu-pingguqushi blue"
            style="font-size: 16px; margin-left: 8px; cursor: pointer"
          ></i>
        </div>
        <div class="view_head_right_item">
          <i class="iconfont icon-tuominjilu gray" style="font-size: 16px; margin-right: 8px"></i>
          <div>脱敏记录</div>
        </div>
        <div class="view_head_right_item">
          <i class="iconfont icon-xuanjiao gray" style="font-size: 16px; margin-right: 8px"></i>
          <div>健康宣教</div>
        </div>
      </div>
    </div>
    <div v-if="!noData">
      <div v-for="(item, index) in tableData" :key="index + 'tableData'">
        <div class="view_break">
          <div class="view_break_left"></div>
          <div class="view_break_right">
            <div>{{ index }}年</div>
          </div>
        </div>
        <div class="view_list">
          <div class="view_list_item" v-for="(itemSon, indexSon) in item" :key="indexSon + 'item'">
            <div class="view_list_item_left">{{ itemSon.viewdate }}</div>
            <div class="view_list_item_right">
              <div class="view_list_item_right_txt">
                <div @click="showDiagnose(itemSon)">{{ itemSon.diagnose }}</div>
              </div>
              <div class="view_list_item_right_txt">
                <div v-for="(txt, i) in itemSon.prescribe" :key="i" @click="showMedicine(itemSon)">
                  {{ txt.name }} - {{ txt.dose }}
                </div>
              </div>
              <div class="view_list_item_right_txt">
                <div v-for="(txt, i) in itemSon.inspect" :key="i" @click="showInspect(txt)">
                  {{ txt.name }}
                </div>
              </div>
              <div class="view_list_item_right_txt">
                <div v-for="(txt, i) in itemSon.evaluate" :key="i" @click="showInventory(txt)">
                  {{ txt.evatit }}
                </div>
              </div>
              <div class="view_list_item_right_txt">
                <div v-for="(txt, i) in itemSon.tuomin" style="cursor: default" :key="i">
                  {{ txt.name }} - {{ txt.tmfa }}
                </div>
              </div>
              <div class="view_list_item_right_txt">
                <div v-for="(txt, i) in itemSon.xuan" style="cursor: default" :key="i">
                  {{ txt }}
                </div>
              </div>
            </div>
            <img class="view_list_item_point" src="@/assets/images/patient/point.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex aic jcc" style="padding-top: 80px">
      <div class="gray tc">
        <img src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">该患者为初诊，暂无全息视图</div>
      </div>
    </div>

    <!-- 诊断 -->
    <el-dialog
      title="病历信息"
      :visible.sync="diagnose"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="diagnose_list">
        <div
          class="history_case_right_item"
          v-for="(item, index) in diagnoseData"
          :key="index + 'diagnoseData'"
        >
          <div class="history_case_right_item_left">{{ item.title }}：</div>
          <div class="history_case_right_item_right" v-if="item.key === 'visittype'">
            {{ BLList[item.key] === 'first' ? '初诊' : '复诊' }}
          </div>
          <div class="history_case_right_item_right" v-else-if="!item.list">
            {{ BLList[item.key] }}
          </div>
          <div class="history_case_right_item_txt" v-if="item.list">
            <div v-for="(txt, i) in item.list" :key="i + 'item.list'">
              {{ txt.title }}{{ BLList[txt.key] }}
            </div>
          </div>
        </div>

        <!-- <div class="diagnose_list_item" v-for="(item, index) in diagnoseData" :key="index">
          <div class="diagnose_list_item_left">{{ item.title }}</div>
          <div class="diagnose_list_item_right" v-if="item.value">{{ item.value }}</div>
          <div class="diagnose_list_item_txt" v-if="item.list">
            <div v-for="(txt, i) in item.list" :key="i">{{ txt }}</div>
          </div>
        </div> -->
      </div>
    </el-dialog>

    <!-- 医嘱 -->
    <el-dialog
      title="医嘱信息"
      :visible.sync="medicine"
      width="1000px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="table_style">
        <Table :columns="medicineColumns" :data="medicineData"></Table>
      </div>
    </el-dialog>

    <!-- 检验检查 -->
    <el-dialog
      title="检验检查"
      :visible.sync="inspect"
      width="800px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="table_style">
        <Table :columns="inspectColumns" :data="inspectData"></Table>
      </div>
    </el-dialog>

    <!-- 量表评估 -->
    <el-dialog
      title="量表评估"
      :visible.sync="inventory"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <div class="inventory_cont_title">
          <div>{{ inventoryInfo.shorthand }}（{{ inventoryInfo.title }}）</div>
          <section>
            总分
            <span>{{ inventoryInfo.score }}</span>
            分
          </section>
        </div>
        <div class="inventory_cont_list">
          <div class="inventory_cont_list_item" v-for="(item, index) in inventoryData" :key="index">
            <div>{{ item.number }}. {{ item.title }}</div>
            <!-- <div>答: {{ item.svalue }} ({{ item.score }})</div> -->
            <div>答: {{ item.svalue }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 评估趋势 -->
    <el-dialog
      title="量表评估趋势"
      :visible.sync="showPG"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <!-- 患者自测 -->
      <div class="history_inventory_patient" v-if="arrList.length">
        <div class="history_inventory_left">
          <div class="history_inventory_left_title black">患者自测</div>
          <div class="history_inventory_left_list">
            <div
              :class="[
                'history_inventory_left_item',
                patient_index === index ? 'history_inventory_left_item_active' : ''
              ]"
              v-for="(item, index) in arrList"
              :key="index"
              @click="getEvalDetail(item.evaid, index, 1)"
            >
              {{ item.shorthand + item.title }}
            </div>
          </div>
        </div>
        <div class="history_inventory_right">
          <chartsArea
            v-if="JSON.stringify(areaPatient) !== '{}'"
            style="height: 350px"
            :value="areaPatient"
          ></chartsArea>
        </div>
      </div>
      <div v-else class="history_inventory_empty">
        <div class="history_inventory_left_title black">患者自测</div>
        <div class="gray tc">
          <img src="@/assets/images/noData.png" style="height: 120px" alt="" />
          <div style="margin-top: 16px">暂无量表评估</div>
        </div>
      </div>

      <div class="history_inventory_line"></div>

      <!-- 医生评估 -->
      <div class="history_inventory_doctor" v-if="doctorArrList.length">
        <div class="history_inventory_left">
          <div class="history_inventory_left_title black">医生评估</div>
          <div class="history_inventory_left_list">
            <div
              :class="[
                'history_inventory_left_item',
                doctor_index === index ? 'history_inventory_left_item_active' : ''
              ]"
              v-for="(item, index) in doctorArrList"
              :key="index"
              @click="getEvalDetail(item.evaid, index, 2)"
            >
              {{ item.shorthand + item.title }}
            </div>
          </div>
        </div>
        <div class="history_inventory_right">
          <chartsArea
            v-if="JSON.stringify(areaDoctor) !== '{}'"
            ref="docArea"
            style="height: 350px"
            :value="areaDoctor"
          ></chartsArea>
        </div>
      </div>
      <div v-else class="history_inventory_empty">
        <div class="history_inventory_left_title">医生评估</div>
        <div class="gray tc">
          <img src="@/assets/images/noData.png" style="height: 120px" alt="" />
          <div style="margin-top: 16px">暂无量表评估</div>
        </div>
      </div>
    </el-dialog>
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
import { treated } from '@/api/treated/index'
import { pgData } from '@/api/scientificData/index'
import { check } from '@/api/check/index'
import { groupBy, throttle } from '@/libs/util'
import status_descend from '@/assets/images/patient/status_descend.png'
import chartsArea from './area.vue'
export default {
  name: 'qxst',
  components: {
    chartsArea
  },
  data () {
    return {
      showPG: false,
      noData: false,
      loading: false,
      patient_index: 0,
      doctor_index: 0,
      total: 0,
      page: 1,
      pageSize: 10,
      patid: this.$route.query.patid,
      watchImgList: [],
      showImgPath: '',
      originData: [],
      tableData: [],
      arrList: [],
      doctorArrList: [],
      BLList: {},
      areaPatient: {},
      areaDoctor: {},
      diagnose: false,
      diagnoseData: [
        {
          title: '初/复诊',
          key: 'visittype'
        },
        // {
        //   title: '发病日期',
        //   value: '2022-12-12'
        // },
        {
          title: '主诉',
          key: 'suit'
        },
        {
          title: '现病史',
          key: 'present'
        },
        {
          title: '过敏史',
          key: 'allergy'
        },
        {
          title: '疾病史',
          key: 'disease'
        },
        {
          title: '手术史',
          key: 'surgery'
        },
        {
          title: '外伤史',
          key: 'trauma'
        },
        {
          title: '婚育史',
          key: 'marry'
        },
        {
          title: '家族史',
          key: 'family'
        },
        {
          title: '各项评估',
          list: [
            {
              title: '疼痛评估：',
              key: 'vas'
            },
            {
              title: '心理评估：',
              key: 'psy'
            },
            {
              title: '交通工具：',
              key: 'car'
            }
          ]
        },
        {
          title: '诊断结果',
          key: 'diagnose'
        }
      ],
      medicine: false,
      medicineColumns: [
        {
          title: '序号',
          key: 'prescribeid',
          width: 80
        },
        {
          title: '药品名称',
          key: 'medical_name'
        },
        {
          title: '规格',
          key: 'medical_spec',
          width: 80
        },
        {
          title: '剂量',
          key: 'medical_dose',
          width: 80
        },
        {
          title: '剂量单位',
          key: 'medical_unit',
          width: 100
        },
        {
          title: '服用方式',
          key: 'medical_usage',
          width: 120
        },
        {
          title: '用法',
          key: 'medical_rate',
          width: 120
        },
        {
          title: '数量',
          key: 'medical_num',
          width: 80
        },
        {
          title: '单位',
          key: 'medical_units',
          width: 80
        },
        {
          title: '用药天数',
          key: 'medical_days',
          width: 100
        }
      ],
      medicineData: [],
      inspect: false,
      inspectColumns: [
        {
          title: '序号',
          key: 'id',
          width: 80
        },
        {
          title: '检验项目',
          key: 'name'
        },
        {
          title: '检验结果',
          key: 'result',
          width: 100
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          render: (h, obj) => {
            return h('div', [
              h(
                'img',
                {
                  attrs: {
                    src: status_descend
                  },
                  style: {
                    width: '18px',
                    height: '18px',
                    display: obj.row.status === 1 ? 'block' : 'none'
                  }
                },
                ''
              ),
              h(
                'span',
                {
                  style: {
                    display: obj.row.status === 2 ? 'block' : 'none'
                  }
                },
                ''
              )
            ])
          }
        },
        {
          title: '单位',
          key: 'unit',
          width: 100
        },
        {
          title: '参考范围',
          key: 'range',
          width: 150
        }
      ],
      inspectData: [],
      inventory: false,
      inventoryData: [],
      inventoryInfo: {}
    }
  },
  methods: {
    // 诊断
    showDiagnose (row) {
      treated
        .blView({
          appointid: row.appointid
        })
        .then(res => {
          let data = res.data
          this.BLList = data
          this.diagnose = true
        })
    },
    // 医嘱
    showMedicine (row) {
      treated
        .drugAdvice({
          appointid: row.appointid
        })
        .then(res => {
          let data = res.data
          this.medicineData = data.prescribe
          this.medicine = true
        })
    },
    // 检验检查
    showInspect (row) {
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
      // this.inspect = true
    },
    // 量表评估
    showInventory (row) {
      if (!row.evacode) {
        this.$Message.error('请先完成量表评估')
        return
      }
      pgData
        .detail({
          patid: this.patid,
          evaid: row.evaid,
          evacode: row.evacode
        })
        .then(res => {
          let data = res.data
          data.lists.sort(function (a, b) {
            return Number(a.number) - Number(b.number)
          })
          this.inventoryData = data.lists
          this.inventoryInfo = data.info
          this.inventory = true
        })
    },
    // 查看评估
    examinePG () {
      this.showPG = true
      if (this.arrList.length) {
        this.getEvalData(this.arrList[0].evaid, 1)
        this.getEvalData(this.arrList[0].evaid, 2)
      }
    },
    // 查看评估
    getEvalDetail (evaid, index, i) {
      if (i === 1) {
        if (this.patient_index === index) return
        this.patient_index = index
        this.getEvalData(evaid, i)
      } else if (i === 2) {
        if (this.doctor_index === index) return
        this.doctor_index = index
        this.getEvalData(evaid, i)
      }
    },
    // 查看评估详情
    getEvalData (evaid, index) {
      treated
        .evalData({
          patid: this.patid,
          evaid
        })
        .then(res => {
          if (index === 1) {
            this.areaPatient = {
              xAxis: res.data.xaxis,
              yAxis: res.data.yaxis,
              color: '#3171FF',
              bg_color1: 'rgba(49,113,255,0.57)',
              bg_color2: 'rgba(49,113,255,0)'
            }
          } else if (index === 2) {
            this.areaDoctor = {
              xAxis: res.data.xaxis,
              yAxis: res.data.yaxis,
              color: '#55D2D4',
              bg_color1: 'rgba(85,209,211,0.76)',
              bg_color2: 'rgba(85,210,212,0)'
            }
          }
        })
    },
    getList: throttle(function () {
      treated
        .evalTrend({
          patid: this.patid
        })
        .then(res => {
          this.arrList = res.data.evaself
          this.doctorArrList = res.data.evahim
          if (res.data.evaself.length) {
            this.getEvalData(res.data.evaself[0].evaid, 1)
          }
          if (res.data.evahim.length) {
            this.getEvalData(res.data.evahim[0].evaid, 2)
          }
        })
    }),
    getData () {
      this.loading = true
      treated
        .patView({
          patid: this.patid,
          page: this.page,
          limit: this.pageSize
        })
        .then(res => {
          let data = res.data
          if (data.lists.length === 0) {
            this.noData = true
            this.loading = false
            return
          }
          this.originData = this.originData.concat(data.lists)
          this.total = data.total
          this.page++
          this.tableData = groupBy(this.originData, 'viewyear')
          this.loading = false
        })
    },
    handleScroll () {
      // console.log(this.originData.length >= this.total)
      if (this.originData.length >= this.total) return
      let scrollTop = document.documentElement.scrollTop // 距顶部
      let clientHeight = document.documentElement.clientHeight // 可视区高度
      let scrollHeight = document.documentElement.scrollHeight // 滚动条总高度
      if (scrollTop + clientHeight === scrollHeight) {
        this.loading = true
        this.getData() // 每滑动到底部一次就调用一次接口
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll, true)
    })
    this.getData()
    this.getList()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less" scoped>
@import './common.less';
.view {
  .view_head {
    display: flex;
    padding: 16px;
    box-sizing: border-box;
    .view_head_left {
      width: 48px;
      margin-right: 12px;
    }
    .view_head_right {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0 20px;
      .view_head_right_item {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        div {
          font-size: 14px;
          font-weight: 400;
          color: #282d3c;
          line-height: 20px;
        }
      }
    }
  }
  .view_list {
    .view_list_item {
      display: flex;
      position: relative;
      .view_list_item_left {
        position: relative;
        top: 10px;
        width: 48px;
        height: 18px;
        line-height: 18px;
        background: #d6e3ff;
        font-size: 12px;
        font-weight: 400;
        color: #3171ff;
        text-align: center;
        margin-right: 12px;
      }
      .view_list_item_right {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 0 20px;
        border: 1px solid #d2d7e1;
        border-bottom: none;
        padding: 10px 16px;
        box-sizing: border-box;
        .view_list_item_right_txt {
          div {
            font-size: 14px;
            font-weight: 400;
            color: #282d3c;
            margin-bottom: 12px;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0;
            }
            &:hover {
              color: #3171ff;
            }
          }
        }
      }
      .view_list_item_point {
        width: 8px;
        height: 8px;
        position: absolute;
        top: 15px;
        left: 56px;
      }
      &:last-child > .view_list_item_right {
        border-bottom: 1px solid #d2d7e1;
      }
    }
  }
  .view_break {
    display: flex;
    .view_break_left {
      width: 48px;
      margin-right: 12px;
    }
    .view_break_right {
      flex: 1;
      height: 66px;
      border-left: 1px solid #d2d7e1;
      border-top: 1px solid #d2d7e1;
      border-right: 1px solid #d2d7e1;
      position: relative;
      div {
        position: absolute;
        top: 24px;
        left: -24px;
        width: 48px;
        height: 18px;
        background: #f5f5fa;
        font-size: 12px;
        font-weight: 400;
        color: #969baa;
        line-height: 18px;
        text-align: center;
      }
    }
  }
}

// 诊断
.diagnose_list {
  .diagnose_list_item {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    display: flex;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .diagnose_list_item_left {
      color: #969baa;
      width: 80px;
      text-align: right;
      margin-right: 10px;
    }
    .diagnose_list_item_right {
      color: #282d3c;
      flex: 1;
    }
    .diagnose_list_item_txt {
      color: #282d3c;
      flex: 1;
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 量表评估
.inventory_cont {
  .inventory_cont_title {
    display: flex;
    align-items: center;
    div {
      font-size: 16px;
      font-weight: 400;
      color: #282d3c;
      line-height: 21px;
    }
    section {
      font-size: 16px;
      font-weight: 400;
      color: #969baa;
      line-height: 21px;
      span {
        color: #f75559;
      }
    }
  }
  .inventory_cont_list {
    .inventory_cont_list_item {
      margin-top: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.history_inventory_left {
  width: 220px;
  .history_inventory_left_title {
    font-size: 14px;
    font-weight: 400;
    color: #282d3c;
    line-height: 17px;
    margin-bottom: 8px;
  }
  .history_inventory_left_list {
    height: 350px;
    overflow-y: auto;
    .history_inventory_left_item {
      width: 210px;
      height: 49px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      background: rgba(49, 113, 255, 0.1);
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      margin-bottom: 16px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .history_inventory_left_item_active {
      background: #3171ff !important;
      color: #ffffff !important;
    }
  }
}

.history_case_right_item {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  .history_case_right_item_left {
    color: #969baa;
    width: 100px;
    text-align: right;
  }
  .history_case_right_item_right {
    color: #282d3c;
    flex: 1;
  }
  .history_case_right_item_txt {
    color: #282d3c;
    flex: 1;
    div {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.history_inventory_patient {
  margin-top: 16px;
  display: flex;
}
.history_inventory_line {
  width: 100%;
  height: 1px;
  background: #d2d7e1;
  margin: 24px 0;
}
.history_inventory_doctor {
  display: flex;
}

.history_inventory_right {
  flex: 1;
}
</style>
