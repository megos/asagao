<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        <v-ons-row>
          <v-ons-col width="100%">
            <textarea
              v-model="tweet"
              row="3"
              placeholder="What's happening?"
              :maxlength="maxLength"
            />
          </v-ons-col>
        </v-ons-row>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="right">
          <v-ons-button @click="postTweet" :disabled="tweet.length === 0">Tweet</v-ons-button>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'tweet-input',
    data () {
      return {
        tweet: '',
        maxLength: 140
      }
    },
    methods: {
      postTweet: function () {
        this.$twitter.postTweet(this.tweet)
          .then((res) => {
            this.tweet = ''
            // Move to timeline
            this.changeActiveIndex(1)
          })
          .catch((err) => {
            this.$logger.error(err)
            this.$ons.notification.alert('Tweet failed...')
          })
      },
      ...mapActions([
        'changeActiveIndex'
      ])
    }
  }
</script>

<style scoped>
  textarea {
    resize: none;
    border: none;
    width: 100%;
    height: 100%;
    font-size: 12pt;
  }
</style>
