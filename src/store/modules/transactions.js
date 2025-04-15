import { transactionsAPI } from '../../services';

const state = {
  transactions: {
    bought: [],
    sold: [],
  },
  orders: {
    bought: [],
    sold: [],
  },
  transaction: null,
  order: null,
  stats: null,
  loading: false,
  error: null,
};

const getters = {
  boughtTransactions: state => state.transactions.bought,
  soldTransactions: state => state.transactions.sold,
  boughtOrders: state => state.orders.bought,
  soldOrders: state => state.orders.sold,
  transactionDetail: state => state.transaction,
  orderDetail: state => state.order,
  stats: state => state.stats,
  loading: state => state.loading,
  error: state => state.error,
};

const actions = {
  // 獲取用戶的交易記錄
  async fetchTransactions({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      // 獲取購買的交易
      const boughtResponse = await transactionsAPI.getUserTransactions(
        'bought',
      );
      const boughtTransactions = boughtResponse.data;

      // 獲取賣出的交易
      const soldResponse = await transactionsAPI.getUserTransactions('sold');
      const soldTransactions = soldResponse.data;

      commit('SET_TRANSACTIONS', {
        bought: boughtTransactions,
        sold: soldTransactions,
      });

      return { bought: boughtTransactions, sold: soldTransactions };
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取交易記錄失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取用戶的訂單記錄
  async fetchOrders({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      // 獲取購買的訂單
      const boughtResponse = await transactionsAPI.getUserOrders('bought');
      const boughtOrders = boughtResponse.data;

      // 獲取賣出的訂單
      const soldResponse = await transactionsAPI.getUserOrders('sold');
      const soldOrders = soldResponse.data;

      commit('SET_ORDERS', {
        bought: boughtOrders,
        sold: soldOrders,
      });

      return { bought: boughtOrders, sold: soldOrders };
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取訂單記錄失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取單筆交易詳情
  async fetchTransaction({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.getTransaction(id);
      const transaction = response.data;

      commit('SET_TRANSACTION', transaction);

      return transaction;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取交易詳情失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取單筆訂單詳情
  async fetchOrder({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.getOrder(id);
      const order = response.data;

      commit('SET_ORDER', order);

      return order;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取訂單詳情失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 創建交易
  async createTransaction({ commit }, transactionData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.createTransaction(transactionData);
      const newTransaction = response.data;

      // 更新交易列表
      commit('ADD_TRANSACTION', {
        transaction: newTransaction,
        type: 'bought',
      });

      return newTransaction;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '創建交易失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 確認交易
  async confirmTransaction({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.confirmTransaction(id);
      const updatedTransaction = response.data;

      // 更新交易列表
      commit('UPDATE_TRANSACTION', updatedTransaction);

      return updatedTransaction;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '確認交易失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 取消交易
  async cancelTransaction({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.cancelTransaction(id);
      const updatedTransaction = response.data;

      // 更新交易列表
      commit('UPDATE_TRANSACTION', updatedTransaction);

      return updatedTransaction;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '取消交易失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取交易統計
  async fetchTransactionStats({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await transactionsAPI.getTransactionStats();
      const stats = response.data;

      commit('SET_STATS', stats);

      return stats;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取交易統計失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const mutations = {
  SET_TRANSACTIONS(state, { bought, sold }) {
    state.transactions.bought = bought;
    state.transactions.sold = sold;
  },
  SET_ORDERS(state, { bought, sold }) {
    state.orders.bought = bought;
    state.orders.sold = sold;
  },
  SET_TRANSACTION(state, transaction) {
    state.transaction = transaction;
  },
  SET_ORDER(state, order) {
    state.order = order;
  },
  ADD_TRANSACTION(state, { transaction, type }) {
    if (type === 'bought') {
      state.transactions.bought.unshift(transaction);
    } else if (type === 'sold') {
      state.transactions.sold.unshift(transaction);
    }
  },
  UPDATE_TRANSACTION(state, transaction) {
    // 更新買入的交易
    const boughtIndex = state.transactions.bought.findIndex(
      t => t.id === transaction.id,
    );
    if (boughtIndex !== -1) {
      state.transactions.bought.splice(boughtIndex, 1, transaction);
    }

    // 更新賣出的交易
    const soldIndex = state.transactions.sold.findIndex(
      t => t.id === transaction.id,
    );
    if (soldIndex !== -1) {
      state.transactions.sold.splice(soldIndex, 1, transaction);
    }

    // 如果當前查看的是這筆交易，也更新它
    if (state.transaction && state.transaction.id === transaction.id) {
      state.transaction = transaction;
    }
  },
  SET_STATS(state, stats) {
    state.stats = stats;
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
