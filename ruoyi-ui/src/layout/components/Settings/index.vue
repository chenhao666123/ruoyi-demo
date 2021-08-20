<template>

</template>

<script>
import ThemePicker from '@/components/ThemePicker'
export default {
  components: { ThemePicker }
  data() {
    return {
      theme: this.$store.state.settings.theme,
      sideTheme: this.$store.state.settings.sideTheme
    }
  }
}
</script>

<style scoped>

</style>
