<template>
  <div v-loading="loading">
    <div class="inventory" v-if="sign === 1">
      <!-- <div class="inventory_head">
        <div class="inventory_head_title"></div>
        <div class="inventory_head_title">诊断：过敏性鼻炎；哮喘</div>
        <div class="inventory_head_history" @click="sign = 2">历史评估记录</div>
      </div> -->

      <!-- 患者 -->
      <div class="inventory_patient">
        <div class="inventory_title inventory_head">
          <div>患者自评量表</div>
          <div class="inventory_head_history" style="font-size: 14px" @click="sign = 2">历史评估记录</div>
        </div>
        <Table
          @on-selection-change="onSelect"
          ref="patientColumns"
          :columns="patientColumns"
          :data="patientData"
        ></Table>
        <div class="inventory_btn">
          <div @click="sendInventory">发送量表</div>
        </div>
      </div>

      <!-- 医生 -->
      <div class="inventory_doctor">
        <div class="inventory_title">医生评估量表</div>
        <Table
          :columns="doctorColumns"
          @on-selection-change="onSelects"
          ref="doctorColumns"
          :data="doctorData"
        ></Table>
        <div class="inventory_btn">
          <div @click="sendDoctorInventory">开始评估</div>
        </div>
      </div>
    </div>

    <!-- 历史评估记录 -->
    <HistoryLb v-if="sign === 2" @pre="sign = 1"></HistoryLb>

    <!-- 量表评估(患者) -->
    <el-dialog
      title="量表评估"
      :visible.sync="inventory"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <div class="inventory_cont_title" v-if="step === 3">
          <div>SCORAD（特应性皮炎严重程度指数）</div>
          <section>
            总分
            <span>22</span>
            分
          </section>
        </div>
        <div class="inventory_cont_list" v-if="step === 3">
          <div class="inventory_cont_list_item" v-for="(item, index) in inventoryData" :key="index">
            <div>{{ index + 1 }}. {{ item.title }}</div>
            <div>答: {{ item.answer }} ({{ item.mark }}分)</div>
          </div>
        </div>
        <div class="inventory_cont_list" v-else>
          <div class="inventory_cont_list_item" v-for="(item, index) in subjectData" :key="index">
            <div>{{ index + 1 }}. {{ item.title }}</div>
            <div>{{ item.answer }} {{ item.mark }}</div>
          </div>
        </div>
      </div>
      <!-- </Modal> -->
    </el-dialog>

    <!-- 量表评估(医生) -->
    <el-dialog
      title="量表评估"
      :visible.sync="doctorInventory"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <div class="inventory_cont_list">
          <div
            class="inventory_cont_list_item"
            v-for="(item, index) in doctorQuestion"
            :key="index"
          >
            <div>{{ index + 1 }}. {{ item.question_title }}</div>
            <div>
              <RadioGroup v-model="item.answer_id" v-if="item.answer_type === 'radio'">
                <Radio
                  v-for="(itemRadio, indexRadio) in item.answers"
                  :key="index + 'item.answer' + indexRadio"
                  :label="itemRadio.answer_id"
                >
                  {{ itemRadio.content }}
                </Radio>
              </RadioGroup>
              <Input
                v-model="item.answer_id"
                placeholder="请输入"
                v-if="item.answer_type === 'input'"
              />
              <CheckboxGroup v-model="item.answer_id" v-if="item.answer_type === 'checkbox'">
                <Checkbox label="1">
                  <span>无</span>
                </Checkbox>
                <Checkbox label="2">
                  <span>轻度</span>
                </Checkbox>
                <Checkbox label="3">
                  <span>中度</span>
                </Checkbox>
                <Checkbox label="4">
                  <span>重度</span>
                </Checkbox>
              </CheckboxGroup>
              <div v-if="item.answer_type === 'slider'" style="margin-bottom: 0">
                <Slider
                  v-model="item.answer_id"
                  style="padding: 0 10px"
                  :max="10"
                  :tip-format="formatSlider"
                ></Slider>
                <div class="flex jcsb">
                  <div class="flex gray" style="flex-direction: column; margin-bottom: 0">
                    <i
                      class="iconfont icon-shangjiantou"
                      style="font-size: 20px; text-align: left"
                    ></i>
                    <span>{{ item.answers[0].content }}</span>
                  </div>
                  <div class="flex gray" style="flex-direction: column; margin-bottom: 0">
                    <i
                      class="iconfont icon-shangjiantou"
                      style="font-size: 20px; text-align: right"
                    ></i>
                    <span>{{ item.answers[1].content }}</span>
                  </div>
                </div>
              </div>
              <div v-if="item.answer_type === 'hundred'" style="padding: 0 12px; margin-bottom: 0">
                <Slider
                  v-model="item.answer_id"
                  style="padding: 0 12px"
                  :tip-format="format"
                ></Slider>
                <div class="flex jcsb">
                  <div class="flex gray" style="flex-direction: column; margin-bottom: 0">
                    <i
                      class="iconfont icon-shangjiantou"
                      style="font-size: 20px; text-align: left"
                    ></i>
                    <span>{{ item.answers[0].content }}</span>
                  </div>
                  <div class="flex gray" style="flex-direction: column; margin-bottom: 0">
                    <i
                      class="iconfont icon-shangjiantou"
                      style="font-size: 20px; text-align: right"
                    ></i>
                    <span>{{ item.answers[1].content }}</span>
                  </div>
                </div>
              </div>

              <TimePicker
                :editable="false"
                format="HH:mm"
                v-model="item.answer_id"
                placeholder="请选择"
                v-if="item.answer_type === 'time'"
              ></TimePicker>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" style="margin-left: 8px">提 交</Button>
      </div>
    </el-dialog>

    <!-- 量表评估-结果(医生) -->
    <el-dialog
      title="量表评估"
      :visible.sync="doctorResultInventory"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <div class="inventory_cont_title">
          <div>SCORAD（特应性皮炎严重程度指数）</div>
          <section>
            总分
            <span>22</span>
            分
          </section>
        </div>
        <div class="inventory_cont_list">
          <div
            class="inventory_cont_list_item"
            v-for="(item, index) in inventoryResultData"
            :key="index"
          >
            <div>{{ index + 1 }}. {{ item.title }}</div>
            <div>答: {{ item.answer }} ({{ item.mark }}分)</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import HistoryLb from './history_lb.vue'
