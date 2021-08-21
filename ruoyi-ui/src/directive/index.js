import hasRole from "@/directive/permission/hasRole";
import hasPermission from "@/directive/permission/hasPermission";
import dialogDrag from './dialog/drag'

const install = (Vue) => {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermission', hasPermission)
  Vue.directive('dialogDrag', dialogDrag)
}


if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermission'] = hasPermission
  window['dialogDrag'] = dialogDrag
  Vue.use(install)
}

export default install
