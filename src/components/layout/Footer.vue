<template>
  <el-footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} BookSwapNUTC. 保留所有權利。</p>
        <p>
          <span>資料庫狀態: </span>
          <el-tag 
            :type="dbConnected ? 'success' : 'danger'" 
            size="small"
          >
            {{ dbConnected ? '已連接' : '未連接' }}
          </el-tag>
        </p>
      </div>
    </div>
  </el-footer>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'FooterComponent',
  
  setup() {
    const store = useStore();
    
    // 獲取當前年份
    const currentYear = ref(new Date().getFullYear());
    
    // 從 store 獲取資料庫連接狀態
    const dbConnected = computed(() => store.getters['system/isDbConnected']);
    
    return {
      currentYear,
      dbConnected
    };
  }
};
</script>

<style scoped>
.app-footer {
  background-color: #f5f7fa;
  padding: 1.5rem 0;
  margin-top: 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-content p {
    margin: 0.5rem 0;
  }
}
</style> 