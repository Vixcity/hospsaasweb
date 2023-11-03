<template>
    <div ref="dom"></div>
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'plan',
  props: {
    value: Object
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
  mounted () {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '40px',
        right: '0',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.value.xAxis,
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '滴数',
        // 隐藏Y轴
        axisLine: {
          show: false
        },
        // 隐藏Y轴的刻度线
        axisTick: {
          show: false
        }
      },
      series: [
        {
          data: this.value.yAxis,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#3171FF'
            }
          }
        }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
