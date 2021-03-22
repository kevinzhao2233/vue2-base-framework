import Vue from 'vue'
import log from 'b-pretty-log'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './router'
import store from './store'
import './utils/progress'
import './styles/reset.css'
import 'ant-design-vue/dist/antd.css'
import 'remixicon/fonts/remixicon.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.prototype.$log = log

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
