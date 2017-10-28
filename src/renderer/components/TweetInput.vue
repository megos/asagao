<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        <v-ons-row>
          <v-ons-col width="100%">
            <textarea
              v-model="tweet"
              row="3"
              maxlength="140"
              placeholder="What's happening?"
            />
          </v-ons-col>
        </v-ons-row>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="right">
          <v-ons-button @click="postTweet">Tweet</v-ons-button>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TwitterClient } from '../modules/twitter'

  export default {
    name: 'tweet-input',
    data () {
      return {
        tweet: ''
      }
    },
    methods: {
      postTweet: function () {
        TwitterClient.postTweet(this.tweet)
          .then((res) => {
            this.tweet = ''
            this.changeActiveIndex(1)
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
