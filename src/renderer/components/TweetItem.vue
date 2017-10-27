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
      <v-ons-row v-if="mediaList.length > 0">
        <!-- TODO: Performance improvement -->
        <v-ons-col width="60px" v-for="(media, idx) in mediaList" :key="idx">
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

  export default {
    name: 'tweet-item',
    components: { TweetItem },
    props: [ 'tweet' ],
    data () {
      return {
        mediaList: []
      }
    },
    mounted: function () {
      if (this.$props.tweet.entities.urls) {
        this.getUrlMedia(this.$props.tweet.entities.urls)
      }
      if (this.$props.tweet.extended_entities && this.$props.tweet.extended_entities.media) {
        this.getMedia(this.$props.tweet.extended_entities.media)
      }
    },
    methods: {
      getRelativeCreatedAt: function (createdAt) {
        if (moment().diff(createdAt, 'days') > 7) {
          return moment(createdAt).format('YYYY/MM/DD')
        } else {
          return moment(createdAt).fromNow()
        }
      },
      getUrlMedia: function (urls) {
        urls.forEach((item) => {
          // instagram
          const shortcode = item.display_url.match(/^instagram\.com\/p\/(.*)\//)
          if (shortcode) {
            this.mediaList.push({
              url_thumb: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=t',
              url: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=l'
            })
          }

          // twipple
          const imageId = item.display_url.match(/^p\.twipple\.jp\/(.*)/)
          if (imageId) {
            this.mediaList.push({
              url_thumb: 'http://p.twipple.jp/show/thumb/' + imageId[1],
              url: 'http://p.twipple.jp/show/large/' + imageId[1]
            })
          }
        })
      },
      getMedia: function (media) {
        // Search extended entities media
        media.forEach((item) => {
          const type = item.type
          if (type === 'photo') {
            this.mediaList.push({
              url_thumb: item.media_url + ':thumb',
              url: item.media_url
            })
          } else if (type === 'video' || type === 'animated_gif') {
            const mp4 = item.video_info.variants.filter((item) => {
              return (item.content_type === 'video/mp4')
            }).sort((a, b) => {
              return (a.bitrate > b.bitrate) ? -1 : 1
            })
            if (mp4.length > 0) {
              // Get highest bitrate item
              this.mediaList.push({
                url_thumb: item.media_url,
                url: mp4[0].url
              })
            }
          }
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