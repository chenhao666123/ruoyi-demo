<template>
  <ElBreadcrumb class="app-breadcrumb" separator="/">
    <TransitionGroup name="breadcrumb">
      <ElBreadcrumbItem v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </ElBreadcrumbItem>
    </TransitionGroup>
  </ElBreadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show route with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === '首页'
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      } else {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-breadcrumb .el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
  }

  .no-redirect {
    color: #97a8be;
    cursor: pointer;
  }
</style>
