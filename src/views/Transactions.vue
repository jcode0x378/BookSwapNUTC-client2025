<template>
  <div class="transactions-container">
    <h1 class="page-title">交易記錄</h1>
    
    <!-- 訂單標籤頁 -->
    <el-tabs v-model="orderTabType" class="order-tabs">
      <el-tab-pane label="我購買的訂單" name="bought">
        <order-list 
          :orders="boughtOrders" 
          :loading="loading" 
          :empty-text="'您還沒有購買訂單'"
          type="bought"
        />
      </el-tab-pane>
      
      <el-tab-pane label="我賣出的訂單" name="sold">
        <order-list 
          :orders="soldOrders" 
          :loading="loading" 
          :empty-text="'您還沒有賣出訂單'"
          type="sold"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import OrderList from '../components/transactions/OrderList.vue';

export default {
  name: 'TransactionsView',
  
  components: {
    OrderList
  },
  
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    
    // 訂單標籤頁
    const orderTabType = ref('bought');
    
    // 加載狀態
    const loading = ref(false);
    
    // 從store獲取訂單數據
    const boughtOrders = computed(() => store.getters['transactions/boughtOrders'] || []);
    const soldOrders = computed(() => store.getters['transactions/soldOrders'] || []);
    
    // 獲取訂單記錄
    const fetchData = async () => {
      try {
        loading.value = true;
        await store.dispatch('transactions/fetchOrders');
      } catch (error) {
        proxy.$notifyError('獲取訂單記錄失敗: ' + (error.message || '未知錯誤'));
      } finally {
        loading.value = false;
      }
    };
    
    // 在組件掛載時獲取訂單記錄
    onMounted(() => {
      fetchData();
    });
    
    return {
      orderTabType,
      loading,
      boughtOrders,
      soldOrders
    };
  }
};
</script>

<style scoped>
.transactions-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  margin-bottom: 2rem;
  color: #303133;
}

.order-tabs {
  margin-bottom: 2rem;
}
</style> 