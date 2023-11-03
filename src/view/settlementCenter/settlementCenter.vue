<template>
  <div class="settlementCenter">
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
      <toBeSettled v-if="tab_index === 'toBeSettled'"></toBeSettled>
      <settled v-if="tab_index === 'settled'"></settled>
    </div>
  </div>
</template>

<script>
import toBeSettled from './toBeSettled/toBeSettled.vue'
import settled from './settled/settled.vue'
export default {
  name: 'settlementCenter',
  components: {
    toBeSettled,
    settled
  },
  data () {
    return {
      tab_index: 'toBeSettled',
      tabList: [
        {
          label: '待结算',
          value: 'toBeSettled'
        },
        {
          label: '已结算',
          value: 'settled'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import './settlementCenter.less';
</style>
