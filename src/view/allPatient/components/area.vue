<template>
  <div ref="dom"></div>
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'area',
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
    },
    setOption () {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: this.value.grid || {
          left: '40px',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.value.xAxis
        },
        yAxis: {
          type: 'value',
          name: '分数',
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
            showSymbol: false,
            itemStyle: {
              normal: {
                color: this.value.color
              }
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: this.value.bg_color1
                },
                {
                  offset: 1,
                  color: this.value.bg_color2
                }
              ])
            }
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.setOption()
  },
  watch: {
    value (value) {
      this.setOption()
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
