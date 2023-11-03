<template>
  <div class="medicalRecordTemplate">
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
      <BLMB v-if="tab_index === 'BLMB'"></BLMB>
      <ZDJG v-if="tab_index === 'ZDJG'"></ZDJG>
    </div>
  </div>
</template>

<script>
import ZDJG from './ZDJG/ZDJG.vue'
import BLMB from './BLMB/BLMB.vue'
export default {
  name: 'medicalRecordTemplate',
  components: {
    BLMB,
    ZDJG
  },
  data () {
    return {
      tab_index: 'BLMB',
      tabList: [
        {
          label: '病历模板',
          value: 'BLMB'
        },
        {
          label: '诊断结果',
          value: 'ZDJG'
        }
      ]
    }
  },
  methods: {
    changeTab (e) {
      this.tab_index = e
    }
  }
}
</script>

<style lang="less" scoped>
@import './medicalRecordTemplate.less';
</style>

<style scoped>
.medicalRecordTemplate >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
