<template>
  <div class="patient">
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
      <patientList v-if="tab_index === 'patientList'"></patientList>
      <patientGroup v-if="tab_index === 'patientGroup'"></patientGroup>
    </div>
  </div>
</template>

<script>
import patientList from './patientList/patientList.vue'
import patientGroup from './patientGroup/patientGroup.vue'
export default {
  name: 'patient',
  components: {
    patientList,
    patientGroup
  },
  data () {
    return {
      tab_index: 'patientList',
      tabList: [
        {
          label: '患者列表',
          value: 'patientList'
        },
        {
          label: '患者分组',
          value: 'patientGroup'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import './patient.less';
</style>
