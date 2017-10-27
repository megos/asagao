<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
        v-if="tweets.length > 0"
        :render-item="renderItem"
        :length="tweets.length"
      >
      </v-ons-lazy-repeat>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import TweetListItem from './TweetListItem'

  export default {
    name: 'timeline',
    props: [ 'mode' ],
    computed: {
      tweets: function () {
        if (this.mode === 'Timeline') {
          return this.timeline
        } else if (this.mode === 'Mentions') {
          return this.mentions
        } else if (this.mode === 'Favorites') {
          return this.favorites
        }
      },
      ...mapState({
        timeline: state => state.twitter.timeline,
        mentions: state => state.twitter.mentions,
        favorites: state => state.twitter.favorites
      })
    },
    methods: {
      renderItem (i) {
        const tw = this.tweets[i]
        return new Vue({
          components: { TweetListItem },
          template: `
            <tweet-list-item :idx="index" :tweet="tweet">
            </tweet-list-item>
          `,
          data () {
            return {
              index: tw.id_str,
              tweet: tw
            }
          }
        })
      }
    }
  }
</script>