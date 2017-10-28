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
  import TweetInput from '@/components/TweetInput'

  export default {
    name: 'asagao',
    created () {
      this.startTimelineCronJob()
    },
    data () {
      return {
        activeIndex: 1,
        tabs: [
          {
            icon: 'ion-home',
            label: 'New Tweet',
            page: TweetInput,
            key: 'Tweet'
          },
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
        ],
        timelineCronJob: null,
        mentionsCronJob: null,
        favoritesCronJob: null
      }
    },
    methods: {
      startTimelineCronJob () {
        if (this.timelineCronJob && this.timelineCronJob.running) {
          this.timelineCronJob.stop()
        }
        this.timelineCronJob = new CronJob({
          cronTime: '0 */1 * * * *',
          onTick: () => this.fetchTimeline(),
          start: true,
          runOnInit: true
        })
      },
      startMentionsCronJob () {
        if (this.mentionsCronJob && this.mentionsCronJob.running) {
          this.mentionsCronJob.stop()
        }
        this.mentionsCronJob = new CronJob({
          cronTime: '20 */10 * * * *',
          onTick: () => this.fetchMentions(),
          start: true,
          runOnInit: true
        })
      },
      startFavoritesCronJob () {
        if (this.favoritesCronJob && this.favoritesCronJob.running) {
          this.favoritesCronJob.stop()
        }
        this.favoritesCronJob = new CronJob({
          cronTime: '40 0 */1 * * *',
          onTick: () => this.fetchFavorites(),
          start: true,
          runOnInit: true
        })
      },
      preChange (event) {
        const mode = this.tabs[event.activeIndex].props ? this.tabs[event.activeIndex].props.mode : ''
        if (mode === 'Timeline' && !this.timelineCronJob) {
          this.startTimelineCronJob()
        } else if (mode === 'Mentions' && !this.mentionsCronJob) {
          this.startMentionsCronJob()
        } else if (mode === 'Favorites' && !this.favoritesCronJob) {
          this.startFavoritesCronJob()
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
