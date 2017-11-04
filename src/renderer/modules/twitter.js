import Twitter from 'twitter'
import storage from 'electron-json-storage-sync'
import sanitizeHtml from 'sanitize-html'
import autolinker from 'autolinker'
import log4js from 'log4js'
import { credentials, keys } from '../../constants'

const oauthInfo = storage.get(keys.OAUTH_TOKEN)
const logger = log4js.getLogger()

// TODO: oauthInfo get failure
const client = new Twitter({
  consumer_key: credentials.CONSUMER_KEY,
  consumer_secret: credentials.CONSUMER_SECRET,
  access_token_key: oauthInfo.data.oauth_access_token,
  access_token_secret: oauthInfo.data.oauth_access_token_secret
})

export const TwitterClient = {

  /**
   * Fetch account
   */
  fetchAccount () {
    return new Promise((resolve, reject) => {
      client.get('account/verify_credentials', (err, user, res) => {
        if (!err) {
          resolve(user)
        } else {
          logger.error(err)
          reject(err)
        }
      })
    })
  },

  /**
   * Fetch tweets
   * @param {string} endpoint
   * @param {Object} params
   */
  fetchTweets (endpoint, params) {
    return new Promise((resolve, reject) => {
      logger.info('Fetch start ' + endpoint)
      client.get(endpoint, params, (err, tweets, res) => {
        if (!err) {
          let extendedTweets = []
          tweets.forEach((tweet) => {
            extendedTweets.push(this.parseTweet(tweet))
          })
          logger.info('Fetch tweets from ' + endpoint + ' count: ' + tweets.length)
          resolve(extendedTweets)
        } else {
          logger.error(err)
          reject(err)
        }
      })
    })
  },

  /**
   * Post new tweet
   * @param {string} status
   */
  postTweet (status) {
    return this.post('statuses/update', {
      status: status
    })
  },

  /**
   * Delete tweet
   * @param {string} id
   */
  deleteTweet (id) {
    return this.post('statuses/destroy', {
      id: id
    })
  },

  /**
   * Add favorite
   * @param {string} id
   */
  createFavorite (id) {
    return this.post('favorites/create', {
      id: id
    })
  },

  /**
   * Remove favorite
   * @param {string} id
   */
  destroyFavorite (id) {
    return this.post('favorites/destroy', {
      id: id
    })
  },

  /**
   * post
   * @param {string} url
   * @param {Object} params
   */
  post (url, params) {
    return new Promise((resolve, reject) => {
      client.post(url, params, (err, tweet, res) => {
        if (!err) {
          resolve(tweet)
        } else {
          logger.error(err)
          reject(err)
        }
      })
    })
  },

  /**
   * Tweet object covert to this client object
   * @param {Object} tweet
   */
  parseTweet (tweet) {
    let retw = tweet.retweeted_status
    if (retw) {
      retw.retweeted_user = tweet.user.name
      tweet = retw
    }
    tweet.media_list = []
    if (tweet.entities.urls) {
      Array.prototype.push.apply(tweet.media_list, this.getUrlMedia(tweet.entities.urls))
    }
    if (tweet.extended_entities && tweet.extended_entities.media) {
      Array.prototype.push.apply(tweet.media_list, this.getMedia(tweet.extended_entities.media))
    }
    if (tweet.quoted_status) {
      tweet.quoted_status = this.parseTweet(tweet.quoted_status)
    }
    return {
      id_str: tweet.id_str,
      full_text_html: this.toHtml(tweet.full_text),
      created_at: tweet.created_at,
      quoted_status: tweet.quoted_status,
      retweeted_user: tweet.retweeted_user,
      favorited: tweet.favorited,
      media_list: tweet.media_list,
      user: {
        profile_image_url: tweet.user.profile_image_url,
        name: tweet.user.name,
        screen_name: tweet.user.screen_name,
        protected: tweet.user.protected,
        verified: tweet.user.verified
      }
    }
  },

  /**
   * Line feed to br tag and sanitize html
   * @param {string} text
   */
  toHtml (text) {
    text = text.replace(/[\n\r]/g, '<br>')
    text = sanitizeHtml(text)
    return autolinker.link(text, {
      mention: 'twitter',
      hashtag: 'twitter'
    })
  },

  /**
   * Get image or video urls
   * @param {Object} urls
   */
  getUrlMedia (urls) {
    let mediaList = []
    urls.forEach((item) => {
      // instagram
      const shortcode = item.display_url.match(/^instagram\.com\/p\/(.*)\//)
      if (shortcode) {
        mediaList.push({
          url_thumb: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=t',
          url: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=l'
        })
      }

      // twipple
      const imageId = item.display_url.match(/^p\.twipple\.jp\/(.*)/)
      if (imageId) {
        mediaList.push({
          url_thumb: 'http://p.twipple.jp/show/thumb/' + imageId[1],
          url: 'http://p.twipple.jp/show/large/' + imageId[1]
        })
      }
    })
    return mediaList
  },

  /**
   * Search extended entities media
   * @param {Object} media
   */
  getMedia (media) {
    let mediaList = []
    media.forEach((item) => {
      const type = item.type
      if (type === 'photo') {
        mediaList.push({
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
          mediaList.push({
            url_thumb: item.media_url,
            url: mp4[0].url
          })
        }
      }
    })
    return mediaList
  }
}
