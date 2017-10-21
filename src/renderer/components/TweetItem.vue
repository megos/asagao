<template>
  <v-ons-list-item :key="this.$props.idx" v-if="this.$props.tweet">
    {{ this.$props.tweet.full_text }}
  </v-ons-list-item>
</template>

<script>
  export default {
    props: [ 'idx', 'tweet' ]
  }
</script>