import Vue from 'vue'
import Router from 'vue-router'
import Timeline from '@/pages/Timeline'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'timeline',
      component: Timeline,
      props: { mode: 'Timeline' },
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
