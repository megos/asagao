<template>
  <v-ons-list-item
    :key="idx"
    modifier="longdivider"
    tappable
    @click="clickItem"
  >
    <div class="left">
      <img 
        :src="tweet.user.profile_image_url | toSSL" 
        class="list-item__thumbnail">
    </div>
    <div class="center">
      <tweet-item :tweet="tweet"/>
    </div>
  </v-ons-list-item>
</template>

<script>
  import { mapActions } from 'vuex'
  import TweetItem from './TweetItem'

  export default {
    name: 'TweetListItem',
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

<style scoped>
  /* Overwrite Onsen UI */
  .list-item__center {
    padding: 6px 6px 6px 0;
  }

  .list-item__left, .list-item__center {
    align-items: flex-start;
  }
</style>
