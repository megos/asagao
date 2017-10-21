<template>
  <div>
    <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="this.$store.state.twitter.timeline.length"
      >
      </v-ons-lazy-repeat>
    </v-ons-list>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'timeline',
    mounted: function () {
      this.$store.dispatch('fetchTimeline')
    },
    methods: {
      renderItem (i) {
        return new Vue({
          template: `
            <v-ons-list-item :key="index">
              {{ index }}
            </v-ons-list-item>
          `,
          data () {
            return {
              index: i
            }
          }
        })
      }
    }
  }
</script>