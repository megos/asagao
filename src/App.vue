<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">
          <div v-if="tabs[activeIndex].label !== 'Lists'">
            {{ tabs[activeIndex].label }}
          </div>
          <v-ons-select
            v-else
            v-model="selectedItem"
            @change="changeListId"
          >
            <option
              v-for="item in listItem"
              :key="item.id_str"
              :value="item.id_str"
            >
              {{ item.full_name }}
            </option>
          </v-ons-select>
        </div>
        <div class="right">
          <v-ons-toolbar-button v-if="activeIndex !== 0">
            <ons-icon
              icon="ion-ios-reload"
              @click="load"
            />
          </v-ons-toolbar-button>
        </div>
      </v-ons-toolbar>
      <!-- <router-view></router-view> -->
      <v-ons-tabbar
        :tabs="tabs"
        :index="activeIndex"
        @prechange="preChange"
      />
      <item-dialog />
    </v-ons-page>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { CronJob } from 'cron'
import Timeline from '@/pages/Timeline'
import TweetInput from '@/pages/TweetInput'
import ItemDialog from '@/components/ItemDialog'

export default {
  name: 'Asagao',
  components: { ItemDialog },
  data() {
    return {
      selectedItem: '',
      tabs: [
        {
          icon: 'ion-edit',
          label: 'New Tweet',
          page: TweetInput,
          style: { maxWidth: '50px' },
        },
        {
          icon: 'ion-home',
          label: 'Timeline',
          page: Timeline,
          props: { mode: 'Timeline' },
        },
        {
          icon: 'ion-at',
          label: 'Mentions',
          page: Timeline,
          props: { mode: 'Mentions' },
        },
        {
          icon: 'ion-heart',
          label: 'Favorites',
          page: Timeline,
          props: { mode: 'Favorites' },
        },
        {
          icon: 'ion-ios-list-outline',
          label: 'Lists',
          page: Timeline,
          props: { mode: 'Lists' },
        },
      ],
      jobs: {
        Timeline: {
          instance: null,
          cronTime: '0 */1 * * * *',
          onTick: this.fetchTimeline,
        },
        Mentions: {
          instance: null,
          cronTime: '20 */10 * * * *',
          onTick: this.fetchMentions,
        },
        Favorites: {
          instance: null,
          cronTime: '40 0 */1 * * *',
          onTick: this.fetchFavorites,
        },
        Lists: {
          instance: null,
          cronTime: '20 */10 * * * *',
          onTick: this.fetchListsStatuses,
        },
      },
    }
  },
  computed: mapState({
    activeIndex: state => state.app.activeIndex,
    listItem: state => state.twitter.lists,
  }),
  created() {
    this.$logger.info('App start')
    this.restore()
      .then(() => {
        this.fetchLists()
        this.fetchAccount()
        this.load()
      })
  },
  methods: {
    startCronJob(mode) {
      this.stopCronJob(mode)
      const job = this.jobs[mode]
      job.instance = new CronJob({
        cronTime: job.cronTime,
        onTick: () => job.onTick(),
        start: true,
        runOnInit: true,
      })
      this.$logger.info(`${mode} cron started`)
    },
    stopCronJob(mode) {
      const job = this.jobs[mode]
      if (job.instance && job.instance.running) {
        job.instance.stop()
        this.$logger.info(`${mode} cron stopped`)
      }
    },
    load() {
      this.startCronJob([this.tabs[this.activeIndex].props.mode])
    },
    preChange(event) {
      this.changeActiveIndex(event.index)
      const mode = this.tabs[event.index].props ? this.tabs[event.index].props.mode : ''
      if (mode !== '' && mode !== 'Lists' && !this.jobs[mode].instance) {
        this.startCronJob(mode)
      }
    },
    changeListId() {
      this.setListId(this.selectedItem)
      if (this.selectedItem === '') {
        this.stopCronJob('Lists')
      } else {
        this.startCronJob('Lists')
      }
    },
    ...mapActions([
      'restore',
      'fetchAccount',
      'fetchLists',
      'fetchTimeline',
      'fetchMentions',
      'fetchFavorites',
      'fetchListsStatuses',
      'changeActiveIndex',
      'setListId',
    ]),
  },
}
</script>

<style>
.toolbar {
  -webkit-app-region: drag
}
</style>
