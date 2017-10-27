import Twitter from 'twitter'
import storage from 'electron-json-storage-sync'
import sanitizeHtml from 'sanitize-html'
import autolinker from 'autolinker'
import { credentials, keys } from '../../../constants'

const oauthInfo = storage.get(keys.OAUTH_TOKEN)

// TODO: oauthInfo get failure
const client = new Twitter({
  consumer_key: credentials.CONSUMER_KEY,
  consumer_secret: credentials.CONSUMER_SECRET,
  access_token_key: oauthInfo.data.oauth_access_token,
  access_token_secret: oauthInfo.data.oauth_access_token_secret
})

const getDefaultParams = {
  include_entities: true,
  tweet_mode: 'extended'
}

const state = {
  timeline: [],
  mentions: [],
  favorites: []
}

const mutations = {
  ADD_TIMELINE (state, tweet) {
    state.timeline.unshift(tweet)
  },
  ADD_MENTIONS (state, tweets) {
    state.mentions = tweets
  },
  ADD_FAVORITES (state, tweets) {
    state.favorites = tweets
  }
}

const actions = {
  fetchTimeline ({ commit }) {
    let params = getDefaultParams
    if (state.timeline.length > 0) {
      params.since_id = state.timeline[0].id_str
    }
    fetchTweets('statuses/home_timeline', params)
      .then((tweets) => {
        tweets.reverse().forEach((tweet) => {
          commit('ADD_TIMELINE', parseTweet(tweet))
        })
      })
  },
  fetchMentions ({ commit }) {
    fetchTweets('statuses/mentions_timeline', getDefaultParams)
      .then((tweets) => {
        commit('ADD_MENTIONS', tweets)
      })
  },
  fetchFavorites ({ commit }) {
    fetchTweets('favorites/list', getDefaultParams)
      .then((tweets) => {
        commit('ADD_FAVORITES', tweets)
      })
  }
}

function fetchTweets (endpoint, params) {
  return new Promise((resolve, reject) => {
    client.get(endpoint, params, (err, tweets, res) => {
      if (!err) {
        resolve(tweets)
      } else {
        reject(err)
      }
    })
  })
}

function parseTweet (tweet) {
  let retw = tweet.retweeted_status
  if (retw) {
    retw.retweeted_user = tweet.user.name
    tweet = retw
  }
  tweet.full_text_html = link(tweet.full_text)
  tweet.media_list = []
  if (tweet.entities.urls) {
    Array.prototype.push.apply(tweet.media_list, getUrlMedia(tweet.entities.urls))
  }
  if (tweet.extended_entities && tweet.extended_entities.media) {
    Array.prototype.push.apply(tweet.media_list, getMedia(tweet.extended_entities.media))
  }
  if (tweet.quoted_status) {
    tweet.quoted_status = parseTweet(tweet.quoted_status)
  }
  return tweet
}

function link (text) {
  // Line feed to br tag
  text = text.replace(/[\n\r]/g, '<br>')
  text = sanitizeHtml(text)
  return autolinker.link(text, {
    mention: 'twitter',
    hashtag: 'twitter'
  })
}

function getUrlMedia (urls) {
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
}

function getMedia (media) {
  let mediaList = []
  // Search extended entities media
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

export default {
  state,
  mutations,
  actions
}
