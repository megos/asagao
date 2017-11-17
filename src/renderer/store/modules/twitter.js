import _ from 'lodash'
import { TwitterClient } from '../../modules/twitter'

const defaultGetParams = {
  include_entities: true,
  tweet_mode: 'extended',
  count: 200
}

const state = {
  me: {},
  timeline: [],
  mentions: [],
  favorites: []
}

const mutations = {
  ADD_ME (state, me) {
    state.me = me
  },
  ADD_TIMELINE (state, tweets) {
    state.timeline = tweets.concat(state.timeline)
  },
  DELETE_TWEET (state, idx) {
    state.timeline.splice(idx, 1)
  },
  ADD_MENTIONS (state, tweets) {
    state.mentions = tweets.concat(state.mentions)
  },
  ADD_FAVORITES (state, tweets) {
    state.favorites = tweets.concat(state.favorites)
  },
  UPDATE_FAVORITE (state, {idx, favorited}) {
    state.timeline[idx].favorited = favorited
  }
}

const actions = {
  fetchAccount ({ commit }) {
    TwitterClient.fetchAccount()
      .then((user) => {
        commit('ADD_ME', user)
      })
  },
  fetchTimeline ({ commit }) {
    const params = _.cloneDeep(defaultGetParams)
    if (state.timeline.length > 0) {
      params.since_id = state.timeline[0].id_str
    }
    TwitterClient.fetchTweets('statuses/home_timeline', params)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_TIMELINE', tweets)
        }
      })
  },
  addTimeline ({ commit }, tweet) {
    commit('ADD_TIMELINE', [TwitterClient.parseTweet(tweet)])
  },
  deleteTweet ({ commit }, idStr) {
    commit('DELETE_TWEET', state.timeline.findIndex(TwitterClient.findItem, idStr))
  },
  fetchMentions ({ commit }) {
    const params = _.cloneDeep(defaultGetParams)
    if (state.mentions.length > 0) {
      params.since_id = state.mentions[0].id_str
    }
    TwitterClient.fetchTweets('statuses/mentions_timeline', params)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_MENTIONS', tweets)
        }
      })
  },
  fetchFavorites ({ commit }) {
    const params = _.cloneDeep(defaultGetParams)
    if (state.favorites.length > 0) {
      params.since_id = state.favorites[0].id_str
    }
    TwitterClient.fetchTweets('favorites/list', params)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_FAVORITES', tweets)
        }
      })
  },
  updateFavorite ({ commit }, {idStr, favorited}) {
    commit('UPDATE_FAVORITE', {
      idx: state.timeline.findIndex(TwitterClient.findItem, idStr),
      favorited: favorited
    })
  }

}

export default {
  state,
  mutations,
  actions
}
