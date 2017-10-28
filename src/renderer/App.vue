<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">{{ tabs[activeIndex].label }}</div>
      </v-ons-toolbar>
      <!-- <router-view></router-view> -->
      <v-ons-tabbar
        :tabs="tabs"
        :index.sync="activeIndex"
        @prechange="preChange"
      >
      </v-ons-tabbar>
    </v-ons-page>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CronJob } from 'cron'
  import Timeline from '@/components/TimeLine'

  export default {
    name: 'asagao',
    created () {
      this.startJob()
    },
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
    },
    methods: {
      startJob () {
        const job = new CronJob({
          cronTime: '0 */1 * * * *',
          onTick: () => this.fetchTimeline(),
          start: false,
          runOnInit: true
        })
        job.start()
      },
      preChange (event) {
        const mode = this.tabs[event.activeIndex].props.mode
        if (mode === 'Timeline' && this.$store.state.twitter.timeline.length === 0) {
          this.fetchTimeline()
        } else if (mode === 'Mentions' && this.$store.state.twitter.mentions.length === 0) {
          this.fetchMentions()
        } else if (mode === 'Favorites' && this.$store.state.twitter.favorites.length === 0) {
          this.fetchFavorites()
        }
      },
      ...mapActions([
        'fetchTimeline',
        'fetchMentions',
        'fetchFavorites'
      ])
    }
  }
</script>

<style>
  .toolbar {
    -webkit-app-region: drag
  }
</style>
