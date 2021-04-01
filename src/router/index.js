import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Redirect from '../views/redirect/index.vue'
import Error from '../views/error/index.vue'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/redirect/:path*',
    name: 'Redirect',
    component: Redirect
  },
  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: '',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  }
]

const router = new VueRouter({
  routes
})

export default router
