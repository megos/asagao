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
  export default {
    name: 'asagao',
    mounted: function () {
      this.$store.dispatch('fetchTimeline')
    }
  }
</script>

<style>
  /* CSS */
</style>
