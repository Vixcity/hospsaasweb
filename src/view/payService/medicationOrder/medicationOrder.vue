<template>
  <div class="medicationOrder">
    <div class="tab_header">
      <div
        :class="tab_index === item.value ? 'tab_header_active tab_header_item' : 'tab_header_item'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tab_index = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="tab_container">
      <YYYZ v-if="tab_index === 'YYYZ'"></YYYZ>
      <FYJL v-if="tab_index === 'FYJL'"></FYJL>
      <FYPL v-if="tab_index === 'FYPL'"></FYPL>
      <FYFS v-if="tab_index === 'FYFS'"></FYFS>
      <DW v-if="tab_index === 'DW'"></DW>
    </div>
  </div>
</template>

<script>
import YYYZ from './YYYZ/YYYZ.vue'
import FYJL from './FYJL/FYJL.vue'
import FYPL from './FYPL/FYPL.vue'
import FYFS from './FYFS/FYFS.vue'
import DW from './DW/DW.vue'
export default {
  name: 'medicationOrder',
  components: {
    YYYZ,
    FYJL,
    FYPL,
    FYFS,
    DW
  },
  data () {
    return {
      tab_index: 'YYYZ',
      tabList: [
        {
          label: '用药医嘱',
          value: 'YYYZ'
        },
        {
          label: '服用剂量',
          value: 'FYJL'
        },
        {
          label: '服用频率',
          value: 'FYPL'
        },
        {
          label: '服用方式',
          value: 'FYFS'
        },
        {
          label: '单位',
          value: 'DW'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import './medicationOrder.less';
</style>
<style scoped>
.medicationOrder >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
