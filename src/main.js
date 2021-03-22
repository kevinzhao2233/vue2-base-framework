import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import './styles/reset.css'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import store from './store'
import './utils/progress'
import log from 'b-pretty-log'

import 'remixicon/fonts/remixicon.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.prototype.$log = log

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
