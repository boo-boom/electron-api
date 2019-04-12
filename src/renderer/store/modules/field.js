const state = {
  createFieldIndex: 0
}

const getters = {
  createFieldIndex: state => state.createFieldIndex
}

const mutations = {
  FIELD_INDEX_RESET(state) {
    state.createFieldIndex = 0
  },
  FIELD_INDEX_COUNTER(state) {
    state.createFieldIndex++
  }
}

const actions = {
  // 重置index
  fieldIndexResetTask ({ commit }) {
    // do something async
    commit('FIELD_INDEX_RESET')
  },
  createFieldIndexTask ({ commit }) {
    commit('FIELD_INDEX_COUNTER')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
