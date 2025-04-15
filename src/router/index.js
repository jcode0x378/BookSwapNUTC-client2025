import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首頁' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登入', guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '註冊', guest: true },
  },
  {
    path: '/books',
    name: 'Books',
    component: () => import('../views/Books.vue'),
    meta: { title: '書籍列表' },
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetail.vue'),
    meta: { title: '書籍詳情' },
    props: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: '個人資料', requiresAuth: true },
  },
  {
    path: '/my-books',
    name: 'MyBooks',
    component: () => import('../views/MyBooks.vue'),
    meta: { title: '我的書籍', requiresAuth: true },
  },
  {
    path: '/add-book',
    name: 'AddBook',
    component: () => import('../views/AddBook.vue'),
    meta: { title: '新增書籍', requiresAuth: true },
  },
  {
    path: '/edit-book/:id',
    name: 'EditBook',
    component: () => import('../views/EditBook.vue'),
    meta: { title: '編輯書籍', requiresAuth: true },
    props: true,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
    meta: { title: '交易記錄', requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '關於我們' },
  },
  {
    path: '/payment/:id',
    name: 'PaymentProcess',
    component: () => import('../views/PaymentProcess.vue'),
    meta: { title: '書籍付款', requiresAuth: true },
    props: true,
  },
  {
    path: '/payment-result',
    name: 'PaymentResult',
    component: () => import('../views/PaymentResult.vue'),
    meta: { title: '付款結果' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '頁面未找到' },
  },
];

// 創建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始終滾動到頂部
    return { top: 0 };
  },
});

// 導航守衛
router.beforeEach((to, from, next) => {
  // 設置頁面標題
  document.title = `${to.meta.title || '首頁'} - BookSwapNUTC`;

  // 檢查是否需要認證
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  // 如果需要認證但未登入，重定向到登入頁面
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  // 如果是訪客頁面但已登入，重定向到首頁
  else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next({ name: 'Home' });
  }
  // 其他情況正常導航
  else {
    next();
  }
});

export default router;
