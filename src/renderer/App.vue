<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">
          <div>
            {{ tabs[activeIndex].label }}
          </div>
          <v-ons-select
          >
            <option v-for="item in listItem" :value="item.id_str" :key="item.id_str">
              {{ item.full_name }}
            </option>
          </v-ons-select>
        </div>
        <div class="right">
          <v-ons-toolbar-button v-if="activeIndex !== 0">
            <ons-icon
              icon="ion-ios-reload"
              @click="load"
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
      this.fetchLists()
      this.fetchAccount()
      this.load()
    },
    computed: mapState({
      activeIndex: state => state.app.activeIndex,
      listItem: state => state.twitter.lists
    }),
    data () {
      return {
        tabs: [
          {
            icon: 'ion-edit',
            label: 'New Tweet',
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
          Timeline: {
            instance: null,
            cronTime: '0 */1 * * * *',
            onTick: this.fetchTimeline
          },
          Mentions: {
            instance: null,
            cronTime: '20 */10 * * * *',
            onTick: this.fetchMentions
          },
          Favorites: {
            instance: null,
            cronTime: '40 0 */1 * * *',
            onTick: this.fetchFavorites
          }
        }
      }
    },
    methods: {
      startCronJob (mode) {
        const job = this.jobs[mode]
        if (job.instance && job.instance.running) {
          job.instance.stop()
        }
        job.instance = new CronJob({
          cronTime: job.cronTime,
          onTick: () => job.onTick(),
          start: true,
          runOnInit: true
        })
        this.$logger.info(`${mode} cron start`)
      },
      load () {
        this.startCronJob([this.tabs[this.activeIndex].props.mode])
      },
      preChange (event) {
        this.changeActiveIndex(event.index)
        const mode = this.tabs[event.index].props ? this.tabs[event.index].props.mode : ''
        if (mode !== '' && !this.jobs[mode].instance) {
          this.startCronJob(mode)
        }
      },
      ...mapActions([
        'fetchAccount',
        'fetchLists',
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
