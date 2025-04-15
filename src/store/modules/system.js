import { systemAPI } from '../../services';

const state = {
  dbStatus: null,
  loading: false,
  error: null,
};

const getters = {
  dbStatus: state => state.dbStatus,
  loading: state => state.loading,
  error: state => state.error,
  isDbConnected: state => state.dbStatus && state.dbStatus.connected === true,
  isDbChecked: state => state.dbStatus !== null,
};

const actions = {
  // 檢查資料庫連接狀態
  async checkDbStatus({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await systemAPI.checkDbStatus();
      const status = response.data;

      commit('SET_DB_STATUS', status);

      return status;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '檢查資料庫狀態失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const mutations = {
  SET_DB_STATUS(state, status) {
    state.dbStatus = status;
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