export default {
  name: 'lbpg',
  data () {
    return {
      sign: 1,
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      newcode: '',
      relateid: '',
      loading: false,
      patientColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '简称',
          key: 'shorthand'
        },
        {
          title: '全称',
          key: 'title',
          width: 350
        },
        {
          title: '题数',
          key: 'total',
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: obj.row.total === null ? '#969BAA' : '#282d3c'
                  }
                },
                obj.row.total || '-'
              )
            ])
          }
        }
      ],
      patientData: [],
      patientSelectList: [],
      doctorSelectList: [],
      doctorColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '简称',
          key: 'shorthand'
        },
        {
          title: '全称',
          key: 'title',
          width: 350
        },
        {
          title: '题数',
          key: 'total',
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: obj.row.total === null ? '#969BAA' : '#282d3c'
                  }
                },
                obj.row.total || '-'
              )
            ])
          }
        }
      ],
      doctorData: [],
      inventory: false,
      inventoryData: [],
      step: 1,
      subjectData: [],
      doctorInventory: false,
      doctorQuestion: [],
      mark: '',
      doctorResultInventory: false,
      inventoryResultData: []
    }
  },
  components: {
    HistoryLb
  },
  methods: {
    // 患者发送量表
    sendInventory () {
      if (this.patientSelectList.length === 0) {
        this.$Message.error('请选择要发送的量表')
        return
      }
      treated
        .sendSave({
          patid: this.patid,
          appointid: this.appointid,
          evatype: 'self',
          evaids: this.patientSelectList.toString()
        })
        .then(res => {
          this.$Message.success(res.msg)
          this.$refs.patientColumns.selectAll(false)
        })
    },
    // 医生发送量表
    sendDoctorInventory () {
      if (this.doctorSelectList.length === 0) {
        this.$Message.error('请选择要评估的量表')
        return
      }
      this.loading = true
      treated
        .sendSave({
          patid: this.patid,
          appointid: this.appointid,
          evatype: 'him',
          evaids: this.doctorSelectList.toString()
        })
        .then(res => {
          if (res.msg === '发送成功') {
            this.relateid = res.data
            this.getQuestion()
          }
        })
    },
    // 获取题目
    getQuestion () {
      treated
        .getQuestion({
          evaids: this.doctorSelectList.toString()
        })
        .then(res => {
          let data = res.data
          this.newcode = data.newcode
          data.evas.forEach(item => {
            item.answer_id = item.default_answer[0] + ''
          })
          this.doctorQuestion = data.evas
          this.doctorInventory = true
          this.loading = false
          // console.log(data)
        })
    },
    // 提交
    saveEdit () {
      let arr = []
      this.doctorQuestion.forEach(item => {
        // console.log(item)
        if (item.answer_type === 'hundred') {
          arr.push({
            eva_id: item.eva_id,
            question_id: item.question_id,
            answer_id: item.answer_id,
            value: item.answer_id + '%'
          })
        } else if (item.answer_type === 'slider') {
          arr.push({
            eva_id: item.eva_id,
            question_id: item.question_id,
            answer_id: item.answer_id,
            value: item.answer_id + '分'
          })
        } else if (item.answer_type === 'radio') {
          let obj = item.answers.find(itemAns => itemAns.answer_id === item.answer_id)
          arr.push({
            eva_id: item.eva_id,
            question_id: item.question_id,
            answer_id: item.answer_id,
            value: obj.content
          })
        }
      })
      // console.log(arr)
      treated
        .saveQuestion({
          patid: this.patid,
          relateid: this.relateid,
          newcode: this.newcode,
          answers: JSON.stringify(arr)
        })
        .then(res => {
          // let data = res.data
          // console.log(data)
          this.$Message.success('提交成功')
          this.doctorInventory = false
          this.$refs.doctorColumns.selectAll(false)
        })
    },
    // 选中高亮
    onSelect (selection, row) {
      this.patientSelectList = selection.map(item => item.evaid)
      for (const key in this.$refs.patientColumns.objData) {
        if (Object.hasOwnProperty.call(this.$refs.patientColumns.objData, key)) {
          const item = this.$refs.patientColumns.objData[key]
          if (item._isChecked) {
            item._isHighlight = true
          } else {
            item._isHighlight = false
          }
        }
      }
    },
    onSelects (selection, row) {
      this.doctorSelectList = selection.map(item => item.evaid)
      for (const key in this.$refs.doctorColumns.objData) {
        if (Object.hasOwnProperty.call(this.$refs.doctorColumns.objData, key)) {
          const item = this.$refs.doctorColumns.objData[key]
          if (item._isChecked) {
            item._isHighlight = true
          } else {
            item._isHighlight = false
          }
        }
      }
    },
    format (val) {
      return val + '%'
    },
    formatSlider (val) {
      return val + '分'
    },
    getList () {
      this.loading = true
      treated
        .LBList({
          appointid: this.appointid
        })
        .then(res => {
          let data = res.data
          this.patientData = data.evaself
          this.doctorData = data.evahim
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-slider {
  margin-bottom: 0 !important;
  .ivu-slider-button {
    width: 16px;
    height: 16px;
  }
  .ivu-slider-button-wrap {
    top: -2px;
  }
  .ivu-slider-wrap {
    margin-bottom: 0;
    border-radius: 10px;
    height: 12px;
    background-image: linear-gradient(to right, #d6e3ff, #004df9);
  }
  .ivu-slider-bar {
    background: transparent !important;
  }
}
.inventory {
  .inventory_head {
    font-size: 14px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .inventory_head_title {
      color: #282d3c;
      line-height: 17px;
    }
    .inventory_head_history {
      color: #3171ff;
      line-height: 20px;
      cursor: pointer;
    }
  }
  .inventory_title {
    font-size: 16px;
    font-weight: 500;
    color: #282d3c;
    line-height: 20px;
    padding-left: 12px;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 8px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 4px;
      height: 18px;
      background: #3171ff;
    }
  }
  .inventory_btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 16px;
    div {
      width: 89px;
      height: 32px;
      text-align: center;
      background: #3171ff;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 32px;
      cursor: pointer;
    }
  }
  // .inventory_patient {
  //   margin-top: 16px;
  // }
  .inventory_doctor {
    margin-top: 24px;
  }
}

// 量表评估
.inventory_cont {
  .inventory_cont_title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
      margin-bottom: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      &:last-child {
        margin-bottom: 0;
      }
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .inventory_cont_mark {
    display: flex;
    align-items: center;
    margin-top: 30px;
    .inventory_cont_mark_title {
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      margin-right: 8px;
    }
    .inventory_cont_mark_ipt {
      width: 110px;
      position: relative;
      /deep/ .ivu-input {
        padding-right: 30px;
        box-sizing: border-box;
      }
      .inventory_cont_mark_ipt_tip {
        position: absolute;
        top: 6px;
        right: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #282d3c;
      }
    }
  }
}
</style>
