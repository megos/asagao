import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'

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

Vue.use(VueOnsen)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
