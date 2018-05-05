import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'
import { FormTextarea } from 'bootstrap-vue/es/components'

import log4js from 'log4js'

import App from './App'
import router from './router'
import store from './store'

import { TwitterClient } from './modules/twitter'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.twitter = Vue.prototype.$twitter = TwitterClient
Vue.logger = Vue.prototype.$logger = log4js.getLogger()
Vue.logger.level = 'info'

Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))

Vue.use(FormTextarea)

Vue.filter('toSSL', (value) => {
  if (!value) return ''
  return value.replace(/^http:/, 'https:')
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
