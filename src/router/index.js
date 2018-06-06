import Vue from 'vue'
import Router from 'vue-router'
import Operate from '@/pages/operate/operate.vue'
import Login from '@/pages/login/login.vue'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'operate',
      component: Operate
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
