<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: val => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    }
    /**
     * @description 是否开启本地存储
     */
    // cache: {
    //   type: Boolean,
    //   default: true
    // }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    customCheckImageFn (e) {
      console.log(e)
    },
    customParseImageSrc (e) {
      console.log(e)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.$nextTick(() => {
      console.log(this.editor.uploadImg)
    })
    this.editor.customConfig.onchange = html => {
      let text = this.editor.txt.text()
      // if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    // let html = this.value || localStorage.editorCache
    let html = this.value
    if (html) this.editor.txt.html(html)
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    this.editor = null // destory 方法没有，那么就给他清空
  }
}
</script>

<style lang="less">
.editor-wrapper * {
  z-index: 100 !important;
}
</style>
