<template>
  <div class="payment-result-container">
    <el-card class="result-card">
      <template #header>
        <h2 class="result-title">付款結果</h2>
      </template>
      
      <div class="result-content">
        <div v-if="loading" class="loading">
          <el-skeleton :rows="3" animated />
          <p>正在獲取支付結果...</p>
        </div>
        
        <div v-else class="result-info">
          <div v-if="isSuccess" class="success-result">
            <el-icon size="64" color="#67C23A"><CircleCheckFilled /></el-icon>
            <h3>付款成功</h3>
            <p>您的訂單已完成付款處理</p>
            <p class="order-no">訂單編號: {{ orderNo }}</p>
          </div>
          
          <div v-else class="error-result">
            <el-icon size="64" color="#F56C6C"><CircleCloseFilled /></el-icon>
            <h3>付款失敗</h3>
            <p>{{ errorMessage || '處理您的付款時發生錯誤' }}</p>
            <p v-if="orderNo" class="order-no">訂單編號: {{ orderNo }}</p>
          </div>
          
          <div class="result-actions">
            <el-button type="primary" @click="goToTransactions">查看我的交易</el-button>
            <el-button @click="goToHome">返回首頁</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'PaymentResultView',
  
  components: {
    CircleCheckFilled,
    CircleCloseFilled
  },
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const loading = ref(true);
    const orderNo = ref('');
    const statusCode = ref('');
    const errorMessage = ref('');
    
    // 計算是否成功
    const isSuccess = computed(() => statusCode.value === '1');
    
    // 導航到交易記錄頁面
    const goToTransactions = () => {
      router.push('/transactions');
    };
    
    // 導航到首頁
    const goToHome = () => {
      router.push('/');
    };
    
    // 初始化頁面數據
    onMounted(() => {
      // 從 URL 參數獲取支付結果
      orderNo.value = route.query.orderNo || '';
      statusCode.value = route.query.status || '';
      errorMessage.value = route.query.message || '';
      
      // 模擬數據載入
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });
    
    return {
      loading,
      orderNo,
      isSuccess,
      errorMessage,
      goToTransactions,
      goToHome
    };
  }
};
</script>

<style scoped>
.payment-result-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.result-card {
  width: 100%;
}

.result-title {
  text-align: center;
  margin: 0;
  color: #409EFF;
}

.result-content {
  padding: 2rem 0;
}

.loading {
  text-align: center;
}

.result-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-result, .error-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.success-result h3 {
  color: #67C23A;
  margin: 1rem 0 0.5rem;
}

.error-result h3 {
  color: #F56C6C;
  margin: 1rem 0 0.5rem;
}

.order-no {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  font-family: monospace;
}

.result-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
</style>
