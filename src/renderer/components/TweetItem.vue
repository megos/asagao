<template>
  <v-ons-list-item :key="idx" v-if="tweet">
    {{ tweet.full_text }}
  </v-ons-list-item>
</template>

<script>
  export default {
    props: [ 'idx', 'tweet' ]
  }
</script>