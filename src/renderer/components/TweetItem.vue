<template>
  <v-ons-row>
    <v-ons-col width="50px">
      <img v-bind:src="tweet.user.profile_image_url" class="image">
    </v-ons-col>
    <v-ons-col>
      <v-ons-row>
        <v-ons-col>        
          <div class="from">
            <span class="name">{{ tweet.user.name }}</span>
            <span class="id">@{{ tweet.user.screen_name }}</span>
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
      <v-ons-row v-if="tweet.extended_entities && tweet.extended_entities.media">
        <!-- TODO: Performance improvement -->
        <v-ons-col width="60px" v-for="(media, idx) in getMedia(tweet.extended_entities.media)" v-bind:key="idx">
          <a v-bind:href="media.url" target="_blank">
            <img v-bind:src="media.url_thumb" width="50px" class="image">
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
  import autolinker from 'autolinker'
  import sanitizeHtml from 'sanitize-html'
  import TweetItem from './TweetItem'

  export default {
    name: 'tweet-item',
    components: { TweetItem },
    props: [ 'tweet' ],
    methods: {
      getRelativeCreatedAt: function (createdAt) {
        if (moment().diff(createdAt, 'days') > 7) {
          return moment(createdAt).format('YYYY/MM/DD')
        } else {
          return moment(createdAt).fromNow()
        }
      },
      link: function (text) {
        // Line feed to br tag
        text = text.replace(/[\n\r]/g, '<br>')
        text = sanitizeHtml(text)
        return autolinker.link(text, {
          mention: 'twitter',
          hashtag: 'twitter'
        })
      },
      getMedia: function (media) {
        const mediaList = []
        for (var mi = 0; mi < media.length; mi++) {
          const type = media[mi].type
          if (type === 'photo') {
            mediaList.push({
              url_thumb: media[mi].media_url + ':thumb',
              url: media[mi].media_url
            })
          } else if (type === 'video' || type === 'animated_gif') {
            const variants = media[mi].video_info.variants
            for (var vi = 0; vi < variants.length; vi++) {
              // TODO: bitrate
              if (variants[vi].content_type === 'video/mp4') {
                mediaList.push({
                  url_thumb: media[mi].media_url,
                  url: variants[vi].url
                })
                break
              }
            }
          }
        }
        return mediaList
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