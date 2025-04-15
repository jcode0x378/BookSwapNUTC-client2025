import axios from 'axios';
import store from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 5000,
  withCredentials: true,
});

// 請求攔截器
api.interceptors.request.use(
  config => {
    const token = store.getters.getAuthToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// 響應攔截器
api.interceptors.response.use(
  response => {
    const { code, msg } = response.data;

    if (code === '401') {
      store.dispatch('logout');
      store.dispatch('setShowLogin', true);
      return Promise.reject(new Error(msg));
    }

    return response;
  },
  error => Promise.reject(error),
);

export const userApi = {
  login: (userName, password) =>
    api.post('/users/login', { userName, password }),

  register: (userName, password) =>
    api.post('/users/register', { userName, password }),

  getOrders: () => api.get('/user/orders'),

  getCollections: () => api.get('/user/collections'),
};

export const productApi = {
  getDetails: productId => api.get(`/product/${productId}`),

  addToCart: productId => api.post('/user/cart/add', { productId }),

  addToCollect: productId => api.post('/user/collect/add', { productId }),
};

export default api;
