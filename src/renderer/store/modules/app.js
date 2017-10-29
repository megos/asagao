const state = {
  activeIndex: 1,
  tweetItemDialogVisible: false
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
  }
}

const actions = {
  changeActiveIndex ({ commit }, index) {
    commit('CHANGE_ACTIVE_INDEX', index)
  },
  openTweetItemDialog ({ commit }) {
    commit('OPEN_TWEET_ITEM_DIALOG')
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
