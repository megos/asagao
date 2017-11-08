<template>
  <v-ons-list-item
    tappable
    :key="idx"
    @click="clickItem"
  >
    <tweet-item :tweet="tweet"></tweet-item>
  </v-ons-list-item>
</template>

<script>
  import { mapActions } from 'vuex'
  import TweetItem from './TweetItem'

  export default {
    name: 'tweet-list-item',
    components: { TweetItem },
    props: [ 'idx', 'tweet' ],
    methods: {
      clickItem: function (event) {
        if (!(event.target.localName === 'a' || event.target.localName === 'img')) {
          this.openTweetItemDialog({
            idStr: this.tweet.id_str,
            screenName: this.tweet.user.screen_name,
            favorited: this.tweet.favorited
          })
        }
      },
      ...mapActions([
        'openTweetItemDialog'
      ])
    }
  }
</script>