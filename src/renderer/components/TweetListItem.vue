<template>
  <v-ons-list-item
    tappable
    :key="idx"
    @click="openTweetItemDialog"
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
    methods: mapActions([
      'openTweetItemDialog'
    ])
  }
</script>