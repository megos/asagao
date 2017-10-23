import Twitter from 'twitter'
import config from 'config'
import storage from 'electron-json-storage-sync'

const OAUTH_TOKEN_KEY = 'oauthToken'

const oauthInfo = storage.get(OAUTH_TOKEN_KEY)

const client = new Twitter({
  consumer_key: config.get('consumerKey'),
  consumer_secret: config.get('consumerSecret'),
  access_token_key: oauthInfo.data.oauth_access_token,
  access_token_secret: oauthInfo.data.oauth_access_token_secret
})

const params = {
  include_entities: true,
  tweet_mode: 'extended'
}

const state = {
  timeline: [],
  mentions: [],
  favorites: []
}

const mutations = {
  ADD_TIMELINE (state, tweets) {
    state.timeline = tweets
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
    fetchTweets('statuses/home_timeline')
      .then((tweets) => {
        commit('ADD_TIMELINE', tweets)
      })
  },
  fetchMentions ({ commit }) {
    fetchTweets('statuses/mentions_timeline')
      .then((tweets) => {
        commit('ADD_MENTIONS', tweets)
      })
  },
  fetchFavorites ({ commit }) {
    fetchTweets('favorites/list')
      .then((tweets) => {
        commit('ADD_FAVORITES', tweets)
      })
  }
}

function fetchTweets (endpoint) {
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

export default {
  state,
  mutations,
  actions
}
