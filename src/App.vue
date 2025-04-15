<template>
  <div class="app-container">
    <header-component />
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer-component />
    
    <!-- 資料庫連接錯誤提示 -->
    <el-alert
      v-if="showDbAlert"
      title="無法連接到伺服器資料庫，部分功能可能無法使用"
      type="warning"
      show-icon
      :closable="true"
      @close="closeDbAlert"
      class="db-alert"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import FooterComponent from './components/layout/Footer.vue';
import HeaderComponent from './components/layout/Header.vue';

export default {
  name: 'App',
  
  components: {
    HeaderComponent,
    FooterComponent
  },
  
  setup() {
    const store = useStore();
    const showDbAlert = ref(false);
    
    // 從 store 獲取資料庫連接狀態
    const dbConnected = computed(() => store.getters['system/isDbConnected']);
    const dbChecked = computed(() => store.getters['system/isDbChecked']);
    
    // 監聽資料庫連接狀態變化
    watch([dbConnected, dbChecked], ([connected, checked]) => {
      if (checked && !connected) {
        showDbAlert.value = true;
      }
    });
    
    // 關閉資料庫警告
    const closeDbAlert = () => {
      showDbAlert.value = false;
    };
    
    // 在組件掛載時檢查資料庫連接狀態
    onMounted(() => {
      store.dispatch('system/checkDbStatus').catch(error => {
        console.warn('無法檢查資料庫狀態:', error);
      });
    });
    
    return {
      showDbAlert,
      closeDbAlert
    };
  }
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.db-alert {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}
</style>