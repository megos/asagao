<template>
  <v-ons-row>
    <v-ons-col width="50px">
      <img :src="tweet.user.profile_image_url" class="image">
    </v-ons-col>
    <v-ons-col>
      <v-ons-row>
        <v-ons-col width="70%">
          <div class="from">
            <span class="name">{{ tweet.user.name }}</span>
            <span class="id">@{{ tweet.user.screen_name }}</span>
            <span v-if="tweet.user.protected" class="protected"><ons-icon icon="fa-lock"></ons-icon></span>
            <span v-if="tweet.user.verified" class="verified"><ons-icon icon="fa-check-circle"></ons-icon></span>
          </div>
        </v-ons-col>
        <v-ons-col width="30%">
          <div class="date">{{ getRelativeCreatedAt(tweet.created_at) }}</div>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col>
          <div v-html="tweet.full_text_html" class="message"></div>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row v-if="tweet.media_list.length > 0">
        <v-ons-col width="60px" v-for="(media, idx) in tweet.media_list" :key="idx">
          <a :href="media.url" target="_blank">
            <img :src="media.url_thumb" width="50px" class="image">
          </a>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row v-if="tweet.quoted_status" class="quoted">
        <v-ons-col>
          <tweet-item :tweet="tweet.quoted_status"></tweet-item>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col v-if="tweet.retweeted_user">
          <div class="retweet">retweeted by {{ tweet.retweeted_user }}</div>
        </v-ons-col>
      </v-ons-row>
    </v-ons-col>
  </v-ons-row>
</template>

<script>
  import moment from 'moment'
  import TweetItem from './TweetItem'

  moment.updateLocale('en', {
    relativeTime: {
      s: 'now',
      ss: '%ds',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd'
    }
  })

  export default {
    name: 'tweet-item',
    components: { TweetItem },
    props: [ 'tweet' ],
    methods: {
      getRelativeCreatedAt: function (createdAt) {
        if (moment().diff(createdAt, 'days') > 7) {
          return moment(createdAt).format('YYYY/MM/DD')
        } else {
          return moment(createdAt).fromNow(true)
        }
      }
    }
  }
</script>

<style scoped>
  .image {
    border-radius: 5px;
  }

  .from {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .name {
    font-size: 12px;
    font-weight: 500;
  }

  .id, .retweet {
    font-size: 11px;
    color: gray;
    font-weight: 500;
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

  .quoted {
    border: solid 1px;
    border-color: LightGrey;
  }
</style>