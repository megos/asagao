import Twitter from 'twitter'
import storage from 'electron-json-storage-sync'
import sanitizeHtml from 'sanitize-html'
import autolinker from 'autolinker'
import log4js from 'log4js'
import { credentials, keys } from '../constants'

const oauthInfo = storage.get(keys.OAUTH_TOKEN)
const logger = log4js.getLogger()

// TODO: oauthInfo get failure
const client = new Twitter({
  consumer_key: credentials.CONSUMER_KEY,
  consumer_secret: credentials.CONSUMER_SECRET,
  access_token_key: oauthInfo.data.oauth_access_token,
  access_token_secret: oauthInfo.data.oauth_access_token_secret,
})

export default {

  /**
   * Fetch account
   */
  fetchAccount() {
    return new Promise((resolve, reject) => {
      client.get('account/verify_credentials', (err, user) => {
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
   * Fetch list
   */
  fetchLists() {
    return new Promise((resolve, reject) => {
      this.get('lists/list')
        .then((res) => {
          const lists = [{
            id_str: '',
            full_text: '',
          }]
          res.forEach((item) => {
            lists.push(this.parseListItem(item))
          })
          resolve(lists)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  /**
   * Fetch tweets
   * @param {string} endpoint
   * @param {Object} params
   */
  fetchTweets(endpoint, params) {
    return new Promise((resolve, reject) => {
      logger.info(`Fetch start ${endpoint}`)
      client.get(endpoint, params, (err, tweets) => {
        if (!err) {
          const extendedTweets = []
          tweets.forEach((tweet) => {
            extendedTweets.push(this.parseTweet(tweet))
          })
          logger.info(`Fetch tweets from ${endpoint} count: ${tweets.length}`)
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
   * @param {string} status tweet
   * @param {string} replyScreenName
   * @param {string} inReplyToStatusId
   */
  postTweet(status, replyScreenName, inReplyToStatusId) {
    const params = {}
    params.status = status
    if (inReplyToStatusId !== '' && (status.indexOf(`@${replyScreenName}`) !== -1)) {
      params.in_reply_to_status_id = inReplyToStatusId
    }
    return this.post('statuses/update', params)
  },

  /**
   * Delete tweet
   * @param {string} id
   */
  deleteTweet(id) {
    return this.post('statuses/destroy', {
      id,
    })
  },
  /**
   * Retweet
   * @param {string} id
   */
  retweet(id) {
    return this.post('statuses/retweet', {
      id,
    })
  },

  /**
   * UnRetweet
   * @param {string} id
   */
  unretweet(id) {
    return this.post('statuses/unretweet', {
      id,
    })
  },

  /**
   * Add favorite
   * @param {string} id
   */
  createFavorite(id) {
    return this.post('favorites/create', {
      id,
    })
  },

  /**
   * Remove favorite
   * @param {string} id
   */
  destroyFavorite(id) {
    return this.post('favorites/destroy', {
      id,
    })
  },

  /**
   * get
   * @param {string} url
   * @param {Object} params
   */
  get(url, params) {
    return new Promise((resolve, reject) => {
      if (params == null) {
        client.get(url, (err, items) => {
          if (!err) {
            resolve(items)
          } else {
            logger.error(err)
            reject(err)
          }
        })
      } else {
        client.get(url, params, (err, items) => {
          if (!err) {
            resolve(items)
          } else {
            logger.error(err)
            reject(err)
          }
        })
      }
    })
  },

  /**
   * post
   * @param {string} url
   * @param {Object} params
   */
  post(url, params) {
    return new Promise((resolve, reject) => {
      client.post(url, params, (err, tweet) => {
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
  parseTweet(tweet) {
    const retw = tweet.retweeted_status
    if (retw) {
      retw.id_str = tweet.id_str
      retw.retweeted_user = tweet.user.name
      tweet = retw
    }
    let html = this.toHtml(tweet.full_text || tweet.text)
    tweet.media_list = []
    if (tweet.entities.urls) {
      html = this.convertURLs(html, tweet.entities.urls)
      Array.prototype.push.apply(tweet.media_list, this.getUrlMedia(tweet.entities.urls))
    }
    if (tweet.extended_entities && tweet.extended_entities.media) {
      html = this.convertURLs(html, tweet.extended_entities.media)
      Array.prototype.push.apply(tweet.media_list, this.getMedia(tweet.extended_entities.media))
    }
    if (tweet.quoted_status) {
      tweet.quoted_status = this.parseTweet(tweet.quoted_status)
    }
    return {
      id_str: tweet.id_str,
      full_text_html: html,
      created_at: tweet.created_at,
      quoted_status: tweet.quoted_status,
      retweeted_user: tweet.retweeted_user,
      favorited: tweet.favorited,
      retweeted: tweet.retweeted,
      media_list: tweet.media_list,
      user: {
        profile_image_url: tweet.user.profile_image_url_https.replace(/_normal/, ''),
        name: tweet.user.name,
        screen_name: tweet.user.screen_name,
        protected: tweet.user.protected,
        verified: tweet.user.verified,
      },
    }
  },

  /**
   * Line feed to br tag and sanitize html
   * @param {string} text
   */
  toHtml(text) {
    text = text.replace(/[\n\r]/g, '<br>')
    text = sanitizeHtml(text)
    return autolinker.link(text, {
      mention: 'twitter',
      hashtag: 'twitter',
    })
  },

  /**
   * Convert short URL to Real URL
   * @param {string} text tweet
   * @param {Object} urls
   */
  convertURLs(text, urls) {
    for (let ui = 0; ui < urls.length; ui++) {
      text = text.replace(`>${urls[ui].url.replace(/http(|s):\/\//, '')}`, `>${urls[ui].display_url}`)
    }
    return text
  },

  /**
   * Get image or video urls
   * @param {Object} urls
   */
  getUrlMedia(urls) {
    const mediaList = []
    urls.forEach((item) => {
      // instagram
      const shortcode = item.display_url.match(/^instagram\.com\/p\/(.*)\//)
      if (shortcode) {
        mediaList.push({
          url_thumb: `https://instagram.com/p/${shortcode[1]}/media/?size=t`,
          url: `https://instagram.com/p/${shortcode[1]}/media/?size=l`,
        })
      }
      // pixiv
      const illustId = item.expanded_url.match(/.*pixiv\.net.*illust_id=([0-9]+).*/)
      if (illustId) {
        const pixivUrl = `https://embed.pixiv.net/decorate.php?illust_id=${illustId[1]}`
        mediaList.push({
          url_thumb: pixivUrl,
          url: pixivUrl,
        })
      }
    })
    return mediaList
  },

  /**
   * Search extended entities media
   * @param {Object} media
   */
  getMedia(media) {
    const mediaList = []
    media.forEach((item) => {
      const { type } = item
      if (type === 'photo') {
        mediaList.push({
          url_thumb: `${item.media_url}:thumb`,
          url: item.media_url,
        })
      } else if (type === 'video' || type === 'animated_gif') {
        const mp4 = item.video_info.variants.filter(item => (item.content_type === 'video/mp4')).sort((a, b) => ((a.bitrate > b.bitrate) ? -1 : 1))
        if (mp4.length > 0) {
          // Get highest bitrate item
          mediaList.push({
            url_thumb: item.media_url,
            // Remove '?tag=3'
            url: mp4[0].url.replace(/\?.*/, ''),
          })
        }
      }
    })
    return mediaList
  },

  /**
   * Find tweet item for Array.prototype.find
   * @param {Object} tweet
   */
  findItem(tweet) {
    return tweet.id_str === this
  },

  /**
   * list object covert to this client object
   * @param {Object} item
   */
  parseListItem(item) {
    return {
      id_str: item.id_str,
      full_name: item.full_name,
    }
  },
}
