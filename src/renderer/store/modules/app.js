const state = {
  activeIndex: 1,
  tweetItemDialogVisible: false,
  idStr: '',
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
  SET_ID_STR (state, idStr) {
    state.idStr = idStr
  },
  SET_FAVORITED (state, favorited) {
    state.favorited = favorited
  }
}

const actions = {
  changeActiveIndex ({ commit }, index) {
    commit('CHANGE_ACTIVE_INDEX', index)
  },
  openTweetItemDialog ({ commit }, {idStr, favorited}) {
    commit('OPEN_TWEET_ITEM_DIALOG')
    commit('SET_ID_STR', idStr)
    commit('SET_FAVORITED', favorited)
  },
  closeTweetItemDialog ({ commit }) {
    commit('CLOSE_TWEET_ITEM_DIALOG')
    commit('SET_ID_STR', '')
  }
}

export default {
  state,
  mutations,
  actions
}
