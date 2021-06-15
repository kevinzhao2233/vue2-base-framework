<template>
  <div class="com-md-reader">
    <div ref="mdContainer" class="md-container vditor-reset" :class="readerOption.theme"></div>
  </div>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/src/assets/scss/index.scss'
import mdEmoji from '../common/mdEmoji'
import qs from 'qs'
import * as utils from '../utils/index'

export default {
  name: 'MdReader',
  props: {
    option: { type: Object, default: null },
    content: { type: String, default: '' },
    placeholder: { type: String, default: '暂无内容' }
  },
  data: () => ({
    filePreviewTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'xls', 'txt'],
    filePreviewUrl: '',
    defaultOption: {
      mode: 'light',
      theme: 'ant-design',
      anchor: 0, // 不渲染标题锚点, 渲染锚点会让整个页面路由乱掉
      hljs: 'igor', // 代码主题，可选项见 https://xyproto.github.io/splash/docs/longer/all.html
      customEmoji: mdEmoji.emoji,
      speech: { // 对选中后的文字进行阅读
        enable: false
      },
      markdown: {
        autoSpace: true, // 自动空格
        sanitize: true // 是否启用过滤 XSS
      }
    },
    readerOption: null
  }),
  computed: {
    mdContent() {
      return this.content ? this.content : this.placeholder
    }
  },
  watch: {
    content() {
      this.render(this.mdContent)
    }
  },
  created() {
    this.setOption()
  },
  mounted() {
    this.render(this.mdContent)
    this.$refs.mdContainer.addEventListener('click', this.previewFile)
  },
  beforeDestroy() {
    this.$refs.mdContainer.removeEventListener('click', this.previewFile)
  },

  methods: {
    setOption() {
      // 合并自定义 option
      if (!this.option) return
      this.readerOption = utils.mergeObject(this.defaultOption, this.option)
    },
    render(markdown) {
      Vditor.preview(this.$refs.mdContainer, markdown, this.options)
    },
    // 文件 / 图片预览
    previewFile(e) {
      if (e.target.tagName.toUpperCase() === 'IMG' && e.target.className !== 'emoji') {
        Vditor.previewImage(e.target, 'zh_CN')
        return
      }
      if (e.target.tagName.toUpperCase() !== 'A') return
      // 链接的地址
      const href = e.target.href
      const paramsStr = href.split('?')[1]
      const params = qs.parse(paramsStr)
      if (params.upload === 1 && paramsStr.indexOf('&type=') > 0) {
        const type = params.type
        if (this.filePreviewTypes.includes(type)) {
          e.preventDefault()
          const previewUrl = this.filePreviewUrl + encodeURIComponent(href)
          window.open(previewUrl, '_blink', 'noopener')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-md-reader {
    .md-container {
      &.vditor-reset {
        line-height: 1.7;

        img:not(img[class='emoji']) {
          cursor: zoom-in;
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
