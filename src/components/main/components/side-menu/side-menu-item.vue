<template>
  <Submenu :name="`${parentName}`" v-if="parentItem.meta.show">
    <template slot="title">
      <div style="color: white">
        <i class="iconfont" :class="parentItem.icon"></i>
        <span>{{ showTitle(parentItem) }}</span>
      </div>
    </template>
    <!-- 多级菜单子菜单 -->
    <template v-for="item in children">
      <!-- 三级菜单 -->
      <template v-if="item.children && item.children.length === 1">
        <div style="color: white" :key="`menu-${item.name}`">
          <side-menu-item v-if="showChildren(item)" :parent-item="item"></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item, true)">
            <common-icon :type="item.children[0].icon || ''" />
            <span>{{ showTitle(item.children[0]) }}</span>
          </menu-item>
        </div>
      </template>
      <!-- 二级菜单 -->
      <template v-else>
        <!-- <side-menu-item
          v-if="showChildren(item) && item.meta.show"
          style="color: white; background: #203562"
          :key="`menu-${item.name}`"
          :parent-item="item"
        ></side-menu-item> -->
        <menu-item
          style="color: white; background: #203562"
          v-if="item.meta.show"
          :name="getNameOrHref(item)"
          :key="`menus-${item.name}`"
        >
          <span style="margin-left: 14px">{{ showTitle(item) }}</span>
        </menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [mixin, itemMixin]
}
</script>
