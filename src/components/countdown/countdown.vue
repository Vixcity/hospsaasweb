<template>
  <div>
    {{ timeRemaining(datetime) }}
  </div>
</template>

<script>
export default {
  props: {
    datetime: String
  },
  data () {
    return {
      ticker: null
    }
  },
  computed: {
    timeRemaining () {
      return endTime => {
        let day = (new Date(endTime).getTime() - new Date().getTime()) / 1000 // 用已知结束时间的时间戳 减去 当前时间的时间戳
        // let d = parseInt(day / (24 * 60 * 60)) // 获取剩余天数
        // let h = this.formate(parseInt((day / (60 * 60)) % 24)) // 获取剩余小时
        let m = this.formate(parseInt((day / 60) % 60)) // 获取剩余分钟
        let s = this.formate(parseInt(day % 60)) // 获取剩余秒
        let str = '' // 展示的值
        if (day > 0) {
          // 剩余时间戳大于0 代表结束时间没有到当前时间
          str = `${m}:${s}`
        } else {
          // 反之, 结束时间已过当前时间, 就清空计时器, 释放浏览器性能, 同时显示时间为 00:00
          str = '00:00'
          clearInterval(this.ticker)
        }
        return str
      }
    }
  },
  mounted: async function () {
    if (this.ticker) {
      // 防止进入页面出去后再进来计时器重复启动
      clearInterval(this.ticker)
    }
    this.beginTimer() // 启动计时器减指定字段的时间
  },
  methods: {
    formate (time) {
      if (time >= 10) {
        return time
      } else {
        return `0${time}`
      }
    },
    beginTimer () {
      this.ticker = setInterval(() => {
        this.$forceUpdate() // 强制刷新页面
      }, 1000)
    }
  }
}
</script>

<style></style>
