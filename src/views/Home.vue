<template>
  <div class="home">
    <h1>This is an home page</h1>
    <a-button type="primary">
      Primary
    </a-button>
  </div>
</template>

<script>
import { searchSong } from '@/api/exampleGet'

export default {
  name: 'Home',
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await searchSong({ keywords: '干饭人之歌' })
      // const res2 = await test()
      console.log(res)
    }
  }
}
</script>
