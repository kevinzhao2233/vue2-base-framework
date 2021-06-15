<template>
  <div class="home">
    <div class="editor">
      <md-editor ref="mdEditor" :mini="true" :option="editorOption"/>
    </div>
    <div class="reader">
      <md-reader ref="mdReader" :option="readerOption" :content="content" placeholder="暂无内容"/>
    </div>
  </div>
</template>

<script>
import mdEditor from '@/components/markdown/editor'
import mdReader from '@/components/markdown/reader'

export default {
  name: 'Home',
  components: {
    mdEditor,
    mdReader
  },
  data: () => ({
    editorOption: {
      upload: {
        url: 'http://10.18.104.34:5000/files-anon/'
      }
      // after() {
      //   this.refs.mdEditor.vditorInstance.setValue('# hello\n12345')
      //   console.log(this.refs.mdEditor.vditorInstance.getValue())
      // }
    },
    readerOption: {

    },
    content: ''
  }),
  mounted() {
    setInterval(() => {
      this.content = this.$refs.mdEditor.vditorInstance.getValue()
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.editor,
.reader {
  width: 600px;
  margin: 0 auto;
}
</style>
