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
  export default {
    name: 'asagao',
    data () {
      return {
        activeIndex: 0,
        tabs: [
          {
            icon: 'ion-home',
            label: 'Timeline',
            page: this.$router.options.routes[0].component,
            props: {mode: 'timeline'},
            key: 'Timeline'
          }
          // {
          //   icon: 'ios-chatbubbles',
          //   label: 'Mentions',
          //   page: this.$router.options.routes[0].component,
          //   props: {mode: 'mentions'},
          //   key: 'Mentions'
          // },
          // {
          //   icon: 'ion-heart',
          //   label: 'Favorites',
          //   page: this.$router.options.routes[0].component,
          //   props: {mode: 'favorites'},
          //   key: 'Favorites'
          // }
        ]
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
