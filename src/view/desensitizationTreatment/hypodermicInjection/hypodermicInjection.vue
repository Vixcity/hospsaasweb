<template>
  <div class="pxzs">
    <div style="background: #f5f5fa; height: 100%" v-if="!showYYXQ">
      <div class="tab_header">
        <div
          :class="
            tab_index === item.value ? 'tab_header_active tab_header_item' : 'tab_header_item'
          "
          v-for="(item, index) in tabList"
          :key="index"
          @click="tab_index = item.value"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="tab_container" style="background: white">
        <WillDo v-if="tab_index === 'willDo'" @getYYXQ="goYYXQ" @changeTab="changeTab"></WillDo>
        <During v-if="tab_index === 'duringDo'" @changeTab="changeTab"></During>
        <Finish v-if="tab_index === 'finishDo'" @changeTab="changeTab"></Finish>
        <TL v-if="tab_index === 'tl'" @changeTab="changeTab"></TL>
      </div>
    </div>
    <YYXQ v-else @notShow="notShow"></YYXQ>
  </div>
</template>

<script>
import During from './duringDo.vue'
import WillDo from './willDo.vue'
import Finish from './finishDo.vue'
import YYXQ from './YYXQ.vue'
import TL from './tl.vue'
export default {
  name: 'pxzs',
  components: {
    During,
    WillDo,
    Finish,
    YYXQ,
    TL
  },
  data () {
    return {
      showYYXQ: false,
      tabList: [
        { label: '待执行', value: 'willDo' },
        { label: '留观中', value: 'duringDo' },
        { label: '已完成', value: 'finishDo' },
        { label: '已脱落', value: 'tl' }
      ],
      tab_index: 'willDo'
    }
  },
  methods: {
    goYYXQ () {
      this.showYYXQ = true
    },
    changeTab (e) {
      this.tab_index = e
    },
    notShow () {
      this.showYYXQ = false
    }
  }
}
</script>

<style lang="less" scoped>
@import './hypodermicInjection.less';
</style>

<style scoped>
.pxzs >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
