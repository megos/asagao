<template>
  <div>
    <v-ons-list>
      <v-ons-lazy-repeat
        v-if="this.$store.state.twitter.timeline.length > 0"
        :render-item="renderItem"
        :length="this.$store.state.twitter.timeline.length"
      >
      </v-ons-lazy-repeat>
    </v-ons-list>
  </div>
</template>

<script>
  import Vue from 'vue'
  import TweetListItem from './TweetListItem'

  export default {
    name: 'timeline',
    mounted: function () {
      this.$store.dispatch('fetchTimeline')
    },
    methods: {
      renderItem (i) {
        const tw = this.$store.state.twitter.timeline[i]
        return new Vue({
          components: { TweetListItem },
          template: `
            <tweet-list-item :idx="index" :tweet="tweet">
            </tweet-list-item>
          `,
          data () {
            return {
              index: i,
              tweet: tw
            }
          }
        })
      }
    }
  }
</script>