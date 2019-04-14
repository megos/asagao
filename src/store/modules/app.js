const state = {
  activeIndex: 1,
  tweetItemDialogVisible: false,
  idStr: '',
  screenName: '',
  favorited: false,
  retweeted: false,
}

const mutations = {
  CHANGE_ACTIVE_INDEX(state, index) {
    state.activeIndex = index
  },
  OPEN_TWEET_ITEM_DIALOG(state) {
    state.tweetItemDialogVisible = true
  },
  CLOSE_TWEET_ITEM_DIALOG(state) {
    state.tweetItemDialogVisible = false
  },
  SET_ID_STR(state, idStr) {
    state.idStr = idStr
  },
  SET_SCREEN_NAME(state, screenName) {
    state.screenName = screenName
  },
  SET_FAVORITED(state, favorited) {
    state.favorited = favorited
  },
  SET_RETWEETED(state, retweeted) {
    state.retweeted = retweeted
  },
}

const actions = {
  changeActiveIndex({ commit }, index) {
    commit('CHANGE_ACTIVE_INDEX', index)
  },
  openTweetItemDialog({ commit }, {
    idStr, screenName, favorited, retweeted,
  }) {
    commit('OPEN_TWEET_ITEM_DIALOG')
    commit('SET_ID_STR', idStr)
    commit('SET_SCREEN_NAME', screenName)
    commit('SET_FAVORITED', favorited)
    commit('SET_RETWEETED', retweeted)
  },
  closeTweetItemDialog({ commit }) {
    commit('CLOSE_TWEET_ITEM_DIALOG')
  },
  removeSelectedItem({ commit }) {
    if (state.activeIndex !== 0) {
      commit('SET_SCREEN_NAME', '')
      commit('SET_ID_STR', '')
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
