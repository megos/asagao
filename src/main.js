import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import $ons from 'vue-onsenui/esm'
import { FormTextarea } from 'bootstrap-vue/es/components'

import log4js from 'log4js'
import * as VOns from './vue-onsen-components'

import App from './App'
import router from './router'
import store from './store'

import { TwitterClient } from './modules/twitter'

Vue.config.productionTip = false

Vue.prototype.$twitter = TwitterClient
Vue.prototype.$logger = log4js.getLogger()
Vue.prototype.$logger.level = 'info'

Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))

Vue.use(FormTextarea)

Vue.filter('toSSL', (value) => {
  if (!value) return ''
  return value.replace(/^http:/, 'https:')
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
