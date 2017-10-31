const state = {
  activeIndex: 1,
  tweetItemDialogVisible: false,
  favorited: false
}

const mutations = {
  CHANGE_ACTIVE_INDEX (state, index) {
    state.activeIndex = index
  },
  OPEN_TWEET_ITEM_DIALOG (state) {
    state.tweetItemDialogVisible = true
  },
  CLOSE_TWEET_ITEM_DIALOG (state) {
    state.tweetItemDialogVisible = false
  },
  SET_FAVORITED (state, favorited) {
    state.favorited = favorited
  }
}

const actions = {
  changeActiveIndex ({ commit }, index) {
    commit('CHANGE_ACTIVE_INDEX', index)
  },
  openTweetItemDialog ({ commit }, favorited) {
    commit('OPEN_TWEET_ITEM_DIALOG')
    commit('SET_FAVORITED', favorited)
  },
  closeTweetItemDialog ({ commit }) {
    commit('CLOSE_TWEET_ITEM_DIALOG')
  }
}

export default {
  state,
  mutations,
  actions
}
