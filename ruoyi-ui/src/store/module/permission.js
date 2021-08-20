import { constantRoutes } from "@/router";
import { getRouters } from '@/api/menu'
import InnerLink from '@/layout/components/InnerLink'


const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [{
        path: 'index',
        meta: { title: '统计报表', icon: 'dashboard' }
      }]
      state.topbarRouters = routes.concat(index)
    },
    SET_SIDEBAR_ROUTES: (state, routes) => {
      state.sidebarRoutes = routes
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sidebarData = JSON.parse(JSON.stringify(res.data))
          const rewriteData = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sidebarData)
          const rewriteRoutes = filterAsyncRouter(rewriteData)
          rewriteRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          commit('SET_ROUTES', rewriteRoutes)
          commit('SER_SIDEBAR_ROUTES', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串, 转换为组件对象
const filterAsyncRouter = (asyncRouterMap, lastRouter = false, type = false) => {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊化处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }

    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}


const filterChildren = (childrenMap, lastRouter = false) => {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = view => {
  // 路由lazy loading
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
