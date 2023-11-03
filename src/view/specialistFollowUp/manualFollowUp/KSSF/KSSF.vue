<template>
  <div class="KSSF">
    <div class="title">确认信息</div>
    <div class="cont">
      <div class="item flex aic">
        <div class="label">姓名</div>
        <Input
          v-model="this.chooseDetail.realname"
          style="width: 280px; margin-left: 8px"
          disabled
        />
      </div>
      <div class="item flex aic">
        <div class="label">性别</div>
        <Input v-model="this.chooseDetail.sex" style="width: 280px; margin-left: 8px" disabled />
      </div>
      <div class="item flex aic">
        <div class="label">年龄</div>
        <Input v-model="this.chooseDetail.age" style="width: 280px; margin-left: 8px" disabled />
      </div>
      <div class="item flex aic">
        <div class="label">联系电话</div>
        <Input v-model="this.chooseDetail.mobile" style="width: 280px; margin-left: 8px" disabled />
      </div>
      <div class="item flex aic">
        <div class="label">诊断</div>
        <Input
          v-model="this.chooseDetail.diagnose"
          style="width: 280px; margin-left: 8px"
          disabled
        />
      </div>
      <div class="item flex aic">
        <div class="label">离院天数</div>
        <Input
          v-model="this.chooseDetail.outdays"
          style="width: 280px; margin-left: 8px"
          disabled
        />
      </div>
      <div class="item flex aic">
        <div class="label">人工随访日期</div>
        <Input
          v-model="this.chooseDetail.followdate"
          style="width: 280px; margin-left: 8px"
          disabled
        />
      </div>
      <!-- <div class="item flex aic">
        <div class="label">脱敏药品</div>
        <Input v-model="this.chooseDetail.medic" style="width: 280px; margin-left: 8px" disabled />
      </div> -->
      <div class="item flex aic">
        <div class="label">随访模板</div>
        <Select
          @on-change="changeTempName"
          label-in-value
          style="width: 280px; margin-left: 8px"
          v-model="tempid"
        >
          <Option v-for="(item, index) in temList" :key="index + 'temList'" :value="item.tempid">
            {{ item.tempname }}
          </Option>
        </Select>
        <div
          class="blue flex aic"
          style="margin-left: 8px; cursor: pointer"
          @click="
            showEdit = true
            tempid = ''
          "
        >
          <i class="iconfont icon-tianjia blue" style="font-size: 16px; margin-right: 8px"></i>
          添加模板
        </div>
      </div>
    </div>
    <div class="flex jcc" style="margin-top: 40px">
      <Button @click="backPrev">返回上一级</Button>
      <Button type="primary" style="margin-left: 8px" @click="openSF">立即开始</Button>
    </div>
    <addFollowUpTem
      :tempid="tempid"
      :showEdit="showEdit"
      @save="saveEdit"
      @close="close"
    ></addFollowUpTem>
    <!-- 开始随访 -->
    <el-dialog
      :title="sfTemName"
      :visible.sync="showSF"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <div
          v-for="(item, index) in chooseQuestion.question"
          :key="index + 'sfsz'"
          class="mt16 black"
        >
          <div v-if="canShow(index)">
            {{ item.questit }}
            <div style="margin-top: 8px">
              <!-- 一级输入框 -->
              <Input v-if="item.questype === 'text'" v-model="item.value" placeholder="请输入" />
              <!-- 一级单选 -->
              <div class="flex" v-if="item.questype === 'radio'" style="width: 100%">
                <Select
                  v-model="item.value"
                  style="width: 120px"
                  @on-change="
                    item.itemCheckboxSecond = ''
                    $forceUpdate()
                  "
                >
                  <Option
                    v-for="(itemRadio, indexRadio) in item.options"
                    :key="indexRadio + 'itemRadio'"
                    :value="indexRadio"
                    :label="itemRadio.t"
                  ></Option>
                </Select>
                <div v-if="item.value || item.value === 0" style="margin-left: 8px; width: 100%">
                  <Select
                    v-if="
                      item.options[item.value].o.length > 0 &&
                      (item.options[item.value].otype === 'checkbox' ||
                        item.options[item.value].otype === 'radio')
                    "
                    :key="item.value"
                    v-model="item.itemCheckboxSecond"
                    :multiple="item.options[item.value].otype === 'checkbox'"
                    style="min-width: 120px"
                  >
                    <Option
                      v-for="(itemO, indexO) in item.options[item.value].o"
                      :key="indexO + 'itemO'"
                      :value="itemO.v"
                    >
                      {{ itemO.t }}
                    </Option>
                  </Select>
                  <Input
                    v-model="item.itemCheckboxSecond"
                    v-if="item.options[item.value].otype === 'text'"
                    placeholder="请输入内容"
                  ></Input>
                </div>
              </div>
              <!-- 一级复选 -->
              <div
                v-if="item.questype === 'checkbox'"
                style="display: flex; flex-direction: column"
              >
                <Checkbox
                  class="oneLevelCheckbox"
                  v-for="(itemCheckbox, indexCheckbox) in item.options"
                  :key="indexCheckbox + 'itemCheckbox'"
                  :label="itemCheckbox.v"
                  v-model="itemCheckbox.checked"
                  @on-change="
                    itemCheckbox.itemCheckboxSecond = itemCheckbox.otype === 'checkbox' ? [] : ''
                    $forceUpdate()
                  "
                >
                  {{ itemCheckbox.t }}
                  <!-- {{ itemCheckbox }} -->
                  <!-- 二级复选 -->
                  <CheckboxGroup
                    v-if="itemCheckbox.otype === 'checkbox' && itemCheckbox.checked"
                    v-model="itemCheckbox.itemCheckboxSecond"
                    style="margin-left: 16px; display: flex; flex-direction: column"
                  >
                    <Checkbox
                      v-for="(itemCheckboxSecond, indexCheckboxSecond) in itemCheckbox.o"
                      :key="indexCheckboxSecond + 'itemCheckbox.o'"
                      :label="itemCheckboxSecond.v"
                      style="margin-top: 8px"
                    >
                      {{ itemCheckboxSecond.t }}
                    </Checkbox>
                  </CheckboxGroup>
                  <!-- 二级单选 -->
                  <RadioGroup
                    v-model="itemCheckbox.itemCheckboxSecond"
                    v-if="itemCheckbox.otype === 'radio' && itemCheckbox.checked"
                    style="margin-left: 16px; display: flex; flex-direction: column"
                  >
                    <Radio
                      v-for="(itemCheckboxSecond, indexCheckboxSecond) in itemCheckbox.o"
                      :key="indexCheckboxSecond + 'itemCheckbox.o'"
                      style="margin-top: 8px"
                      :label="itemCheckboxSecond.v"
                    >
                      {{ itemCheckboxSecond.t }}
                    </Radio>
                  </RadioGroup>
                  <!-- 其他 -->
                  <Input
                    v-model="itemCheckbox.itemCheckboxSecond"
                    v-if="itemCheckbox.otype === 'text' && itemCheckbox.checked"
                    style="
                      margin-left: 16px;
                      display: flex;
                      margin-top: 8px;
                      flex-direction: column;
                    "
                    placeholder="请输入内容"
                  ></Input>
                </Checkbox>
              </div>
              <!-- 一级滑块 -->
              <div v-if="item.questype === 'slider'" style="padding: 0 30px 0 20px">
                <Slider v-model="item.value" :min="item.minval" :max="item.maxval"></Slider>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="flex aic" style="margin-top: 16px">
          <div>随访得分</div>
          <Input placeholder="请输入随访得分" type="number" style="margin-left: 8px;width: 150px">
            <div class="flex aic" slot="suffix" style="height: 100%">分</div>
          </Input>
        </div> -->
      </div>
      <div slot="footer">
        <Button type="primary" @click="endSF" :loading="loadingSF">完成随访</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { manualFollowUp } from '@/api/specialistFollowUp/index'
