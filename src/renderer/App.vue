<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar class="toolbar">
        <div class="center">Timeline</div>
      </v-ons-toolbar>
      <router-view></router-view>
    </v-ons-page>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CronJob } from 'cron'

  export default {
    name: 'asagao',
    created () {
      this.startJob()
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
      ...mapActions([ 'fetchTimeline' ])
    }
  }
</script>

<style>
  .toolbar {
    -webkit-app-region: drag
  }
</style>
