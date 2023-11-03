<template>
  <div>
    <Button size="large" type="primary" @click="backHome">返回首页</Button>
    <!-- <Button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</Button> -->
  </div>
</template>

<script>
import './error.less'
export default {
  name: 'backBtnGroup',
  data () {
    return {
      second: 5,
      timer: null
    }
  },
  methods: {
    backHome () {
      let menuList = JSON.parse(localStorage.showMenuList)
      let firstItem = localStorage.hasMenuList ? JSON.parse(localStorage.hasMenuList) : ''
      let firstIndex = menuList
        ? menuList[0].children.findIndex(item => {
          if (firstItem[0].sub.length > 0) {
            if (!item.meta.tag) {
              return menuList[0].meta.tag === firstItem[0].sub[0].tag
            } else {
              return item.meta.tag === firstItem[0].sub[0].tag
            }
          } else {
            if (!item.meta.tag) {
              return menuList[0].meta.tag === firstItem[0].tag
            } else {
              return item.meta.tag === firstItem[0].tag
            }
          }
        })
        : 0

      this.$router.replace({
        name: menuList[0].children[firstIndex].name
      })
    },
    backPrev () {
      this.$router.go(-1)
    }
  },
  mounted () {
    // this.timer = setInterval(() => {
    //   if (this.second === 0) this.backPrev()
    //   else this.second--
    // }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
