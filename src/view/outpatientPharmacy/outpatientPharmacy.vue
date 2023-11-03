<template>
  <div class="outpatientPharmacy">
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
      <WillOpenMedic v-if="tab_index === 'WillOpenMedic'"></WillOpenMedic>
      <IsOpenMedic v-if="tab_index === 'IsOpenMedic'"></IsOpenMedic>
    </div>
  </div>
</template>

<script>
import WillOpenMedic from './willOpenMedic/willOpenMedic.vue'
import IsOpenMedic from './isOpenMedic/isOpenMedic.vue'
export default {
  components: { WillOpenMedic, IsOpenMedic },
  name: 'outpatientPharmacy',
  data () {
    return {
      tab_index: 'WillOpenMedic',
      tabList: [
        {
          label: '待开药',
          value: 'WillOpenMedic'
        },
        {
          label: '已开药',
          value: 'IsOpenMedic'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import './outpatientPharmacy.less';
</style>
