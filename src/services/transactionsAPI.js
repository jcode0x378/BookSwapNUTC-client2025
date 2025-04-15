import api from './api';

const transactionsAPI = {
  // 獲取用戶的交易記錄
  getUserTransactions: (type = 'all') =>
    api.get('/transactions', { params: { type } }),

  // 獲取用戶的訂單記錄
  getUserOrders: (type = 'all') => api.get('/orders', { params: { type } }),

  // 獲取單筆交易詳情
  getTransaction: id => api.get(`/transactions/${id}`),

  // 獲取單筆訂單詳情
  getOrder: id => api.get(`/orders/${id}`),

  // 創建交易
  createTransaction: transactionData =>
    api.post('/transactions', transactionData),

  // 更新交易狀態
  updateTransactionStatus: (id, status) =>
    api.put(`/transactions/${id}/status`, { status }),

  // 確認交易
  confirmTransaction: id => api.put(`/transactions/${id}/confirm`),

  // 取消交易
  cancelTransaction: id => api.put(`/transactions/${id}/cancel`),

  // 獲取交易統計
  getTransactionStats: () => api.get('/transactions/stats'),
};

export default transactionsAPI;
