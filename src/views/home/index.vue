<template>
  <div class="home">
    <div class="editor">
      <md-editor mini/>
    </div>
    <div class="reader">
      <md-reader/>
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
    content: ''
  })
}
</script>
<style lang="scss" scoped>
.editor {
  width: 600px;
  margin: 0 auto;
}
</style>
