import _ from 'lodash'
import Datastore from 'nedb'
import electron from 'electron'
import { TwitterClient } from '../../modules/twitter'

const datastore = new Datastore({
  filename: `${electron.remote.app.getPath('userData')}/storage/timeline.db`,
  autoload: true,
  timestampData: true,
})
datastore.ensureIndex({ fieldName: 'id_str', unique: true })
// Expire 1 day
datastore.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 60 * 60 * 24 })

const defaultGetParams = {
  include_entities: true,
  tweet_mode: 'extended',
  count: 200,
}

const state = {
  me: {},
  lists: [],
  listId: '',
  tweetedIdStr: [],
  timeline: [],
  mentions: [],
  favorites: [],
  listsStatuses: [],
}

/* eslint-disable no-param-reassign */
const mutations = {
  ADD_ME(st, me) {
    st.me = me
  },
  ADD_LISTS(st, lists) {
    st.lists = lists
  },
  SET_LIST_ID(st, listId) {
    st.listId = listId
  },
  ADD_TIMELINE(st, tweets) {
    st.timeline = tweets.concat(st.timeline)
  },
  DELETE_TWEET(st, idx) {
    st.timeline.splice(idx, 1)
  },
  ADD_TWEETED_ID_STR(st, idStr) {
    st.tweetedIdStr.push(idStr)
  },
  REMOVE_TWEETS(st) {
    st.tweetedIdStr.forEach((idStr) => {
      st.timeline.splice(st.timeline.findIndex(TwitterClient.findItem, idStr), 1)
    })
    st.tweetedIdStr = []
  },
  ADD_MENTIONS(st, tweets) {
    st.mentions = tweets.concat(st.mentions)
  },
  ADD_FAVORITES(st, tweets) {
    st.favorites = tweets.concat(st.favorites)
  },
  ADD_LISTS_STATUSES(st, tweets) {
    st.listsStatuses = tweets.concat(st.listsStatuses)
  },
  DELETE_LISTS_STATUSES(st) {
    st.listsStatuses = []
  },
  UPDATE_FAVORITED(st, { idx, favorited }) {
    st.timeline[idx].favorited = favorited
  },
  UPDATE_RETWEETED(st, { idx, retweeted }) {
    st.timeline[idx].retweeted = retweeted
  },
}
/* eslint-enable */

const actions = {
  restore({ commit }) {
    return new Promise((resolve, reject) => {
      datastore.find({}).sort({ id_str: -1 }).exec((err, docs) => {
        if (!err) {
          commit('ADD_TIMELINE', docs)
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  fetchAccount({ commit }) {
    TwitterClient.fetchAccount()
      .then((user) => {
        commit('ADD_ME', user)
      })
  },
  fetchLists({ commit }) {
    TwitterClient.fetchLists()
      .then((lists) => {
        commit('ADD_LISTS', lists)
      })
  },
  setListId({ commit }, listId) {
    commit('DELETE_LISTS_STATUSES')
    commit('SET_LIST_ID', listId)
  },
  fetchTimeline({ commit }) {
    commit('REMOVE_TWEETS')
    const params = _.cloneDeep(defaultGetParams)
    if (state.timeline.length > 0) {
      params.since_id = state.timeline[0].id_str
    }
    TwitterClient.fetchTweets('statuses/home_timeline', params)
      .then((tweets) => {
        if (tweets.length > 0) {
          datastore.insert(tweets)
          commit('ADD_TIMELINE', tweets)
        }
      })
  },
  addTimeline({ commit }, tweet) {
    commit('ADD_TIMELINE', [TwitterClient.parseTweet(tweet)])
    commit('ADD_TWEETED_ID_STR', tweet.id_str)
  },
  remoteTweets({ commit }) {
    commit('REMOVE_TWEETS')
  },
  deleteTweet({ commit }, idStr) {
    commit('DELETE_TWEET', state.timeline.findIndex(TwitterClient.findItem, idStr))
  },
  fetchMentions({ commit }) {
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
  fetchFavorites({ commit }) {
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
  fetchListsStatuses({ commit }) {
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
  updateFavorited({ commit }, { idStr, favorited }) {
    commit('UPDATE_FAVORITED', {
      idx: state.timeline.findIndex(TwitterClient.findItem, idStr),
      favorited,
    })
  },
  updateRetweeted({ commit }, { idStr, retweeted }) {
    commit('UPDATE_RETWEETED', {
      idx: state.timeline.findIndex(TwitterClient.findItem, idStr),
      retweeted,
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
