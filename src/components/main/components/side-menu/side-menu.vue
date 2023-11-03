<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <!-- 全部显示 -->
    <Menu
      ref="menu"
      v-show="!collapsed"
      :active-name="activeNameMy"
      :open-names="openedNames"
      :accordion="accordion"
      :theme="theme"
      width="auto"
      @on-select="handleSelect"
    >
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <!-- 一级菜单 -->
          <!-- <side-menu-item
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></side-menu-item> -->
          <menu-item
            style="color: white"
            v-if="item.meta.show"
            :name="getNameOrHref(item, true)"
            :key="`menu-${item.children[0].name}`"
          >
            <i :class="item.children[0].icon" class="iconfont"></i>
            <span>{{ showTitle(item.children[0]) }}</span>
          </menu-item>
        </template>
        <template v-else>
          <!-- 多级菜单 -->
          <side-menu-item
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item)" :key="`menus-${item.name}`">
            <i :class="item.icon" class="iconfont"></i>
            <span>{{ showTitle(item) }}</span>
          </menu-item>
        </template>
      </template>
    </Menu>
    <!-- 折叠显示 -->
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu
          v-if="item.children && item.children.length > 1"
          @on-click="handleSelect"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          :key="`drop-menu-${item.name}`"
        ></collapsed-menu>
        <Tooltip
          transfer
          v-else
          :content="showTitle(item.children && item.children[0] ? item.children[0] : item)"
          placement="right"
          :key="`sdrop-menu-${item.name}`"
        >
          <a
            @click="handleSelect(getNameOrHref(item, true))"
            class="drop-menu-a"
            :style="{ textAlign: 'center' }"
          >
            <i :class="item.icon || (item.children && item.children[0].icon)" class="iconfont"></i>
          </a>
        </Tooltip>
      </template>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import { getUnion } from '@/libs/tools'
import { throttle } from '@/libs/util'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  mixins: [mixin],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: [],
      activeNameMy: ''
    }
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  },
  computed: {
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
  watch: {
    activeName (name) {
      this.activeNameMy = name
    },
    activeNameMy (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames (newNames) {
      this.openedNames = newNames
    },
    openedNames: throttle(function (val) {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    }, 500)
  },
  mounted () {
    setTimeout(() => {
      this.activeNameMy = this.$route.name
    }, 300)
  }
}
</script>
<style lang="less">
@import './side-menu.less';
.ivu-menu-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.ivu-menu-submenu {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.ivu-menu-opened {
  border: 0;
}
</style>
