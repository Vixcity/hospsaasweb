<template>
  <div ref="dom"></div>
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { deepClone } from '@/libs/util'
export default {
  name: 'ranking',
  props: {
    value: Array
  },
  data () {
    return {
      dom: null,
      option: {}
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    changeOption (value) {
      return {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#282D3C' // 设置文字颜色
          },
          formatter: function (params) {
            let result = params[0].name + '<br />'
            params.forEach(function (item) {
              // item.marker是自带的小圆点标识
              result += item.marker + item.value + '%<br />'
            })
            return result
          }
        },
        grid: {
          left: '0',
          right: '0',
          top: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            color: '#282D3C'
          },
          inverse: true,
          max: 10,
          data: value.xAxis,
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
            data: value.yAxis,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#5FC8C6',
                // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                barBorderRadius: [0, 3, 3, 0]
              }
            },
            barWidth: '20px'
          }
        ]
      }
    },
    getData () {
      let value = deepClone(this.value)
      value = value.sort(this.getSort('percent'))
      // console.log(value)
      var xAxis = []
      var yAxis = []
      for (var i = 0; i < value.length; i++) {
        xAxis.push(value[i].name)
        yAxis.push(value[i].percent)
      }

      return { xAxis, yAxis }
    },
    getSort (i) {
      return function (a, b) {
        var value1 = a[i]
        var value2 = b[i]
        return value2 - value1
      }
    }
  },
  mounted () {
    let value = this.getData()
    const option = this.changeOption(value)
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
        let data = this.getData()
        const option = this.changeOption(data)
        if (this.dom) {
          this.dom.setOption(option)
        }
      }
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
