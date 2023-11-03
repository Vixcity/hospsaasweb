<template>
  <div class="arrange">
    <div class="tab_header">
      <div
        :class="tab_index === item.value ? 'tab_header_active tab_header_item' : ' tab_header_item'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tab_index = item.value"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="tab_container" style="background: white">
      <JCPZ v-if="tab_index === 'jcpz'"></JCPZ>
      <GDPB v-if="tab_index === 'gdpb'"></GDPB>
      <DTPB v-if="tab_index === 'dtpb'"></DTPB>
      <TZJH v-if="tab_index === 'tzjh'"></TZJH>
      <JJRTZ v-if="tab_index === 'jjrtz'"></JJRTZ>
      <JQTB v-if="tab_index === 'jqtb'"></JQTB>
    </div>
  </div>
</template>

<script>
import JCPZ from './components/jcpz.vue'
import GDPB from './components/gdpb.vue'
import DTPB from './components/dtpb.vue'
import TZJH from './components/tzjh.vue'
import JJRTZ from './components/jjrtz.vue'
import JQTB from './components/jqtb.vue'
export default {
  name: 'workforceManagement',
  data () {
    return {
      tabList: [
        {
          title: '基础配置',
          value: 'jcpz'
        },
        {
          title: '固定排班',
          value: 'gdpb'
        },
        {
          title: '动态排班',
          value: 'dtpb'
        },
        {
          title: '停诊计划',
          value: 'tzjh'
        },
        {
          title: '节假日停诊',
          value: 'jjrtz'
        },
        {
          title: '假期调班',
          value: 'jqtb'
        }
      ],
      tab_index: 'jcpz'
    }
  },
  components: {
    JCPZ,
    GDPB,
    DTPB,
    TZJH,
    JJRTZ,
    JQTB
  },
  methods: {},
  mounted () {}
}
</script>

<style lang="less" scoped>
.arrange {
  height: 100%;
  .arrange_head {
    display: flex;
    align-items: center;
    background: #f5f5fa;
    padding: 6px 9px 17px;
    box-sizing: border-box;
    div {
      font-size: 16px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      margin-right: 32px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
    .arrange_head_active {
      color: #3171ff !important;
      font-weight: 500;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: -5px;
        width: 100%;
        height: 2px;
        background: #3171ff;
      }
    }
  }
}
</style>
