<template>
  <div class="com-md-editor">
    <div ref="mdContainer" class="md-container vditor-reset" :class="editorOption.preview.theme"></div>
    <transition name="fade">
      <div v-if="isFullScreen" ref="fullscreenMdContainer" class="md-container vditor-reset fullscreen" :class="editorOption.preview.theme"></div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import Vditor from 'vditor'
import 'vditor/src/assets/scss/index.scss'
import mdEmoji from '../common/mdEmoji'
import * as utils from '../utils/index'

export default {
  name: 'MdEditor',
  props: {
    option: { type: Object, default: null }
  },
  data: () => ({
    // 是否为全屏状态
    isFullScreen: false,
    vditorInstance: null,
    fullscreenVditorInstance: null,

    tempEditorHeight: 450,

    editorOption: null,

    defaultOption: {
      mode: 'ir',
      height: 450,
      toolbarConfig: {
        pin: true
      },
      // 工具栏
      toolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', '|',
        'code', 'inline-code', '|',
        'list', 'ordered-list', 'check', '|',
        'outdent', 'indent', 'undo', 'redo', '|',
        'link', 'quote', 'line', '|',
        'upload', 'table', '|',
        'edit-mode', 'both', 'fullscreen'],
      mini: {
        enable: false,
        miniToolbar: ['emoji', 'headings', 'bold', 'list', 'ordered-list', 'link', 'upload', 'fullscreen'],
        fullToolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', '|',
          'code', 'inline-code', '|',
          'list', 'ordered-list', 'check', '|',
          'outdent', 'indent', 'undo', 'redo', '|',
          'link', 'quote', 'line', '|',
          'upload', 'table', '|',
          'edit-mode', 'both', 'fullscreen']
      },
      hint: {
        emoji: mdEmoji.emoji
      },
      counter: {
        enable: true,
        max: 10000,
        type: 'text'
      },
      preview: {
        mode: 'both',
        actions: [],
        hljs: 'igor',
        theme: 'ant-design',
        markdown: {
          autoSpace: true,
          sanitize: true
        }
      },
      upload: {
        url: '',
        // 文件最大为 100M
        max: 100 * 1024 * 1024,
        // 不允许上传多个文件，公司文件服务器貌似不支持
        multiple: false,
        // 默认允许所有文件
        accept: ''
      },
      cache: {
        enable: false
      }
    }
  }),
  created() {
    this.setOption()
  },
  mounted() {
    this.render()
  },
  methods: {
    setOption() {
      // 合并自定义 option
      if (this.option) {
        this.editorOption = utils.mergeObject(this.defaultOption, this.option)
      }
      // 如果为 mini 模式，为其设置合适的 toolbar
      if (this.editorOption.mini.enable) {
        this.editorOption.toolbar = this.editorOption.mini.miniToolbar
      }
      // 设置 upload
      this.editorOption.upload.handler = this.handleUpload
      // 自定义全屏功能
      if (this.editorOption.mini.enable && this.editorOption.toolbar.includes('fullscreen')) {
        this.editorOption.toolbar.splice(this.editorOption.toolbar.indexOf('fullscreen'), 1, {
          hotkey: '⌘\'',
          name: 'customFullscreen',
          tipPosition: 'n',
          tip: '全屏编辑',
          className: 'custom-fullscreen',
          icon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1623050865353" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25194" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32"><defs><style type="text/css"></style></defs><path d="M475.34 850.534H209.1a37.274 37.274 0 0 1-37.273-37.273V547.02a37.274 37.274 0 1 1 74.547 0v228.966h228.967a37.274 37.274 0 0 1 0 74.547z m354.97-354.97a37.274 37.274 0 0 1-37.273-37.273V229.325H564.07a37.274 37.274 0 1 1 0-74.547h266.24a37.274 37.274 0 0 1 37.274 37.273v266.24a37.274 37.274 0 0 1-37.274 37.274z" p-id="25195"></path></svg>',
          click: () => { this.handleFullscreen(true) }
        })
      }
    },
    // 渲染
    render() {
      this.vditorInstance = new Vditor(this.$refs.mdContainer, this.editorOption)
    },
    // 处理全屏
    handleFullscreen(isFullscreen) {
      this.isFullScreen = isFullscreen
      if (isFullscreen) {
        if (this.editorOption.mini.fullToolbar.includes('fullscreen')) {
          this.editorOption.mini.fullToolbar.splice(this.editorOption.mini.fullToolbar.indexOf(), 1)
        }
        if (!this.editorOption.mini.fullToolbar.find(item => item.name === 'customFullscreen')) {
          this.editorOption.mini.fullToolbar.push({
            hotkey: '⌘\'',
            name: 'customFullscreen',
            tipPosition: 's',
            tip: '退出全屏编辑',
            className: 'custom-fullscreen',
            icon: '<svg t="1623058816375" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13455" data-spm-anchor-id="a313x.7781069.0.i5" width="32" height="32"><path d="M896 469.333333V384h-256V128h-85.333333v341.333333h341.333333zM128 554.666667v85.333333h256v256h85.333333v-341.333333H128z" p-id="13456" data-spm-anchor-id="a313x.7781069.0.i4" class=""></path></svg>',
            click: () => { this.handleFullscreen(false) }
          })
        }
        this.editorOption.toolbar = this.editorOption.mini.fullToolbar
        this.$nextTick(() => {
          this.fullscreenVditorInstance = new Vditor(this.$refs.fullscreenMdContainer, this.editorOption)
          this.fullscreenVditorInstance.focus()
          // 其实延时时间为 0 就可以，只是为了让其他同步任务执行结束（让全屏的 vditor 实例创建完成）
          setTimeout(() => {
            this.fullscreenVditorInstance.setValue(this.vditorInstance.getValue())
          }, 100)
        })
      } else {
        this.vditorInstance.focus()
        this.vditorInstance.setValue(this.fullscreenVditorInstance.getValue())
      }
    },
    // 上传功能处理方法
    handleUpload(files) {
      const fileUploadUrl = this.editorOption.upload.url
      if (!fileUploadUrl) {
        this.vditorInstance.tip('请先配置文件上传地址!', 5000)
        return
      }
      const imgs = ['apng', 'avif', 'bmp', 'gif', 'ico', 'cur',
        'jpeg', 'jpg', 'jfif', 'pjpeg', 'pjp',
        'png', 'tif', 'tiff', 'webp']
      const videosAndAudios = ['mp4', 'webm', 'ogg', 'mp3', 'wav']
      const matchFileEmoji = (type) => {
        if (videosAndAudios.includes(type)) return ''
        return `:${mdEmoji.type2emoji[type] || 'un_know'}:`
      }
      const param = new FormData()
      param.append('file', files[0])
      this.vditorInstance.tip('文件上传中...', 0)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      axios.post(fileUploadUrl, param, config).then(response => {
        let res = null
        if (this.editorOption.upload.format) {
          res = this.editorOption.upload.format(response.data)
        } else {
          res = response.data
        }
        let fileLink = ''
        if (imgs.includes(res.type)) {
          fileLink = `![${res.fileName}](${res.url}${res.url.indexOf('?') > 0 ? `&type=${res.type}` : `?type=${res.type}`})`
        } else {
          fileLink = `${matchFileEmoji(res.type)} [${res.fileName}](${res.url}${res.url.indexOf('?') > 0 ? `&upload=1&type=${res.type}` : `?upload=1&type=${res.type}`})`
        }
        this.vditorInstance.insertValue(fileLink)
        this.vditorInstance.tip('文件上传成功，可以对展示信息进行修改哦~', 3000)
      }).catch(err => {
        console.warn('文件上传失败', err)
        this.vditorInstance.tip('文件上传失败', 4000)
        this.$emit('upload-error', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="scss">
.com-md-editor {
  .md-container {
    overflow: unset;

    &.fullscreen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      height: auto !important;
    }

    .vditor-toolbar {
      .vditor-toolbar__item {
        margin-right: 6px;

        svg {
          width: 15px;
          height: 15px;
          stroke-width: none;
        }
      }
      .vditor-toolbar__divider {
        margin: var(--toolbar-divider-margin-top) 12px var(--toolbar-divider-margin-top) 6px;
      }
    }

    ol li {
      list-style: decimal;
    }
    ul li {
      list-style: disc;
      li {
        list-style: circle;
        li {
          list-style: square;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '../theme/ant-design.scss';
@import '../theme/vue.scss';
@import '../theme/git-book.scss';
</style>
