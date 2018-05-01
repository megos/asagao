<template>
  <v-ons-list-item
    modifier="longdivider"
    tappable
    :key="idx"
    @click="clickItem"
  >
    <div class="left">
      <img :src="tweet.user.profile_image_url" class="list-item__thumbnail">
    </div>
    <div class="center">
      <tweet-item :tweet="tweet"></tweet-item>
    </div>
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
            favorited: this.tweet.favorited,
            retweeted: this.tweet.retweeted
          })
        }
      },
      ...mapActions([
        'openTweetItemDialog'
      ])
    }
  }
</script>