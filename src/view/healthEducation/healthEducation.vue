<template>
  <div class="healthEducation">
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
    <div class="tab_container" style="background: white">
      <XJLB v-if="tab_index === 'XJLB'"></XJLB>
      <FLLB v-if="tab_index === 'FLLB'"></FLLB>
    </div>
  </div>
</template>

<script>
import FLLB from './FLLB/FLLB.vue'
import XJLB from './XJLB/XJLB.vue'
export default {
  name: 'healthEducation',
  components: {
    FLLB,
    XJLB
  },
  data () {
    return {
      tab_index: 'XJLB',
      tabList: []
    }
  },
  methods: {},
  mounted () {
    let obj = JSON.parse(localStorage.hasMenuList).find(item => item.tag === 'xuan')
    obj.sub.reverse().forEach(item => {
      if (item.tag === 'xuandata') {
        this.tabList.push({
          label: item.title,
          value: 'XJLB'
        })
      } else if (item.tag === 'xuancate') {
        this.tabList.push({
          label: item.title,
          value: 'FLLB'
        })
      }
    })
    this.tab_index = this.tabList[0].value
  }
}
</script>

<style lang="less" scoped>
@import './healthEducation.less';
</style>

<style scoped>
.healthEducation >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