import addFollowUpTem from '@/components/addFollowUpTem/addFollowUpTem'
import { deepClone } from '@/libs/util'
export default {
  name: 'KSSF',
  props: ['chooseSF'],
  components: {
    addFollowUpTem
  },
  data () {
    return {
      sfTemName: '',
      showSF: false,
      showEdit: false,
      loadingSF: false,
      chooseDetail: {},
      tempid: '',
      temList: [],
      chooseQuestion: {}
    }
  },
  methods: {
    backPrev () {
      this.$emit('close')
    },
    changeTempName (e) {
      this.sfTemName = e.label.trim()
    },
    isNumber (obj) {
      return typeof obj === 'number' && !isNaN(obj)
    },
    endSF () {
      let notWriteIndex = this.chooseQuestion.question.findIndex(item => {
        if (item.questype === 'checkbox') {
          return item.options.findIndex(itemSon => itemSon.checked) === -1
        } else {
          return item.value === '' || item.value === undefined
        }
      })
      if (notWriteIndex !== -1 && this.canShow(notWriteIndex)) {
        this.$Message.error('请填写第' + (notWriteIndex + 1) + '题')
        return
      }

      let noWriteSon = false

      this.chooseQuestion.question.forEach((item, index) => {
        if (item.options.length !== 0 && this.canShow(index)) {
          if (item.questype !== 'checkbox') {
            if (!item.itemCheckboxSecond || item.itemCheckboxSecond.length === 0) {
              noWriteSon = true
            }
          } else {
            item.options.forEach(itemSon => {
              if (
                itemSon.checked &&
                (!itemSon.itemCheckboxSecond || itemSon.itemCheckboxSecond.length === 0)
              ) {
                noWriteSon = true
              }
            })
          }
        }
      })

      if (noWriteSon) {
        this.$Message.error('请填写子选项中的内容')
        return
      }

      /**
       * 单选: aaa
       * 多选: aaa|bbb|ccc
       * 单选单选: aaa: 123
       * 单选多选: aaa: 123,456
       * 多选单选: aaa: 123|bbb: 456
       * 多选多选: aaa: 123, 456|bbb: 789, 012
       */
      this.chooseQuestion.question.forEach((item, index) => {
        if (item.options.length !== 0 && this.canShow(index)) {
          if (item.questype === 'radio') {
            // 单选框
            item.valueStr =
              typeof item.value === 'number' ? item.options[item.value].t + ': ' : item.value
            if (typeof item.itemCheckboxSecond === 'string') {
              item.valueStr += item.itemCheckboxSecond
            } else {
              item.valueStr += item.itemCheckboxSecond.toString()
            }
          } else {
            item.value = ''
            item.options.forEach(itemSon => {
              item.value = item.value ? item.value + '|' : item.value
              if (itemSon.checked) {
                item.value = item.value ? item.value + itemSon.t + ':' : itemSon.t + ':'
              }
              if (itemSon.checked) {
                if (typeof itemSon.itemCheckboxSecond === 'string') {
                  item.value += itemSon.itemCheckboxSecond
                } else {
                  item.value += itemSon.itemCheckboxSecond.toString()
                }
              }
            })
          }
          // console.log(item.value, item.valueStr)
        }
      })

      // return

      let param = deepClone(this.chooseQuestion)
      param.answerdata = []
      param.question.forEach((item, index) => {
        console.log(item, this.canShow(index))
        if (item.effectid === 0 || this.canShow(index)) {
          param.answerdata.push({
            quesid: item.quesid,
            quesno: item.quesno,
            questit: item.questit,
            quesval: item.valueStr || item.value
          })
        }
      })
      param.answerdata = JSON.stringify(param.answerdata)
      // JSON.stringify(
      //   param.question.map(item => {
      //     return {
      //       quesid: item.quesid,
      //       quesno: item.quesno,
      //       questit: item.questit,
      //       quesval: item.valueStr || item.value
      //     }
      //   })
      // )
      // return

      this.loadingSF = true

      manualFollowUp
        .save(param)
        .then(res => {
          this.showSF = false
          this.$Message.success('保存成功')
          this.backPrev()
          this.loadingSF = false
        })
        .catch(() => {
          this.loadingSF = false
        })
    },
    saveEdit () {
      this.close()
      this.getDetail()
    },
    canShow (index) {
      // 当前题
      let item = this.chooseQuestion.question[index]
      if (item.effectid === 0) return true

      // 影响题目
      let affectedItem = this.chooseQuestion.question[item.effectno]
      if (typeof affectedItem.value === 'number') {
        let selectIndex = affectedItem.value
        return affectedItem.options[selectIndex].t === item.effectval
      }

      return false
    },
    close () {
      this.showEdit = false
    },
    openSF () {
      if (!this.tempid) {
        this.$Message.error('请选择随访模板')
        return
      }
      manualFollowUp
        .next({
          patientid: this.chooseDetail.patientid,
          appointid: this.chooseSF.appointid,
          followdate: this.chooseDetail.followdate,
          tempid: this.tempid
        })
        .then(res => {
          manualFollowUp.getTK({ dataid: res.data }).then(ress => {
            let data = ress.data
            data.question.forEach(item => {
              if (item.effectid !== 0) {
                item.effectno = data.question.findIndex(itemItem => {
                  return itemItem.quesid === item.effectid
                })
              }
            })
            this.chooseQuestion = data
            this.showSF = true
          })
        })
    },
    getDetail () {
      manualFollowUp
        .startSFInit({
          appointid: this.chooseSF.appointid
        })
        .then(res => {
          let data = res.data
          this.chooseDetail = data.info
          this.temList = data.temp
        })
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
@import '../manualFollowUp.less';
.mt16 {
  margin-top: 16px;
  &:first-child {
    margin-top: 0;
  }
}
.oneLevelCheckbox {
  margin-top: 12px;
  &:first-child {
    margin-top: 0;
  }
}
</style>
