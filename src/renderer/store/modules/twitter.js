import _ from 'lodash'
import { TwitterClient } from '../../modules/twitter'

const defaultGetParams = {
  include_entities: true,
  tweet_mode: 'extended',
  count: 200
}

const state = {
  me: {},
  lists: [],
  listId: '',
  tweetedIdStr: [],
  timeline: [],
  mentions: [],
  favorites: [],
  listsStatuses: []
}

const mutations = {
  ADD_ME (state, me) {
    state.me = me
  },
  ADD_LISTS (state, lists) {
    state.lists = lists
  },
  ADD_TIMELINE (state, tweets) {
    state.timeline = tweets.concat(state.timeline)
  },
  DELETE_TWEET (state, idx) {
    state.timeline.splice(idx, 1)
  },
  ADD_TWEETED_ID_STR (state, idStr) {
    state.tweetedIdStr.push(idStr)
  },
  REMOVE_TWEETS (state) {
    state.tweetedIdStr.forEach((idStr) => {
      state.timeline.splice(state.timeline.findIndex(TwitterClient.findItem, idStr), 1)
    })
    state.tweetedIdStr = []
  },
  ADD_MENTIONS (state, tweets) {
    state.mentions = tweets.concat(state.mentions)
  },
  ADD_FAVORITES (state, tweets) {
    state.favorites = tweets.concat(state.favorites)
  },
  ADD_LISTS_STATUSES (state, tweets) {
    state.listsStatuses = tweets.concat(state.listsStatuses)
  },
  UPDATE_FAVORITED (state, {idx, favorited}) {
    state.timeline[idx].favorited = favorited
  },
  UPDATE_RETWEETED (state, {idx, retweeted}) {
    state.timeline[idx].retweeted = retweeted
  }
}

const actions = {
  fetchAccount ({ commit }) {
    TwitterClient.fetchAccount()
      .then((user) => {
        commit('ADD_ME', user)
      })
  },
  fetchLists ({ commit }) {
    TwitterClient.fetchLists()
      .then((lists) => {
        commit('ADD_LISTS', lists)
      })
  },
  fetchTimeline ({ commit }) {
    commit('REMOVE_TWEETS')
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
    commit('ADD_TWEETED_ID_STR', tweet.id_str)
  },
  remoteTweets ({ commit }) {
    commit('REMOVE_TWEETS')
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
  fetchListsStatuses ({ commit }) {
    const params = _.cloneDeep(defaultGetParams)
    if (state.listsStatuses.length > 0) {
      params.since_id = state.listsStatuses[0].id_str
    }
    params.list_id = state.listId
    TwitterClient.fetchTweets('lists/statuses', params)
      .then((tweets) => {
        if (tweets.length > 0) {
          commit('ADD_LISTS_STATUSES', tweets)
        }
      })
  },
  updateFavorited ({ commit }, {idStr, favorited}) {
    commit('UPDATE_FAVORITED', {
      idx: state.timeline.findIndex(TwitterClient.findItem, idStr),
      favorited: favorited
    })
  },
  updateRetweeted ({ commit }, {idStr, retweeted}) {
    commit('UPDATE_RETWEETED', {
      idx: state.timeline.findIndex(TwitterClient.findItem, idStr),
      retweeted: retweeted
    })
  }
}

export default {
  state,
  mutations,
  actions
}
