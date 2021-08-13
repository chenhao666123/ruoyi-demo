import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Element from 'element-ui'

const app = createApp(App)

app.use(store).use(Element).mount('#app')
