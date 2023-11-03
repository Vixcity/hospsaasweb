<template>
  <div ref="dom" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    option: Object
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  watch: {
    option: {
      handler (val) {
        this.dom.setOption(val)
      },
      deep: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
