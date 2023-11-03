<template>
  <el-dialog
    :title="tempid ? '修改随访模板' : '新增随访模板'"
    :visible.sync="show"
    width="860px"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="vertical-center-modal"
  >
    <div v-loading="loadingEdit">
      <div class="flex">
        <div class="flex aic">
          <div class="black">随访名称</div>
          <Input
            placeholder="请填写随访名称"
            v-model="chooseTem.name"
            style="margin-left: 8px; width: 160px"
          ></Input>
        </div>
        <div class="flex aic" style="margin-left: 40px">
          <div class="black">随访类型</div>
          <Select v-model="chooseTem.type" style="margin-left: 8px; width: 160px">
            <Option value="ren">人工随访</Option>
            <Option value="ai">AI随访</Option>
          </Select>
        </div>
      </div>
      <div class="line"></div>
      <div>
        <!-- 一级标题 -->
        <div
          v-for="(item, index) in chooseTem.ques"
          class="questionItem"
          :key="index + 'itemQuestion'"
        >
          <div class="flex jcsb" style="margin-top: 16px; width: 100%">
            <div class="flex aic">
              <div
                class="black"
                style="font-size: 14px; font-weight: 500; text-align: right; width: 80px"
              >
                题目名称{{ index + 1 }}
              </div>
              <Input
                placeholder="请输入题目名称"
                v-model="item.title"
                style="width: 260px; margin-left: 8px"
              ></Input>
              <RadioGroup
                style="margin-left: 8px"
                v-if="item.type === 'checkbox' || item.type === 'radio'"
                v-model="item.type"
              >
                <Radio label="radio">单选</Radio>
                <Radio label="checkbox">多选</Radio>
              </RadioGroup>
              <div
                class="red"
                style="cursor: pointer; margin-left: 8px"
                @click="deleteQuestion(index)"
              >
                删除
              </div>
              <div
                class="blue"
                style="cursor: pointer; margin-left: 8px"
                v-if="item.type === 'checkbox' || item.type === 'radio'"
                @click="addSelect(index)"
              >
                添加选项
              </div>
              <div
                v-if="index !== 0"
                class="blue"
                style="cursor: pointer; margin-left: 8px"
                @click="copyQuestion(index)"
              >
                复制上一题
              </div>
              <Checkbox
                v-if="index !== 0"
                style="margin-left: 8px"
                v-model="item.iseffectBol"
                @on-change="$forceUpdate()"
              >
                其他题影响
              </Checkbox>
              <Checkbox
                style="margin-left: 8px"
                v-model="item.ismustBol"
                @on-change="$forceUpdate()"
              >
                必填
              </Checkbox>
            </div>
            <div>
              <i
                class="iconfont icon-shangyi disabled"
                v-if="index === 0"
                style="cursor: not-allowed"
              ></i>
              <i
                class="iconfont icon-shangyi gray hoverChangeBlue"
                v-else
                style="cursor: pointer"
                @click="changeIndex('up', index)"
              ></i>
              <i
                class="iconfont icon-xiayi disabled"
                v-if="index === chooseTem.ques.length - 1"
                style="cursor: not-allowed"
              ></i>
              <i
                class="iconfont icon-xiayi gray hoverChangeBlue"
                v-else
                style="cursor: pointer"
                @click="changeIndex('down', index)"
              ></i>
            </div>
          </div>
          <div v-if="item.iseffectBol" style="margin-top: 16px">
            <div class="flex aic">
              <div class="gray" style="text-align: right; width: 80px">影响题目</div>
              <Select
                v-model="item.effectno"
                placeholder="请选择受第几题影响"
                style="width: 260px; margin-left: 8px"
                @on-change="$forceUpdate()"
              >
                <Option
                  v-for="(itemItem, itemIndex) in index"
                  :key="itemIndex + 'index'"
                  :value="itemIndex + 1"
                >
                  {{ chooseTem.ques[itemIndex].title }}
                </Option>
              </Select>
              <Select
                v-model="item.effectval"
                placeholder="请选择受影响选项"
                style="width: 260px; margin-left: 8px"
              >
                <Option
                  v-for="(itemVal, indexVal) in chooseTem.ques[item.effectno - 1 || 0].options"
                  :value="itemVal.t"
                  :key="indexVal + 'chooseTem.ques[item.effectno].options'"
                >
                  {{ itemVal.t || '无' }}
                </Option>
              </Select>
            </div>
          </div>
          <!-- 选项 -->
          <div v-if="item.type === 'radio' || item.type === 'checkbox'">
            <div
              v-for="(itemOption, indexOption) in item.options"
              :key="indexOption + 'itemOption'"
              style="margin-top: 16px"
            >
              <div class="flex aic">
                <div class="gray" style="text-align: right; width: 80px">
                  选项{{ indexOption + 1 }}
                </div>
                <Input
                  placeholder="请输入选项内容"
                  v-model="itemOption.t"
                  style="width: 260px; margin-left: 8px"
                ></Input>
                <RadioGroup
                  style="margin-left: 8px"
                  v-if="itemOption.otype === 'checkbox' || itemOption.otype === 'radio'"
                  v-model="itemOption.otype"
                >
                  <Radio label="radio">单选</Radio>
                  <Radio label="checkbox">多选</Radio>
                </RadioGroup>
                <Checkbox
                  style="margin-left: 8px"
                  :disabled="itemOption.o && itemOption.o.length > 0"
                  v-model="itemOption.isOther"
                  @on-change="$forceUpdate()"
                >
                  其他
                </Checkbox>
                <i
                  class="iconfont icon-shanchu red"
                  @click="deleteSelect(index, indexOption)"
                  v-if="item.options.length !== 1"
                  style="font-size: 20px; cursor: pointer; margin-left: 8px"
                ></i>
                <!-- <i
                  class="iconfont icon-tianjia blue"
                  @click="addSelect(index)"
                  v-if="indexOption === item.options.length - 1"
                  style="font-size: 20px; cursor: pointer; margin-left: 8px"
                ></i>
                <span
                  class="blue"
                  @click="addSelect(index)"
                  v-if="indexOption === item.options.length - 1"
                  style="margin-left: 8px; cursor: pointer"
                >
                  添加选项
                </span> -->
                <!-- <i
                  class="iconfont icon-tianjia blue"
                  @click="addSonSelect(index, indexOption)"
                  style="font-size: 20px; cursor: pointer; margin-left: 8px"
                ></i> -->
                <span
                  :class="itemOption.isOther ? 'disabled' : 'blue'"
                  @click="!itemOption.isOther && addSonSelect(index, indexOption)"
                  :style="{ cursor: itemOption.isOther ? 'not-allowed' : 'pointer' }"
                  style="margin-left: 8px"
                >
                  添加子选项
                </span>
                <span
                  class="blue"
                  v-if="itemOption.o && itemOption.o.length > 0 && indexOption !== 0"
                  @click="copySonSelect(index, indexOption)"
                  style="margin-left: 8px; cursor: pointer"
                >
                  复制前一子选项
                </span>
              </div>
              <div
                v-for="(itemOptionO, indexOptionO) in itemOption.o"
                :key="indexOptionO + 'itemOptionO'"
                style="padding-left: 60px; margin-top: 16px"
              >
                <div class="flex aic" style="margin-top: 16px">
                  <div class="gray" style="text-align: right; width: 80px">
                    子选项{{ indexOptionO + 1 }}
                  </div>
                  <Input
                    placeholder="请输入子选项内容"
                    v-model="itemOptionO.t"
                    style="width: 260px; margin-left: 8px"
                  ></Input>
                  <i
                    class="iconfont icon-shanchu red"
                    @click="deleteSonSelect(index, indexOption, indexOptionO)"
                    style="font-size: 20px; cursor: pointer; margin-left: 8px"
                  ></i>
                  <!-- <i
                    class="iconfont icon-tianjia blue"
                    @click="addSonSelect(index, indexOption)"
                    v-if="indexOptionO === itemOption.o.length - 1"
                    style="font-size: 20px; cursor: pointer; margin-left: 8px"
                  ></i>
                  <span
                    class="blue"
                    @click="addSonSelect(index, indexOption)"
                    v-if="indexOptionO === itemOption.o.length - 1"
                    style="margin-left: 8px; cursor: pointer"
                  >
                    添加选项
                  </span> -->
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.type === 'slider'">
            <div class="flex aic" style="margin-top: 16px">
              <div class="gray" style="text-align: right; width: 80px">最小值</div>
              <InputNumber
                placeholder="请输入最小值"
                v-model="item.minval"
                style="width: 260px; margin-left: 8px"
                :min="0"
              ></InputNumber>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="gray" style="text-align: right; width: 80px">最大值</div>
              <InputNumber
                placeholder="请输入最大值"
                v-model="item.maxval"
                style="width: 260px; margin-left: 8px"
                :min="0"
              ></InputNumber>
            </div>
          </div>
        </div>
      </div>
      <div class="flex aic" style="margin-top: 16px">
        <div style="width: 80px; text-align: right; font-size: 14px; font-weight: 400">
          添加题目
        </div>
        <div style="margin-left: 8px">
          <Button type="primary" ghost @click="addQuestion('input')">
            <i class="iconfont icon-tianjia-circle" style="font-size: 14px"></i>
            问答题
          </Button>
          <Button type="primary" style="margin-left: 16px" ghost @click="addQuestion('select')">
            <i class="iconfont icon-tianjia-circle" style="font-size: 14px"></i>
            选择题
          </Button>
          <Button type="primary" style="margin-left: 16px" ghost @click="addQuestion('slider')">
            <i class="iconfont icon-tianjia-circle" style="font-size: 14px"></i>
            滑块题
          </Button>
        </div>
      </div>
      <div class="flex" style="padding-top: 24px; justify-content: end">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { sfmb } from '@/api/specialistFollowUp/index'
