import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
import store from '../store';

// 創建 axios 實例
const api = axios.create({
  baseURL: '/api', // 使用相對路徑
  timeout: 10000,
});

// 請求攔截器
api.interceptors.request.use(
  config => {
    // 從 localStorage 獲取 token
    const token = localStorage.getItem('token');
    if (token) {
      // 將 token 添加到請求頭
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 響應攔截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 處理錯誤
    if (error.response) {
      // 服務器返回錯誤
      const { status, data } = error.response;

      if (status === 401) {
        // 未授權，清除 token 並重定向到登入頁面
        store.dispatch('auth/logout');
        router.push('/login');
        ElMessage.error('登入已過期，請重新登入');
      } else if (status === 403) {
        // 禁止訪問
        ElMessage.error('您沒有權限執行此操作');
      } else if (status === 404) {
        // 資源不存在
        ElMessage.error('請求的資源不存在');
      } else {
        // 其他錯誤
        ElMessage.error(data.message || '發生錯誤，請稍後再試');
      }
    } else {
      // 網絡錯誤或請求被取消
      ElMessage.error('發生錯誤，請稍後再試');
    }

    return Promise.reject(error);
  },
);

// 系統 API
export const checkDbStatus = () => {
  return api.get('/db-status');
};

export default api;
