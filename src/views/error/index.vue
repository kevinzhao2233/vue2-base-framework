<template>
  <div class="page-error">
    <div class="err-img" :class="`img-${errType}`"></div>
    <h2 class="err-code">{{query.code}}</h2>
    <p class="err-message">{{errMessage}}</p>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data: () => ({
    query: {}
  }),
  computed: {
    errType() {
      if (+this.query.code === 403) {
        return 'err'
      } else if (+this.query.code === 404) {
        return 'err-notfound'
      } else if (+this.query.code >= 500) {
        return 'err-network'
      }
      return 'err'
    },
    errMessage() {
      if (+this.query.code === 403) {
        return '对不起，您没有权限访问此页面！'
      } else if (+this.query.code === 404) {
        return '对不起，该页面不存在！'
      } else if (+this.query.code >= 500) {
        return '对不起，服务器出现错误，请稍后重试！'
      }
      return '出错啦~'
    }
  },
  created() {
    if (this.$route.query) {
      this.query = this.$route.query
    }
  }
}
</script>

<style lang="scss">
.page-error {
  padding: 50px;
  text-align: center;
  .err-img {
    width: 300px;
    height: 300px;
    margin: 0 auto;

    &.img-err {
      background: url('../../assets/img/framework/err.svg') center / contain no-repeat;
    }
    &.img-err-notfound {
      background: url('../../assets/img/framework/err-notfound.svg') center / contain no-repeat;
    }
    &.img-err-network {
      background: url('../../assets/img/framework/err-network.svg') center / contain no-repeat;
    }
  }

  .err-code {
    font-size: 32px;
  }
}
</style>
