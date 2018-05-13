<template>
  <v-ons-page>
    <v-ons-list v-if="tweets.length > 0">
      <tweet-list-item
        v-for="tweet in tweets"
        :key="tweet.id_str"
        :tweet="tweet"
      />
    </v-ons-list>
    <v-ons-list v-else>
      <tweet-skelton
        v-for="idx in 10"
        :key="idx"
      />
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import { mapState } from 'vuex'
  import TweetListItem from '@/components/TweetListItem'
  import TweetSkelton from '@/components/TweetSkelton'

  export default {
    components: { TweetListItem, TweetSkelton },
    props: [ 'mode' ],
    computed: {
      tweets: function () {
        if (this.mode === 'Timeline') {
          return this.timeline
        } else if (this.mode === 'Mentions') {
          return this.mentions
        } else if (this.mode === 'Favorites') {
          return this.favorites
        } else if (this.mode === 'Lists') {
          return this.lists
        }
      },
      ...mapState({
        timeline: state => state.twitter.timeline,
        mentions: state => state.twitter.mentions,
        favorites: state => state.twitter.favorites,
        lists: state => state.twitter.listsStatuses
      })
    }
  }
</script>