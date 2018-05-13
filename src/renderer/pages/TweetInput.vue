<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item modifier="longdivider">
        <b-form-textarea
          v-model="tweet"
          :rows="10"
          :no-resize="true"
          :maxlength="maxLength"
          placeholder="What's happening?"
        />
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="right">
          <v-ons-button 
            :disabled="tweet.length === 0" 
            @click="postTweet">Tweet</v-ons-button>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'TweetInput',
    data () {
      return {
        tweet: '',
        maxLength: 280
      }
    },
    watch: {
      screenName: function (value) {
        if (this.screenName !== '' && this.tweet === '') {
          this.tweet = `@${this.screenName} `
        } else if (this.screenName === '') {
          this.tweet = ''
        }
      }
    },
    computed: mapState({
      idStr: state => state.app.idStr,
      screenName: state => state.app.screenName
    }),
    methods: {
      postTweet: function () {
        this.$twitter.postTweet(this.tweet, this.screenName, this.idStr)
          .then((res) => {
            this.addTimeline(res)
            this.tweet = ''
            this.removeSelectedItem()
            this.$ons.notification.toast('Tweeted!', {timeout: 2000})
            // Move to timeline
            this.changeActiveIndex(1)
          })
          .catch(() => {
            this.$ons.notification.alert('Tweet failed...')
          })
      },
      ...mapActions([
        'addTimeline',
        'changeActiveIndex',
        'removeSelectedItem'
      ])
    }
  }
</script>
