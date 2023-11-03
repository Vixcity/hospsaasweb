<template>
  <div class="dataExport">
    <div class="moduleList">
      <div class="module">
        <div class="title">一般资料</div>
        <div class="flex" style="flex-wrap: wrap">
          <div class="flex aic mr80" style="margin-top: 17px">
            <div class="label">姓名</div>
            <div class="formItem">
              <Input
                v-model="chooseData.realname"
                placeholder="请输入姓名"
                style="width: 200px"
              ></Input>
            </div>
          </div>
          <div class="flex aic mr80" style="margin-top: 17px">
            <div class="label">性别</div>
            <div class="formItem">
              <Select v-model="chooseData.gender" placeholder="请选择性别" style="width: 200px">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </div>
          </div>
          <div class="flex aic mr80" style="margin-top: 17px">
            <div class="label">年龄</div>
            <div class="formItem">
              <Input
                v-model="chooseData.minage"
                placeholder="请输入年龄"
                type="number"
                style="width: 130px"
              ></Input>
            </div>
            <div style="margin: 0 4px">~</div>
            <div class="formItem">
              <Input
                v-model="chooseData.maxage"
                placeholder="请输入年龄"
                type="number"
                style="width: 130px"
              ></Input>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">评估量表</div>
        <div
          class="flex"
          style="flex-wrap: wrap"
          v-for="(item, index) in chooseData.evaluate"
          :key="index + 'chooseData.evaluate'"
        >
          <div class="flex aic mr80" style="width: 302px;margin-top: 17px;">
            <Select v-if="index !== 0" v-model="item.connt" style="width: 70px">
              <Option value="or">或者</Option>
              <Option value="and">并且</Option>
            </Select>
            <div class="label" :style="{ marginLeft: index !== 0 ? '8px' : '0' }">量表</div>
            <div class="formItem">
              <Select
                placeholder="请选择量表名称"
                v-model="item.evaid"
                filterable
                @on-change="changeSel($event, index)"
                :style="{ width: index === 0 ? '258px' : '180px' }"
              >
                <Option
                  v-for="(itemSel, indexSel) in evaluateList"
                  :value="itemSel.evaid"
                  :key="indexSel + 'evaluateList'"
                  :label="itemSel.evatit"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex aic mr80" style="margin-top: 17px;">
            <div class="label">题目</div>
            <div class="formItem">
              <div class="formItem">
                <Cascader
                  :data="item.quesarr"
                  v-model="item.quesid"
                  @on-change="changeQues($event, item)"
                  placeholder="请选择题目名称"
                  style="width: 200px"
                ></Cascader>
                <!-- <Select
                  v-model="item.quesid"
                  @on-change="changeQues($event, item)"
                  placeholder="请选择题目名称"
                  style="width: 200px"
                >
                  <Option
                    v-for="(itemQuestion, indexQuestion) in item.quesarr"
                    :key="'itemQuestion' + indexQuestion + index"
                    :value="itemQuestion.quesid"
                    :label="itemQuestion.questit"
                  ></Option>
                </Select> -->
              </div>
            </div>
          </div>
          <div class="flex aic mr80" style="margin-top: 17px;">
            <div class="label">分数</div>
            <div class="formItem" style="margin-right: 16px">
              <Input
                placeholder="请输入"
                v-model="item.minval"
                type="number"
                style="width: 75px"
              ></Input>
              ~
              <Input
                placeholder="请输入"
                v-model="item.maxval"
                type="number"
                style="width: 75px"
              ></Input>
            </div>
            <!-- <Checkbox v-model="item.checked" style="margin-right: 16px">提取因子</Checkbox> -->
            <i
              v-if="chooseData.evaluate.length !== 1"
              class="iconfont icon-shanchu red cur"
              style="font-size: 20px; margin-right: 10px"
              @click="deleteItem(index)"
            ></i>
            <i
              v-if="index === chooseData.evaluate.length - 1"
              class="iconfont icon-tianjia blue cur"
              style="font-size: 20px"
              @click="
                chooseData.evaluate.push({ name: '', label: '', questionList: [], connt: 'or' })
              "
            ></i>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">诊断信息</div>
        <div class="flex aic" style="margin-top: 17px">
          <div class="label">诊断</div>
          <div class="formItem">
            <div class="formItem">
              <Select
                v-model="chooseData.diagnose"
                placeholder="请选择诊断信息"
                filterable
                multiple
                style="min-width: 200px"
              >
                <Option
                  v-for="(item, index) in diagnoseList"
                  :key="index + 'diagnoseList'"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">脱敏治疗</div>
        <div class="flex" style="margin-top: 17px">
          <div class="flex aic mr80">
            <div class="label">脱敏药物</div>
            <div class="formItem">
              <div class="formItem">
                <Select
                  placeholder="请选择脱敏药物"
                  v-model="chooseData.medicine"
                  @on-change="changeMedic"
                  style="width: 200px"
                >
                  <Option
                    v-for="(item, index) in medicList"
                    :key="index + 'medicList'"
                    :value="item.tag"
                    :label="item.name"
                  ></Option>
                </Select>
              </div>
            </div>
          </div>
          <div class="flex aic">
            <div class="label">脱敏方案</div>
            <div class="formItem">
              <div class="formItem">
                <Select
                  v-model="chooseData.scheme"
                  placeholder="请选择脱敏方案"
                  style="width: 200px"
                >
                  <Option
                    v-for="(item, index) in tmfaList"
                    :key="index + 'tmfaList'"
                    :value="item.tag"
                    :label="item.name"
                  ></Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">检验检查</div>
        <div class="flex aic" style="margin-top: 17px">
          <div class="label">检验检查</div>
          <div class="formItem">
            <div class="formItem">
              <Select
                v-model="chooseData.inspect"
                placeholder="请选择"
                multiple
                filterable
                style="min-width: 200px"
              >
                <Option
                  v-for="(itemCheck, indexCheck) in inspectList"
                  :key="indexCheck + 'inspectList'"
                  :value="itemCheck.inspcode"
                  :label="itemCheck.inspname"
                ></Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex jcc">
      <Button type="primary" style="margin-top: 40px; text-align: center" @click="exportData">
        导 出
      </Button>
    </div>
    <!-- 导出结果 -->
    <el-dialog
      title="导出结果"
      :visible.sync="showXZ"
      width="320px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex aic" style="margin-left: 40px">
        <i class="iconfont icon-a-EXCEL green" style="font-size: 18px; margin-right: 8px"></i>
        <span style="font-size: 14px" class="black">{{ filename }}</span>
      </div>
      <div slot="footer">
        <Button type="primary" @click="download">下 载</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dataExport } from '@/api/scientificData/index'
