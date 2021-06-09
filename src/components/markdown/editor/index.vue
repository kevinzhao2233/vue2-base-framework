<template>
  <div class="com-md-editor">
    <div ref="mdContainer" class="editor-container vditor-reset" :class="defaultOption.preview.theme"></div>
    <transition name="fade">
      <div v-if="fullScreen" ref="fullscreenMdContainer" class="editor-container fullscreen" :class="defaultOption.preview.theme"></div>
    </transition>
  </div>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/src/assets/scss/index.scss'
import mdEmoji from '../common/mdEmoji'

export default {
  name: 'MdEditor',
  props: {
    mini: { type: Boolean, default: false },
    miniToolbar: {
      type: Array,
      default: () => ['emoji', 'headings', 'bold', 'list', 'ordered-list', 'link', 'upload', 'fullscreen']
    }
  },
  data: () => ({
    fullScreen: false,
    vditorInstance: null,
    fullscreenVditorInstance: null,
    fullToolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', '|',
      'code', 'inline-code', '|',
      'list', 'ordered-list', 'check', '|',
      'outdent', 'indent', 'undo', 'redo', '|',
      'link', 'quote', 'line', '|',
      'upload', 'table', '|',
      'edit-mode', 'both', 'fullscreen'],
    customMiniToolbar: [],
    defaultOption: {
      mode: 'ir',
      height: 450,
      toolbarConfig: {
        pin: true
      },
      // 工具栏
      toolbar: [],
      hint: {
        emoji: mdEmoji.emoji
      },
      counter: {
        enable: true,
        max: 10000
      },
      preview: {
        mode: 'both',
        actions: [],
        hljs: 'igor',
        theme: 'git-book',
        markdown: {
          autoSpace: true,
          sanitize: true
        }
      },
      upload: {
        // 文件最大为 100M
        max: 100 * 1024 * 1024,
        // 不允许上传多个文件，公司文件服务器貌似不支持
        multiple: false,
        // 默认允许所有文件
        accept: '',
        // 自定义文件图片上传
        handler: (files) => {
          this.handleUpload(files)
        }
      },
      cache: {
        enable: false
      }
    }
  }),
  created() {
    if (!this.mini) return
    this.defaultOption.toolbar = this.miniToolbar
    this.defaultOption.after = () => {
      this.vditorInstance.setValue('hello')
    }
    if (this.defaultOption.toolbar.includes('fullscreen')) {
      this.defaultOption.toolbar.splice(this.defaultOption.toolbar.indexOf('fullscreen'), 1, {
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
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.vditorInstance = new Vditor(this.$refs.mdContainer, this.defaultOption)
    },
    handleFullscreen(isFullscreen) {
      this.fullScreen = isFullscreen
      if (isFullscreen) {
        delete this.defaultOption.height
        if (this.fullToolbar.includes('fullscreen')) {
          this.fullToolbar.splice(this.fullToolbar.indexOf(), 1)
        }
        if (!this.fullToolbar.find(item => item.name === 'customFullscreen')) {
          this.fullToolbar.push({
            hotkey: '⌘\'',
            name: 'customFullscreen',
            tipPosition: 's',
            tip: '退出全屏编辑',
            className: 'custom-fullscreen',
            icon: '<svg t="1623058816375" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13455" data-spm-anchor-id="a313x.7781069.0.i5" width="32" height="32"><path d="M896 469.333333V384h-256V128h-85.333333v341.333333h341.333333zM128 554.666667v85.333333h256v256h85.333333v-341.333333H128z" p-id="13456" data-spm-anchor-id="a313x.7781069.0.i4" class=""></path></svg>',
            click: () => { this.handleFullscreen(false) }
          })
        }
        this.defaultOption.toolbar = this.fullToolbar
        this.$nextTick(() => {
          this.fullscreenVditorInstance = new Vditor(this.$refs.fullscreenMdContainer, this.defaultOption)
          this.fullscreenVditorInstance.focus()
        })
      } else {
        this.vditorInstance.focus()
      }
      // TODO 同步书写内容
    },
    handleUpload(files) {
      const imgs = ['apng', 'avif', 'bmp', 'gif', 'ico', 'cur',
        'jpeg', 'jpg', 'jfif', 'pjpeg', 'pjp',
        'png', 'tif', 'tiff', 'webp']
      const videos = ['mp4', 'webm', 'ogg']
      const audios = ['mp3', 'wav', 'ogg']
      const param = new FormData()
      param.append('file', files[0])
      this.vditorInstance.tip('文件上传中...', 0)
      // baseApi.fileUpload(param).then(res => {
      //   let fileLink = ''
      //   if (imgs.includes(res.type)) {
      //     fileLink = `![${res.fileName}](${res.url}&type=${res.type})`
      //   } else if (videos.includes(res.type)) {
      //     fileLink = `<video controls width="100%" src="${res.url}"></video>`
      //   } else if (audios.includes(res.type)) {
      //     fileLink = `<audio controls src="${res.url}"></audio>`
      //   } else {
      //     fileLink = `:${this.matchFileEmoji(res.type)}: [${res.fileName}](${res.url}&type=${res.type})`
      //   }
      //   this.vditorInstance.insertValue(fileLink)
      //   this.vditorInstance.tip('文件上传成功，可以对展示信息进行修改哦~', 3000)
      // }).catch(err => {
      //   console.warn('文件上传失败', err)
      //   this.vditorInstance.tip('文件上传失败', 4000)
      //   this.$emit('upload-error', err)
      // })
    },
    matchFileEmoji(type) {
      return mdEmoji.type2emoji[type] || 'un_know'
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
.com-md-editor {
  .editor-container {
    &.fullscreen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
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
