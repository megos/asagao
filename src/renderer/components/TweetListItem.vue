<template>
  <v-ons-list-item :key="idx" v-if="tweet">
    <tweet-item :tweet="tweet"></tweet-item>
  </v-ons-list-item>
</template>

<script>
  import TweetItem from './TweetItem'

  export default {
    name: 'tweet-list-item',
    components: { TweetItem },
    props: [ 'idx', 'tweet' ]
  }
</script>