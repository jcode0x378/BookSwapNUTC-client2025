import axios from 'axios';
import store from '../store';

// 創建axios實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 請求攔截器
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method.toUpperCase(), config.url);

    // 從store獲取token
    const token = store.getters['auth/token'];

    // 如果有token，添加到請求頭
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// 響應攔截器
api.interceptors.response.use(
  response => {
    console.log('API Response Status:', response.status);
    return response;
  },
  error => {
    console.error('API Response Error:', error);
    console.error('Error Details:', error.response?.data);

    // 處理401錯誤（未授權）
    if (error.response && error.response.status === 401) {
      // 清除token並重定向到登入頁面
      store.dispatch('auth/logout');
      window.location.href = '/login';
    }

    // 處理其他錯誤
    const errorMessage =
      error.response?.data?.message || '發生錯誤，請稍後再試';
    console.error('API錯誤:', errorMessage);

    return Promise.reject(error);
  },
);

// 用戶相關 API
export const authAPI = {
  // 登入
  login: credentials => api.post('/auth/login', credentials),

  // 註冊
  register: userData => api.post('/auth/register', userData),

  // 獲取當前用戶信息
  getCurrentUser: () => api.get('/auth/me'),

  // 登出
  logout: () => api.post('/auth/logout'),
};

// 書籍相關 API
export const booksAPI = {
  // 獲取所有書籍
  getAllBooks: () => api.get('/books'),

  // 獲取特定書籍
  getBook: id => api.get(`/books/${id}`),

  // 創建新書籍
  createBook: bookData => api.post('/books', bookData),

  // 更新書籍
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),

  // 刪除書籍
  deleteBook: id => api.delete(`/books/${id}`),
};

// 交易相關 API
export const transactionsAPI = {
  // 獲取用戶的交易
  getUserTransactions: () => api.get('/transactions'),

  // 獲取特定交易
  getTransaction: id => api.get(`/transactions/${id}`),

  // 創建交易
  createTransaction: transactionData =>
    api.post('/transactions', transactionData),

  // 更新交易狀態
  updateTransactionStatus: (id, status) =>
    api.put(`/transactions/${id}`, { status }),
};

// 資料庫狀態 API
export const systemAPI = {
  // 檢查資料庫連接狀態
  checkDbStatus: () => api.get('/db-status'),
};

export default api;
