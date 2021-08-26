import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
import user from './module/'
import tagsView from './module/tagsView'
import permission from './module/permission'
import settings from './module/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings
  },
  getters
})

export default store
