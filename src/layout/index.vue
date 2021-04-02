<template>
  <div class="layout">
    <Breadcrumb/>
    <router-view/>
  </div>
</template>

<script>
import Breadcrumb from './components/Breadcrumb'
export default {
  name: 'Layout',
  components: {
    Breadcrumb
  }
}
</script>

<style lang="scss" scoped>
.layout {

}
</style>
