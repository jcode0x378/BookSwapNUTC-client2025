const state = {
  user: null,
  showLogin: false,
  authToken: null,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_SHOW_LOGIN(state, show) {
    state.showLogin = show;
  },
  SET_AUTH_TOKEN(state, token) {
    state.authToken = token;
  },
};

const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  setShowLogin({ commit }, show) {
    commit('SET_SHOW_LOGIN', show);
  },
  setAuthToken({ commit }, token) {
    commit('SET_AUTH_TOKEN', token);
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },
  logout({ commit }) {
    commit('SET_USER', null);
    commit('SET_AUTH_TOKEN', null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  },
};

const getters = {
  getUser: state => state.user,
  getShowLogin: state => state.showLogin,
  getAuthToken: state => state.authToken,
  isAuthenticated: state => !!state.user,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
