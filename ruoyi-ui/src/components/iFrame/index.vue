<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe
      :src="src"
      frameborder="no"
      style="width: 100%; height: 100%;"
      scrolling="auto"/>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      require: true
    }
  },
  date() {
    return {
      height: document.documentElement.clientHeight - 94.4 + 'px',
      loading: true,
      url: this.src
    }
  },
  mounted: () => {
    setTimeout(() => {
      this.loading = false
    }, 300)
    const that = this
    window.onresize = () => {
      that.height = document.documentElement.clientHeight - 94.5 + 'px'
    }
  }
}
</script>

<style scoped>

</style>
