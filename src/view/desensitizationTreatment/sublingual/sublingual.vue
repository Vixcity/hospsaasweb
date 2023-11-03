<template>
  <div class="sublingual">
    <div style="background: #f5f5fa;height: 100%" v-if="!showYYXQ">
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
      <div class="tab_container" style="background: white;">
        <TMLB v-if="tab_index === 'TMLB'" @changeTab="changeTab"></TMLB>
        <TL v-if="tab_index === 'tl'" @changeTab="changeTab"></TL>
      </div>
    </div>
    <YYXQ v-else @notShow="notShow"></YYXQ>
  </div>
</template>

<script>
import TMLB from './TMLB.vue'
import TL from './tl.vue'
export default {
  name: 'sublingual',
  components: {
    TMLB,
    TL
  },
  data () {
    return {
      showYYXQ: false,
      tabList: [
        { label: '脱敏列表', value: 'TMLB' },
        { label: '已脱落', value: 'tl' }
      ],
      tab_index: 'TMLB'
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
@import './sublingual.less';
</style>

<style scoped>
.sublingual >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
