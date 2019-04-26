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
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  computed: {
    tweets() {
      switch (this.mode) {
        case 'Timeline':
        default:
          return this.timeline
        case 'Mentions':
          return this.mentions
        case 'Favorites':
          return this.favorites
        case 'Lists':
          return this.lists
      }
    },
    ...mapState({
      timeline: state => state.twitter.timeline,
      mentions: state => state.twitter.mentions,
      favorites: state => state.twitter.favorites,
      lists: state => state.twitter.listsStatuses,
    }),
  },
}
</script>
