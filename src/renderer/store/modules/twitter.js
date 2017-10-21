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
  timeline: []
}

const mutations = {
  FETCH_TIMELINE (state, tweets) {
    state.timeline = tweets
  }
}

const actions = {
  fetchTimeline ({ commit }) {
    // do something async
    client.get('statuses/home_timeline', params, (err, tweets, res) => {
      if (!err) {
        commit('FETCH_TIMELINE', tweets)
      } else {
        throw err
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
