import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
import da from "element-ui/src/locale/lang/da";

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, dynamicTitle, sidebarLogo } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  title: '',
  theme: storageSetting.sideTheme || variables.theme,
  sideTheme: storageSetting.sideTheme || sideTheme,
  showSettings,
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
}

const mutations = {
  CHANGE_SETTINGS: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 修改布局设置
  changeSetting: ({ commit }, data) => {
    commit('CHANGE_SETTINGS', data)
  },
  // 设置网络标题
  setTitle: ({ commit }, title) => {
    state.title = title
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
