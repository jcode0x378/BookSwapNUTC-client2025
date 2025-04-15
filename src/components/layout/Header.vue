<template>
  <el-header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <h1>BookSwapNUTC</h1>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          router
          background-color="transparent"
          text-color="#333"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/">首頁</el-menu-item>
          <el-menu-item index="/books">書籍列表</el-menu-item>
          <el-menu-item index="/about">關於我們</el-menu-item>
          
          <!-- 已登入用戶菜單 -->
          <template v-if="isAuthenticated">
            <el-sub-menu index="user">
              <template #title>{{ currentUser?.username || '用戶' }}</template>
              <el-menu-item index="/profile">個人資料</el-menu-item>
              <el-menu-item index="/my-books">我的書籍</el-menu-item>
              <el-menu-item index="/transactions">交易記錄</el-menu-item>
              <el-menu-item @click="handleLogout">登出</el-menu-item>
            </el-sub-menu>
          </template>
          
          <!-- 未登入用戶菜單 -->
          <template v-else>
            <el-menu-item index="/login">登入</el-menu-item>
            <el-menu-item index="/register">註冊</el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'HeaderComponent',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // 從 store 獲取認證狀態
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    
    // 當前活動菜單項
    const activeIndex = computed(() => route.path);
    
    // 處理登出
    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/');
      } catch (error) {
        console.error('登出失敗:', error);
      }
    };
    
    return {
      isAuthenticated,
      currentUser,
      activeIndex,
      handleLogout
    };
  }
};
</script>

<style scoped>
.app-header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo a {
  text-decoration: none;
  color: #409EFF;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 0.5rem;
  }
  
  .logo {
    margin-bottom: 0.5rem;
  }
}
</style> 