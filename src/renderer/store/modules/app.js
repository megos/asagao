const state = {
  activeIndex: 1
}

const mutations = {
  CHANGE_ACTIVE_INDEX (state, index) {
    state.activeIndex = index
  }
}

const actions = {
  changeActiveIndex ({ commit }, index) {
    commit('CHANGE_ACTIVE_INDEX', index)
  }
}

export default {
  state,
  mutations,
  actions
}
