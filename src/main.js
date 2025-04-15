import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.css';
import Global from './Global';
import router from './router';
import store from './store';
import { ElNotification } from 'element-plus';

// 創建 Vue 應用
const app = createApp(App);

// 使用插件
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(Global);

// 全局錯誤處理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue錯誤:', err);
  console.error('錯誤信息:', info);
};

// 全局通知方法
app.config.globalProperties.$notifySucceed = message => {
  ElNotification({
    title: '成功',
    message,
    type: 'success',
    duration: 3000,
  });
};

app.config.globalProperties.$notifyError = message => {
  ElNotification({
    title: '錯誤',
    message,
    type: 'error',
    duration: 5000,
  });
};

app.config.globalProperties.$notifyInfo = message => {
  ElNotification({
    title: '提示',
    message,
    type: 'info',
    duration: 3000,
  });
};

// 檢查用戶認證狀態
const token = localStorage.getItem('token');
if (token) {
  // 如果有token，嘗試獲取用戶信息
  store.dispatch('auth/fetchCurrentUser').catch(error => {
    console.error('獲取用戶信息失敗:', error);
    // 如果獲取失敗，清除token
    store.dispatch('auth/logout');
  });
}

// 掛載應用
app.mount('#app');

// 檢查資料庫連接狀態
store.dispatch('system/checkDbStatus').catch(error => {
  console.warn('無法檢查資料庫狀態:', error);
  // 不需要顯示錯誤通知，因為這只是一個非關鍵操作
});
