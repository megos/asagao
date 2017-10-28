import Twitter from 'twitter'
import storage from 'electron-json-storage-sync'
import { credentials, keys } from '../../../constants'
import { twitterClient } from '../../modules/twitter'

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
  tweet_mode: 'extended',
  count: 200
}

const state = {
  timeline: [],
  mentions: [],
  favorites: []
}

const mutations = {
  ADD_TIMELINE (state, tweets) {
    state.timeline = tweets.concat(state.timeline)
  },
  ADD_MENTIONS (state, tweets) {
    state.mentions = tweets.concat(state.mentions)
  },
  ADD_FAVORITES (state, tweets) {
    state.favorites = tweets.concat(state.favorites)
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
        if (tweets.length > 0) {
          commit('ADD_TIMELINE', tweets)
        }
      })
  },
  fetchMentions ({ commit }) {
    fetchTweets('statuses/mentions_timeline', getDefaultParams)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_MENTIONS', tweets)
        }
      })
  },
  fetchFavorites ({ commit }) {
    fetchTweets('favorites/list', getDefaultParams)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_FAVORITES', tweets)
        }
      })
  }
}

function fetchTweets (endpoint, params) {
  return new Promise((resolve, reject) => {
    client.get(endpoint, params, (err, tweets, res) => {
      if (!err) {
        let extendedTweets = []
        tweets.forEach((tweet) => {
          extendedTweets.push(parseTweet(tweet))
        })
        resolve(extendedTweets)
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
  return {
    id_str: tweet.id_str,
    full_text_html: twitterClient.toHtml(tweet.full_text),
    created_at: tweet.created_at,
    quoted_status: tweet.quoted_status,
    retweeted_user: tweet.retweeted_user,
    media_list: tweet.media_list,
    user: {
      profile_image_url: tweet.user.profile_image_url,
      name: tweet.user.name,
      screen_name: tweet.user.screen_name,
      protected: tweet.user.protected,
      verified: tweet.user.verified
    }
  }
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
