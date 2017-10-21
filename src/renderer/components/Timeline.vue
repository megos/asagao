<template>
  <div>timeline {{ this.$store.state.twitter.timeline }}</div>
</template>

<script>
export default {
  name: 'timeline',
  data () {
    return {
      tweet: this.$store.state.twitter.timeline
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchTimeline')
  }
}
</script>