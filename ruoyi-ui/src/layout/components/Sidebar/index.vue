<template>
  <div :class="{ 'has-logo': showLogo }"
       :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <Logo :collapse="isCollapse" v-if="showLogo" />
    <ElScrollbar
      :class="settings.sideTheme"
      wrap-class="scrollbar-wrapper">
      <ElMenu
        :active-text-color="settings.theme"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
        :unique-opened="true"
        mode="vertical"
      >
        <SidebarItem
          :base-path="route.path"
          :item="route"
          :key="route.path  + index"
          v-for="(route, index) in sidebarRouters" />
      </ElMenu>
    </ElScrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from './logo'
import SidebarItem from "@/layout/components/Sidebar/SidebarItem";
import variables from '@/assets/styles/variables.scss'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const {meta, path} = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>

</style>
