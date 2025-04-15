import { authAPI } from '../../services';
import router from '../../router';

// 從localStorage獲取token
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const state = {
  token: token || null,
  user: user || null,
  loading: false,
  error: null,
};

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  token: state => state.token,
  loading: state => state.loading,
  error: state => state.error,
};

const actions = {
  // 登入
  async login({ commit }, credentials) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      // 保存到localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 更新state
      commit('SET_TOKEN', token);
      commit('SET_USER', user);

      return user;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '登入失敗，請檢查您的憑證';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 註冊
  async register({ commit }, userData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '註冊失敗，請稍後再試';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 登出
  logout({ commit }) {
    // 清除localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 更新state
    commit('SET_TOKEN', null);
    commit('SET_USER', null);

    // 重定向到登入頁面
    router.push('/login');
  },

  // 獲取當前用戶信息
  async fetchCurrentUser({ commit }) {
    commit('SET_LOADING', true);

    try {
      const response = await authAPI.getCurrentUser();
      const user = response.data;

      // 更新localStorage和state
      localStorage.setItem('user', JSON.stringify(user));
      commit('SET_USER', user);

      return user;
    } catch (error) {
      console.error('獲取用戶信息失敗:', error);

      // 如果是401錯誤，清除認證信息
      if (error.response && error.response.status === 401) {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 更新用戶資料
  async updateProfile({ commit, state }, profileData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data;

      // 更新localStorage和state
      const newUser = { ...state.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      commit('SET_USER', newUser);

      return updatedUser;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '更新資料失敗，請稍後再試';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 修改密碼
  async changePassword({ commit }, passwordData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '修改密碼失敗，請稍後再試';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
