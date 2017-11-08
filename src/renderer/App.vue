<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">{{ tabs[activeIndex].label }}</div>
      </v-ons-toolbar>
      <!-- <router-view></router-view> -->
      <v-ons-tabbar
        :tabs="tabs"
        :index="activeIndex"
        @prechange="preChange"
      >
      </v-ons-tabbar>
      <item-dialog></item-dialog>
    </v-ons-page>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { CronJob } from 'cron'
  import Timeline from '@/components/TimeLine'
  import TweetInput from '@/components/TweetInput'
  import ItemDialog from '@/components/ItemDialog'

  export default {
    name: 'asagao',
    components: { ItemDialog },
    created () {
      this.$logger.info('App start')
      this.fetchAccount()
      this.startTimelineCronJob()
    },
    computed: mapState({
      activeIndex: state => state.app.activeIndex
    }),
    data () {
      return {
        tabs: [
          {
            icon: 'ion-edit',
            page: TweetInput,
            style: { maxWidth: '50px' }
          },
          {
            icon: 'ion-home',
            label: 'Timeline',
            page: Timeline,
            props: { mode: 'Timeline' }
          },
          {
            icon: 'ion-at',
            label: 'Mentions',
            page: Timeline,
            props: { mode: 'Mentions' }
          },
          {
            icon: 'ion-heart',
            label: 'Favorites',
            page: Timeline,
            props: { mode: 'Favorites' }
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
          runOnInit: true
        })
        this.timelineCronJob.start()
        this.$logger.info('Timeline cron start')
      },
      startMentionsCronJob () {
        if (this.mentionsCronJob && this.mentionsCronJob.running) {
          this.mentionsCronJob.stop()
        }
        this.mentionsCronJob = new CronJob({
          cronTime: '20 */10 * * * *',
          onTick: () => this.fetchMentions(),
          runOnInit: true
        })
        this.mentionsCronJob.start()
        this.$logger.info('Mentions cron start')
      },
      startFavoritesCronJob () {
        if (this.favoritesCronJob && this.favoritesCronJob.running) {
          this.favoritesCronJob.stop()
        }
        this.favoritesCronJob = new CronJob({
          cronTime: '40 0 */1 * * *',
          onTick: () => this.fetchFavorites(),
          runOnInit: true
        })
        this.favoritesCronJob.start()
        this.$logger.info('Favorites cron start')
      },
      preChange (event) {
        this.changeActiveIndex(event.index)
        const mode = this.tabs[event.index].props ? this.tabs[event.index].props.mode : ''
        if (mode === 'Timeline' && !this.timelineCronJob) {
          this.startTimelineCronJob()
        } else if (mode === 'Mentions' && !this.mentionsCronJob) {
          this.startMentionsCronJob()
        } else if (mode === 'Favorites' && !this.favoritesCronJob) {
          this.startFavoritesCronJob()
        }
      },
      ...mapActions([
        'fetchAccount',
        'fetchTimeline',
        'fetchMentions',
        'fetchFavorites',
        'changeActiveIndex'
      ])
    }
  }
</script>

<style>
  .toolbar {
    -webkit-app-region: drag
  }
</style>
