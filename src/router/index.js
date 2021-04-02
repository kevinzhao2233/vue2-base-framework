import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/index.vue'
import Redirect from '../views/redirect/index.vue'
import Error from '../views/error/index.vue'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/home',
    name: '测试',
    children: [
      {
        path: '/test/home',
        name: 'Test',
        component: Error,
        meta: {
          title: '测试1'
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path*',
        name: 'Redirect',
        component: Redirect
      }
    ]
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  },
  {
    path: '*',
    redirect: Error
  }
]

const router = new VueRouter({
  routes
})

export default router
