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
          tweet.full_text_html = link(tweet.full_text)
          commit('ADD_TIMELINE', tweet)
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

function link (text) {
  // Line feed to br tag
  text = text.replace(/[\n\r]/g, '<br>')
  text = sanitizeHtml(text)
  return autolinker.link(text, {
    mention: 'twitter',
    hashtag: 'twitter'
  })
}

export default {
  state,
  mutations,
  actions
}
