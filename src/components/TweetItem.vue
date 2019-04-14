<template>
  <v-ons-row>
    <v-ons-col>
      <v-ons-row>
        <v-ons-col>
          <span class="name">{{ tweet.user.name }}</span>
          <span class="id">@{{ tweet.user.screen_name }}</span>
          <span
            v-if="tweet.user.protected"
            class="protected"
          ><ons-icon icon="fa-lock" /></span>
          <span
            v-if="tweet.user.verified"
            class="verified"
          ><ons-icon icon="fa-check-circle" /></span>
          <span class="date">{{ getRelativeCreatedAt(tweet.created_at) }}</span>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col>
          <div
            class="message"
            v-html="tweet.full_text_html"
          />
        </v-ons-col>
      </v-ons-row>
      <v-ons-row v-if="tweet.media_list.length > 0">
        <v-ons-col
          v-for="(media, idx) in tweet.media_list"
          :key="idx"
          width="50px"
        >
          <a
            :href="media.url | toSSL"
            target="_blank"
          >
            <img
              :src="media.url_thumb | toSSL"
              class="list-item__thumbnail"
            >
          </a>
        </v-ons-col>
      </v-ons-row>
      <v-ons-row
        v-if="tweet.quoted_status"
        class="quoted"
      >
        <v-ons-col>
          <tweet-item :tweet="tweet.quoted_status" />
        </v-ons-col>
      </v-ons-row>
      <v-ons-row>
        <v-ons-col v-if="tweet.retweeted_user">
          <div class="retweet">
            retweeted by {{ tweet.retweeted_user }}
          </div>
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
    dd: '%dd',
  },
})

export default {
  name: 'TweetItem',
  components: { TweetItem },
  props: {
    tweet: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getRelativeCreatedAt(createdAt) {
      if (moment().diff(createdAt, 'days') > 7) {
        return moment(createdAt).format('YYYY/MM/DD')
      }
      return moment(createdAt).fromNow(true)
    },
  },
}
</script>

<style scoped>
  /* See. https://medium.com/@brockreece/scoped-styles-with-v-html-c0f6d2dc5d8e */
  .message >>> a {
    text-decoration: none;
    color: #0063ff;
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
    word-break: break-all;
  }

  .quoted {
    border: solid 1px;
    border-color: LightGrey;
    padding: 3px;
  }
</style>
