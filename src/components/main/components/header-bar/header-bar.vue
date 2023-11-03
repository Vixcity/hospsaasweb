<template>
  <div class="header-bar">
    <div class="companyName">
      <img :src="logo" v-if="logo" alt="" />
      <img v-else src="@/assets/images/logo.png" alt="" />
      <span style="font-size: 20px; margin-left: 8px">{{ name }}</span>
    </div>
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  data () {
    return {
      name: JSON.parse(localStorage.userInfo).hospname || '数智医济',
      logo: JSON.parse(localStorage.userInfo).hosplogo
    }
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
