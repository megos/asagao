<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">{{ tabs[activeIndex].label }}</div>
        <div class="right">
          <v-ons-toolbar-button v-if="activeIndex !== 0">
            <ons-icon
              icon="ion-ios-reload"
            >
            </ons-icon>
          </v-ons-toolbar-button>
        </div>
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
  import Timeline from '@/components/Timeline'
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
        jobs: {
          Timeline: null,
          Mentions: null,
          Favorites: null
        },
        startJobs: {
          Timeline: this.startTimelineCronJob,
          Mentions: this.startMentionsCronJob,
          Favorites: this.startFavoritesCronJob
        }
      }
    },
    methods: {
      startTimelineCronJob () {
        if (this.jobs.Timeline && this.jobs.Timeline.running) {
          this.jobs.Timeline.stop()
        }
        this.jobs.Timeline = new CronJob({
          cronTime: '0 */1 * * * *',
          onTick: () => this.fetchTimeline(),
          runOnInit: true
        })
        this.jobs.Timeline.start()
        this.$logger.info('Timeline cron start')
      },
      startMentionsCronJob () {
        if (this.jobs.Mentions && this.jobs.Mentions.running) {
          this.jobs.Mentions.stop()
        }
        this.jobs.Mentions = new CronJob({
          cronTime: '20 */10 * * * *',
          onTick: () => this.fetchMentions(),
          runOnInit: true
        })
        this.jobs.Mentions.start()
        this.$logger.info('Mentions cron start')
      },
      startFavoritesCronJob () {
        if (this.jobs.Favorites && this.jobs.Favorites.running) {
          this.jobs.Favorites.stop()
        }
        this.jobs.Favorites = new CronJob({
          cronTime: '40 0 */1 * * *',
          onTick: () => this.fetchFavorites(),
          runOnInit: true
        })
        this.jobs.Favorites.start()
        this.$logger.info('Favorites cron start')
      },
      preChange (event) {
        this.changeActiveIndex(event.index)
        const mode = this.tabs[event.index].props ? this.tabs[event.index].props.mode : ''
        if (mode !== '' && !this.jobs[mode]) {
          this.startJobs[mode]()
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
