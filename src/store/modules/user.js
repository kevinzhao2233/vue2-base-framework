import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
