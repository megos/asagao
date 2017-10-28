<template>
  <v-ons-page>
    <v-ons-list>
      <tweet-list-item v-for="(tweet, idx) in tweets" :key="idx" :tweet="tweet">
      </tweet-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import { mapState } from 'vuex'
  import TweetListItem from './TweetListItem'

  export default {
    name: 'timeline',
    props: [ 'mode' ],
    components: { TweetListItem },
    computed: {
      tweets: function () {
        if (this.mode === 'Timeline') {
          return this.timeline
        } else if (this.mode === 'Mentions') {
          return this.mentions
        } else if (this.mode === 'Favorites') {
          return this.favorites
        }
      },
      ...mapState({
        timeline: state => state.twitter.timeline,
        mentions: state => state.twitter.mentions,
        favorites: state => state.twitter.favorites
      })
    }
  }
</script>