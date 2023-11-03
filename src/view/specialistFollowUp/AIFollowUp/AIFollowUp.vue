<template>
  <div class="AIFollowUp">
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
      <SFJH v-if="tab_index === 'SFJH'"></SFJH>
      <SFJL v-if="tab_index === 'SFJL'"></SFJL>
    </div>
  </div>
</template>

<script>
import SFJL from './SFJL/SFJL.vue'
import SFJH from './SFJH/SFJH.vue'
export default {
  name: 'AIFollowUp',
  components: {
    SFJH,
    SFJL
  },
  data () {
    return {
      tab_index: 'SFJH',
      tabList: [
        {
          value: 'SFJH',
          label: '随访计划'
        },
        {
          value: 'SFJL',
          label: '随访记录'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import './AIFollowUp.less';
</style>

<style scoped>
.AIFollowUp >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
