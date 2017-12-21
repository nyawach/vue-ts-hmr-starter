import { RouterOptions } from 'vue-router/types/router'

import VueRouter         from 'vue-router'
import Vue               from 'vue'

import { ROUTES }        from '../const'

import Index from '../components/pages/Index.vue'
import About from '../components/pages/about/About.vue'

const routes = [
  {
    path:      '/',
    name:      ROUTES.INDEX,
    component: Index,
  }, {
    path:      '/about/',
    name:      ROUTES.ABOUT,
    component: About,
  },
]

Vue.use(VueRouter)

const config: RouterOptions = {
  routes,
  mode: 'history',
}

export default new VueRouter(config)
