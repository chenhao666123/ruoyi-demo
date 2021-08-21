import { createApp, Vue } from 'vue'
import App from './App.vue'
import store from './store'
import Element from 'element-ui'
import Cookie from 'js-cookie'

import '@/assets/styles/index.scss'
import '@/assert/styles/ruoyi.css'
import './assets/icons'
import './permission'

import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/ruoyi";

// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'

// 头部标签组件
import VueMeta from 'vue-meta'

Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

const app = createApp(App)

app.use(store)
  .use(Element, {
    size: Cookie.get('size') || 'medium'
  })
  .mount('#app')
