import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Element from 'element-ui'
import Cookie from 'js-cookie'

const app = createApp(App)

app.use(store)
  .use(Element, {
    size: Cookie.get('size') || 'medium'
  })
  .mount('#app')