import { common } from '@/api/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'dataExport',
  data () {
    return {
      evaluateList: [],
      showXZ: false,
      filename: '',
      inspectList: [],
      chooseData: {
        evaluate: [{}]
      },
      diagnoseList: [],
      medicList: [],
      tmfaList: []
      // evaluateList: [{ name: '', label: '', questionList: [] }]
    }
  },
  methods: {
    changeSel (e, i) {
      let index = this.evaluateList.findIndex(item => item.evaid === e)
      let item = this.chooseData.evaluate[i]
      item.minval = ''
      item.maxval = ''
      item.quesid = []
      item.quesarr = deepClone(this.evaluateList[index].quesarr)
      item.quesarr = item.quesarr.map((itemSon, indexSon) => {
        itemSon.label = itemSon.questit
        itemSon.value = indexSon
        itemSon.children = itemSon.sub.map((itemSub, indexSub) => {
          itemSub.value = indexSub
          itemSub.label = itemSub.questit
          return itemSub
        })
        return itemSon
      })
    },
    changeQues (e, item) {
      if (e.length === 0) {
        item.minval = ''
        item.maxval = ''
        return
      }
      let ques = {}
      if (e.length < 2) {
        ques = item.quesarr[e[0]]
      } else {
        ques = item.quesarr[e[0]].sub[e[1]]
      }

      // console.log(ques)
      item.minval = Number(ques.quesmin)
      item.maxval = Number(ques.quesmax)
    },
    changeMedic (e) {
      let i = this.medicList.findIndex(item => {
        return item.tag === e
      })
      let item = this.medicList[i]
      this.tmfaList = deepClone(item.tmfa)
    },
    deleteItem (i) {
      this.chooseData.evaluate.splice(i, 1)
    },
    download () {
      common
        .downloadExcel({
          filename: this.filename
        })
        .then(res => {
          this.showXZ = false
        })
    },
    exportData () {
      // console.log(this.chooseData)
      let evaluate = this.chooseData.evaluate.map(item => {
        // console.log(item)
        return item.quesid
          ? {
            connt: item.connt || '',
            evaid: item.evaid,
            factor:
                item.quesid.length > 0
                  ? item.quesarr[item.quesid[0]].questit === '量表总分'
                    ? 'score'
                    : 'ques'
                  : '',
            quesid:
                item.quesid.length > 0
                  ? item.quesid.length > 1
                    ? item.quesarr[item.quesid[0]].sub[item.quesid[1]].quesid
                    : item.quesarr[item.quesid[0]].quesid
                  : '',
            minval: item.minval,
            maxval: item.maxval
          }
          : {}
      })

      if (JSON.stringify(evaluate[0]) !== '{}') {
        let index = evaluate.findIndex(item => {
          console.log(item)
          if (!item.factor) {
            return true
          } else if (!item.evaid) {
            return true
          } else if (item.minval === '' || item.maxval === '') {
            return true
          }
        })

        if (index !== -1) {
          this.$Message.error('请填写完整第' + (index + 1) + '条量表的数据')
          return
        }
      }

      let param = {
        realname: this.chooseData.realname || '',
        gender: this.chooseData.gender || '',
        minage:
          (this.chooseData.maxage > this.chooseData.minage
            ? this.chooseData.minage
            : this.chooseData.maxage) || '',
        maxage:
          (this.chooseData.maxage > this.chooseData.minage
            ? this.chooseData.maxage
            : this.chooseData.minage) || '',
        diagnose: this.chooseData.diagnose ? this.chooseData.diagnose.toString() : '',
        medicine: this.chooseData.medicine || '',
        scheme: this.chooseData.scheme || '',
        inspect: this.chooseData.inspect ? this.chooseData.inspect.toString() : '',
        evaluate: JSON.stringify(evaluate) === '[{}]' ? '' : JSON.stringify(evaluate)
      }

      // console.log(param)
      // return
      dataExport.export(param).then(res => {
        let data = res.data
        this.filename = data
        // console.log(data)
        this.showXZ = true
      })
    },
    getDetail () {
      dataExport.init().then(res => {
        let data = res.data
        this.diagnoseList = data.diagnose
        this.inspectList = data.inspect
        this.medicList = data.tuomin
        this.evaluateList = data.evaluate
        // console.log(data)
      })
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
@import './dataExport.less';
/deep/.ivu-checkbox {
  margin-right: 8px;
}
/deep/.ivu-cascader-not-found-tip {
  padding: 8px 16px !important;
}
</style>
