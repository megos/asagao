<template>
  <v-ons-list-item :key="idx" v-if="tweet">
    <v-ons-row>
      <v-ons-col width="50px">
        <img v-bind:src="tweet.user.profile_image_url" class="image">
      </v-ons-col>
      <v-ons-col>
        <v-ons-row>
          <v-ons-col>        
            <div class="from">
              <span class="name">{{tweet.user.name}}</span>
              <span class="id">@{{tweet.user.screen_name}}</span>
              <span v-if="tweet.user.protected" class="protected"><ons-icon icon="fa-lock"></ons-icon></span>
              <span v-if="tweet.user.verified" class="verified"><ons-icon icon="fa-check-circle"></ons-icon></span>
            </div>
          </v-ons-col>
          <v-ons-col>
            <div class="date">{{ getRelativeCreatedAt(tweet.created_at) }}</div>
          </v-ons-col>
        </v-ons-row>
        <v-ons-row>
          <v-ons-col>
            <div v-html="link(tweet.full_text)" class="message"></div>
          </v-ons-col>
        </v-ons-row>
      </v-ons-col>
    </v-ons-row>
  </v-ons-list-item>
</template>

<script>
  import moment from 'moment'
  import autolinker from 'autolinker'
  import sanitizeHtml from 'sanitize-html'

  export default {
    props: [ 'idx', 'tweet' ],
    methods: {
      getRelativeCreatedAt: function (createdAt) {
        if (moment().diff(createdAt, 'days') > 7) {
          return moment(createdAt).format('YYYY/MM/DD')
        } else {
          return moment(createdAt).fromNow()
        }
      },
      link: function (text) {
        text = sanitizeHtml(text)
        return autolinker.link(text, {
          twitter: true,
          hashtag: 'twitter'
        })
      }
    }
  }
</script>

<style scoped>
  .image {
    border-radius: 5px;
  }

  .name {
    font-size: 12px;
    font-weight: 500;
  }

  .id {
    font-size: 11px;
    color: gray;
    font-weight: 1000;
  }

  .protected, .verified {
    font-size: 11px;
    color: gray;
  }

  .date {
    float: right;
    font-size: 12px;
    opacity: 0.35;
  }

  .message {
    font-size: 12px;
    opacity: 0.9;
    line-height: 1.3;
  }
</style>