<template>
  <div ref="dom"></div>
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
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
    changeOption () {
      return {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#282D3C' // 设置文字颜色
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          data: ['科室收入', '患者人次']
        },
        xAxis: [
          {
            type: 'category',
            data: this.value.xAxis,
            axisLabel: {
              color: '#282D3C'
            },
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位: 万元',
            // 隐藏Y轴
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#282D3C'
            },
            // 隐藏Y轴的刻度线
            axisTick: {
              show: false
            },
            min: 0,
            max: this.calMax(this.value.yAxis1, 'money'),
            splitNumber: 5,
            interval: Number((this.calMax(this.value.yAxis1, 'money') / 5).toFixed(3))
          },
          {
            type: 'value',
            name: '单位: 人次',
            axisLabel: {
              color: '#282D3C'
            },
            // 隐藏Y轴
            axisLine: {
              show: false
            },
            // 隐藏Y轴的刻度线
            axisTick: {
              show: false
            },
            min: 0,
            max: this.calMax(this.value.yAxis2, 'people'),
            splitNumber: 5,
            interval: Number((this.calMax(this.value.yAxis2, 'people') / 5).toFixed(1))
          }
        ],
        series: [
          {
            name: '科室收入',
            type: 'bar',
            data: this.value.yAxis1,
            itemStyle: {
              normal: {
                color: '#3171FF',
                // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                barBorderRadius: [3, 3, 0, 0]
              }
            },
            barWidth: '28px'
          },
          {
            name: '患者人次',
            type: 'line',
            data: this.value.yAxis2,
            itemStyle: {
              normal: {
                color: '#5fc8c6',
                borderColor: '#ffffff'
              }
            },
            yAxisIndex: 1,
            symbol: 'circle', // 设定为实心点
            symbolSize: 6, // 设定实心点的大小
            color: '#5fc8c6'
            // smooth: true // 平滑的曲线
          }
        ]
      }
    },
    calMax (arr, type) {
      var max = 0
      arr.forEach(el => {
        if (!(el === undefined || el === '')) {
          if (max < Number(el)) {
            max = Number(el)
          }
        }
      })
      let maxint = max / 9.5
      let maxval = maxint * 10
      if (type === 'money') {
        return Number(maxval.toFixed(2)) || 5
      } else {
        return Number(maxval.toFixed(0)) || 5
      }
    }
  },
  mounted () {
    const option = this.changeOption()
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        const option = this.changeOption()
        this.dom.setOption(option)
      }
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
