import { setStateStorage } from "../utils";

const state = {
  authenticated: localStorage.getItem('authenticated') ? JSON.parse(localStorage.authenticated) : null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.user) : null,
  user_id: localStorage.getItem('user_id') ? JSON.parse(localStorage.user_id) : null,
  token: localStorage.getItem('token') || null,
};

const getters = {};

const actions = {
  isAuthenticated({ state }) {
    return state.authenticated && state.user && state.user_id && state.token ? true : false;
  },
  login({ commit }, { user, token, callback }) {
    commit('login', { user, token });
    if (callback) callback();
  },
  logout({ commit }, { callback }) {
    commit('logout');
    if (callback) callback();
  },
  setState({ commit }, newState) {
    Object.keys(newState).forEach(item => {
      commit('setState', { [item]: newState[item] })
    });
  }
};

const mutations = {
  setState(state, newState){
    setStateStorage(state, newState);
  },
  login(state, { user, token }) {
    setStateStorage(state, {
      authenticated: true,
      user_id: user.id,
      token,
      user,
    });
  },
  logout(state) {
    setStateStorage(state, {
      authenticated: false,
      user_id: null,
      token: null,
      user: null,
    });
    localStorage.clear();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};