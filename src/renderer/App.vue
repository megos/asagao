<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">{{ tabs[activeIndex].label }}</div>
      </v-ons-toolbar>
      <!-- <router-view></router-view> -->
      <v-ons-tabbar
        :tabs="tabs"
        :index.sync="activeIndex"
      >
      </v-ons-tabbar>
    </v-ons-page>
  </div>
</template>

<script>
  import Timeline from '@/components/TimeLine'

  export default {
    name: 'asagao',
    data () {
      return {
        activeIndex: 0,
        tabs: [
          {
            icon: 'ion-home',
            label: 'Timeline',
            page: Timeline,
            props: {mode: 'Timeline'},
            key: 'Timeline'
          },
          {
            icon: 'ion-chatbubbles',
            label: 'Mentions',
            page: Timeline,
            props: {mode: 'Mentions'},
            key: 'Mentions'
          },
          {
            icon: 'ion-heart',
            label: 'Favorites',
            page: Timeline,
            props: {mode: 'Favorites'},
            key: 'Favorites'
          }
        ]
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
