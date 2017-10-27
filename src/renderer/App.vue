<template>
  <div id="app">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Timeline</div>
      </v-ons-toolbar>
      <router-view></router-view>
    </v-ons-page>
  </div>
</template>

<script>
  import { CronJob } from 'cron'

  export default {
    name: 'asagao',
    created () {
      this.startJob()
    },
    methods: {
      startJob () {
        const self = this
        const job = new CronJob({
          cronTime: '0 */1 * * * *',
          onTick: () => self.$store.dispatch('fetchTimeline'),
          start: false,
          runOnInit: true
        })
        job.start()
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
