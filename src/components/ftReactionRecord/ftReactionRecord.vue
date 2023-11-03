<template>
  <el-dialog
    :title="(type === 'cf' ? '迟发' : '即刻') + '反应记录'"
    :visible.sync="showRec"
    width="678px"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="vertical-center-modal"
  >
    <CheckboxGroup v-model="chooseCFRec.arr">
      <div v-for="(item, index) in recList" :key="index + 'resList'" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">{{ item.title }}</div>
        <Checkbox
          v-for="(itemSon, indexSon) in item.list"
          :key="indexSon + 'item.list'"
          :label="itemSon"
          style="margin-right: 40px"
        ></Checkbox>
      </div>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input v-model="chooseCFRec.text" type="textarea"></Input>
    </CheckboxGroup>
    <div slot="footer">
      <Button type="primary" @click="closeRec">确 定</Button>
    </div>
  </el-dialog>
</template>

<script>
import { repetition } from '../../libs/util'
export default {
  props: {
    type: String,
    info: String,
    show: Boolean,
    index: Number | undefined
  },
  name: 'ftReactionRecord',
  data () {
    return {
      showRec: false,
      chooseCFRec: {
        arr: [],
        text: ''
      },
      recList: [
        {
          title: '即刻局部反应',
          list: ['注射部位肿胀', '热', '疼痛', '瘙痒', '活动受限', '红斑']
        },
        {
          title: '全身非特异性反应',
          list: ['发热', '疲倦', '关节痛', '头痛', '头晕', '嗜睡', '上腹痛']
        },
        {
          title: '哮喘症状',
          list: ['喘息', '咳嗽', '胸闷', '气闭', '咽痒不适']
        },
        {
          title: '鼻炎症状',
          list: ['鼻痒', '喷嚏', '流涕', '鼻塞', '鼻干']
        },
        {
          title: '过敏性结膜炎症状',
          list: ['眼痒', '流泪', '结膜充血', '畏光', '眼肿']
        },
        {
          title: '过敏性皮炎',
          list: ['荨麻疹', '湿疹', '皮肤瘙痒', '血管性水肿']
        }
      ]
    }
  },
  methods: {
    closeRec () {
      let str = ''
      str = this.chooseCFRec.arr.toString()
      str =
        str && this.chooseCFRec.text
          ? str + ',' + this.chooseCFRec.text
          : str + (this.chooseCFRec.text || '')
      this.$emit('save', str, this.index)
    },
    getArr () {
      let arr = []
      this.recList.forEach(item => {
        arr = arr.concat(...item.list)
      })

      return arr
    },
    changeInfo () {
      let arr = this.getArr()

      let oldArr = JSON.parse(JSON.stringify(this.chooseCFRec.arr))
      this.chooseCFRec.arr = repetition(this.chooseCFRec.arr, arr)
      this.chooseCFRec.text = oldArr.filter(v => arr.every(val => val !== v))[0] || ''
      this.$forceUpdate()
    }
  },
  watch: {
    show (val) {
      this.showRec = val
    },
    info (val) {
      this.chooseCFRec.arr = val ? val.split(',') : []
      this.chooseCFRec.text = ''
      this.changeInfo()
    }
  }
}
</script>

<style lang="less" scoped></style>