import { deepClone } from '@/libs/util'
export default {
  props: {
    showEdit: Boolean,
    tempid: {
      type: Number | String,
      default: ''
    }
  },
  name: 'addFollowUpTem',
  data () {
    return {
      loadingEdit: false,
      loadingSaveEdit: false,
      show: false,
      chooseTem: {}
    }
  },
  methods: {
    deleteQuestion (index) {
      this.chooseTem.ques.splice(index, 1)
      this.$forceUpdate()
    },
    copyQuestion (index) {
      this.chooseTem.ques[index] = deepClone(this.chooseTem.ques[index - 1])
      this.$forceUpdate()
    },
    addSelect (index) {
      this.chooseTem.ques[index].options.push({
        t: '',
        v: ''
      })
      this.$forceUpdate()
    },
    addSonSelect (index, indexOption) {
      let obj = this.chooseTem.ques[index].options[indexOption]
      obj.o = obj.o || []
      obj.otype = obj.otype || 'radio'
      obj.isOther = obj.isOther || false
      obj.o.push({
        t: '',
        v: ''
      })
      this.$forceUpdate()
    },
    copySonSelect (index, indexOption) {
      this.chooseTem.ques[index].options[indexOption].o = deepClone(
        this.chooseTem.ques[index].options[indexOption - 1].o
      )
      this.$forceUpdate()
    },
    deleteSelect (index, indexOption) {
      this.chooseTem.ques[index].options.splice(indexOption, 1)
      this.$forceUpdate()
    },
    deleteSonSelect (index, indexOption, indexOptionO) {
      let obj = this.chooseTem.ques[index].options[indexOption]
      obj.o.splice(indexOptionO, 1)
      if (obj.o.length === 0) {
        obj.otype = ''
      }

      this.$forceUpdate()
    },
    openEdit (type) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseTem = {
          name: '',
          type: '',
          tempid: '',
          ques: [
            {
              title: '',
              type: 'text'
            },
            {
              title: '',
              type: 'radio',
              options: [
                {
                  t: '',
                  v: ''
                }
              ]
            }
          ]
        }
      } else {
        sfmb
          .edit({
            tempid: this.tempid
          })
          .then(res => {
            let data = res.data
            this.chooseTem = data.info
            data.ques.forEach(item => {
              item.iseffectBol = item.iseffect === 'Y'
              item.ismustBol = item.ismust === 'Y'
              if (item.effectno === 0) {
                item.effectno = 1
              }
            })
            this.chooseTem.ques = data.ques
          })
      }
    },
    addQuestion (type) {
      if (type === 'select') {
        this.chooseTem.ques.push({
          title: '',
          type: 'radio',
          name: '',
          options: [
            {
              t: '',
              v: ''
            }
          ]
        })
      } else if (type === 'slider') {
        this.chooseTem.ques.push({
          title: '',
          type: 'slider',
          minval: 0,
          maxval: 100
        })
      } else {
        this.chooseTem.ques.push({
          title: '',
          type: 'text'
        })
      }
      this.$forceUpdate()
    },
    changeIndex (type, index) {
      let arr = this.chooseTem.ques
      let item = arr[index]
      let itemPrev = {}
      let itemNext = {}

      if (type === 'up') {
        itemPrev = arr[index - 1]
      } else {
        itemNext = arr[index + 1]
      }

      if (item.iseffectBol) {
        this.$Message.error('请取消受其他题影响在进行移动操作')
        return
      }
      if (itemPrev.iseffectBol) {
        this.$Message.error('请取消上一题的受其他题影响在进行移动操作')
        return
      }
      if (itemNext.iseffectBol) {
        this.$Message.error('请取消下一题的受其他题影响在进行移动操作')
        return
      }

      if (type === 'up') {
        ;[arr[index], arr[index - 1]] = [arr[index - 1], arr[index]]
      } else {
        ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      }
      this.$forceUpdate()
    },
    saveEdit () {
      if (!this.chooseTem.name) {
        this.$Message.error('请填写模板名称')
        return
      }
      if (!this.chooseTem.type) {
        this.$Message.error('请填写模板类型')
        return
      }

      // 没写题目名称
      let findTitleIndex = this.chooseTem.ques.findIndex(item => !item.title)
      if (findTitleIndex !== -1) {
        this.$Message.error('请填写第' + (findTitleIndex + 1) + '题题目名称')
        return
      }

      // 选择题没写选项
      let findOptionIndex = this.chooseTem.ques.findIndex(item => {
        if (item.type !== 'radio' || item.type !== 'checkbox') return
        let i = item.options.findIndex(itemOption => !itemOption.t)
        if (i !== -1) return true
      })
      if (findOptionIndex !== -1) {
        this.$Message.error('请填写完第' + (findOptionIndex + 1) + '题的选项')
        return
      }

      // 有子选项没写子选项
      this.chooseTem.ques.forEach((item, index) => {
        // 如果不是选择题就跳过，因为有些可能是没有 options 的
        if (item.type !== 'radio' && item.type !== 'checkbox') return

        // 子项循环
        item.options.forEach((itemSon, indexSon) => {
          if (!itemSon.o || itemSon.o.length === 0) {
            // 如果选择了其他，就默认填空
            itemSon.o = []
            itemSon.otype = ''
            if (itemSon.isOther) {
              itemSon.otype = 'text'
            }
          } else if (itemSon.o && itemSon.o.length > 0) {
            // 否则去瞅瞅看他有没有填写
            let indexGrand = itemSon.o.findIndex(itemGrand => itemGrand.t === '')
            if (indexGrand !== -1) {
              // 没填写就弹出提示，跳出循环
              this.$Message.error(
                `请填写题目名称${index + 1}，选项${indexSon + 1}下的子选项${indexGrand + 1}`
              )
              throw new Error('未填写子选项')
            } else {
              // 如果填写了就给他改值
              itemSon.o = itemSon.o.map(itemGrand => ({ t: itemGrand.t, v: itemGrand.t }))
            }
          }
        })
      })

      // 滑块题没写最大值
      let findNotWriteNumIndex = this.chooseTem.ques.findIndex(item => {
        if (item.type !== 'slider') return
        if (item.minval === null) {
          item.minval = 0
        }
        if (item.maxval === null) return true
      })
      if (findNotWriteNumIndex !== -1) {
        this.$Message.error('请填写第' + (findNotWriteNumIndex + 1) + '题最大值')
        return
      }

      // 受其他题目影响
      let findNotWriteOtherIndex = this.chooseTem.ques.findIndex(item => {
        if (item.iseffectBol === true && !item.effectno) {
          return item
        }
      })
      if (findNotWriteOtherIndex !== -1) {
        this.$Message.error('请完成第' + (findNotWriteOtherIndex + 1) + '题的影响题目选择')
        return
      }

      this.loadingEdit = true
      let param = deepClone(this.chooseTem)

      param.ques.forEach((item, index) => {
        item.numbering = index + 1
        item.iseffect = item.iseffectBol ? 'Y' : 'N'
        item.ismust = item.ismustBol ? 'Y' : 'N'
        if (!item.iseffectBol) {
          delete item.effectno
          delete item.effectval
        }
        if (item.type === 'radio' || item.type === 'checkbox') {
          item.options.forEach(itemOption => {
            // if (!itemOption.v) {
            itemOption.v = itemOption.t
            // }
          })
        }
      })

      this.loadingSaveEdit = true

      param.ques = JSON.stringify(param.ques)
      sfmb.save(param).then(res => {
        this.$Message.success('保存成功')
        this.loadingEdit = false
        this.loadingSaveEdit = false
        this.$emit('save')
      }).catch(() => {
        this.loadingSaveEdit = false
      })
    }
  },
  watch: {
    showEdit (val) {
      this.show = val
      this.openEdit(this.tempid ? 'edit' : 'add')
    },
    options: {
      handler (val) {
        this.chooseTem = this.options
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './addFollowUpTem.less';
</style>
