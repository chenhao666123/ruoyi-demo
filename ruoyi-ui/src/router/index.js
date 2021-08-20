import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true
  }
]
