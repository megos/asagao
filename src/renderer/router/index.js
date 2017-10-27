import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'timeline',
      component: require('@/components/TimeLine').default,
      props: { mode: 'Timeline' }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
