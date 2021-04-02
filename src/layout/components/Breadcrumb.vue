<template>
  <div class="com-layout-breadcrumb">
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.name">
        <router-link :to="item.path">{{item.meta.title}}</router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data: () => ({
    breadcrumbList: null
  }),
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler() {
        this.getBreadcrumb()
      }
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isHome(first)) {
        matched = [{ path: '/', meta: { title: '首页' }}].concat(matched)
      }

      this.breadcrumbList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },

    isHome(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
    }
  }
}
</script>
