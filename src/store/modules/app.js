const state = {
  activeIndex: 1,
  tweetItemDialogVisible: false,
  idStr: '',
  screenName: '',
  favorited: false,
  retweeted: false,
}

/* eslint-disable no-param-reassign */
const mutations = {
  CHANGE_ACTIVE_INDEX(st, index) {
    st.activeIndex = index
  },
  OPEN_TWEET_ITEM_DIALOG(st) {
    st.tweetItemDialogVisible = true
  },
  CLOSE_TWEET_ITEM_DIALOG(st) {
    st.tweetItemDialogVisible = false
  },
  SET_ID_STR(st, idStr) {
    st.idStr = idStr
  },
  SET_SCREEN_NAME(st, screenName) {
    st.screenName = screenName
  },
  SET_FAVORITED(st, favorited) {
    st.favorited = favorited
  },
  SET_RETWEETED(st, retweeted) {
    st.retweeted = retweeted
  },
}
/* eslint-enable */

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
