<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
        v-if="tweets.length > 0"
        :render-item="renderItem"
        :length="tweets.length"
      >
      </v-ons-lazy-repeat>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import Vue from 'vue'
  import TweetListItem from './TweetListItem'

  export default {
    name: 'timeline',
    props: [ 'mode' ],
    computed: {
      tweets: function () {
        if (this.mode === 'Timeline') {
          return this.$store.state.twitter.timeline
        } else if (this.mode === 'Mentions') {
          return this.$store.state.twitter.mentions
        } else if (this.mode === 'Favorites') {
          return this.$store.state.twitter.favorites
        }
      }
    },
    mounted: function () {
      this.$store.dispatch('fetch' + this.mode)
    },
    methods: {
      renderItem (i) {
        const tw = this.tweets[i]
        let retw = tw.retweeted_status
        if (retw) {
          retw.retweeted_user = tw.user.name
        }
        return new Vue({
          components: { TweetListItem },
          template: `
            <tweet-list-item :idx="index" :tweet="retweet ? retweet : tweet">
            </tweet-list-item>
          `,
          data () {
            return {
              index: i,
              tweet: tw,
              retweet: retw
            }
          }
        })
      }
    }
  }
</script>