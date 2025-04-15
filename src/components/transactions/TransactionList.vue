<template>
  <div class="transaction-list">
    <!-- 加載中 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <!-- 無數據 -->
    <el-empty v-else-if="transactions.length === 0" :description="emptyText" />
    
    <!-- 交易列表 -->
    <div v-else>
      <el-timeline>
        <el-timeline-item
          v-for="transaction in transactions"
          :key="transaction.id"
          :timestamp="formatDate(transaction.createdAt)"
          :type="getStatusType(transaction.status)"
        >
          <el-card class="transaction-card">
            <div class="transaction-content">
              <!-- 書籍信息 -->
              <div class="book-info">
                <div class="book-cover">
                  <img 
                    :src="transaction.book.image || 'https://dummyimage.com/150x200/cccccc/666666&text=No+Image'" 
                    :alt="transaction.book.title"
                  />
                </div>
                <div class="book-details">
                  <h3 class="book-title">{{ transaction.book.title }}</h3>
                  <p class="book-author">{{ transaction.book.author }}</p>
                  <p class="book-price">NT$ {{ transaction.book.price }}</p>
                  <el-tag size="small" :type="getConditionType(transaction.book.condition)">
                    {{ transaction.book.condition }}
                  </el-tag>
                </div>
              </div>
              
              <!-- 交易信息 -->
              <div class="transaction-info">
                <p v-if="type === 'bought'">
                  <strong>賣家：</strong>{{ transaction.seller.username }}
                </p>
                <p v-else>
                  <strong>買家：</strong>{{ transaction.buyer.username }}
                </p>
                <p>
                  <strong>狀態：</strong>
                  <el-tag :type="getStatusType(transaction.status)">
                    {{ getStatusText(transaction.status) }}
                  </el-tag>
                </p>
                <p>
                  <strong>更新時間：</strong>{{ formatDate(transaction.updatedAt) }}
                </p>
              </div>
            </div>
            
            <!-- 操作按鈕 -->
            <div class="transaction-actions">
              <el-button 
                v-if="type === 'bought' && transaction.status === 'completed'"
                type="primary" 
                size="small" 
                @click="viewBook(transaction.book.id)"
              >
                查看書籍
              </el-button>
              
              <el-button 
                v-if="type === 'sold' && transaction.status === 'pending'"
                type="success" 
                size="small" 
                @click="confirmTransaction(transaction.id)"
              >
                確認交易
              </el-button>
              
              <el-button 
                v-if="transaction.status === 'pending'"
                type="danger" 
                size="small" 
                @click="cancelTransaction(transaction.id)"
              >
                取消交易
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'TransactionList',
  
  props: {
    transactions: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暫無交易記錄'
    },
    type: {
      type: String,
      default: 'bought',
      validator: (value) => ['bought', 'sold'].includes(value)
    }
  },
  
  setup(props) {
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const store = useStore();
    
    // 獲取書籍狀態對應的標籤類型
    const getConditionType = (condition) => {
      switch (condition) {
        case '全新':
          return 'success';
        case '良好':
          return '';
        case '一般':
          return 'warning';
        case '破損':
          return 'danger';
        default:
          return 'info';
      }
    };
    
    // 獲取交易狀態對應的標籤類型
    const getStatusType = (status) => {
      switch (status) {
        case 'completed':
          return 'success';
        case 'pending':
          return 'warning';
        case 'cancelled':
          return 'danger';
        default:
          return 'info';
      }
    };
    
    // 獲取交易狀態文本
    const getStatusText = (status) => {
      switch (status) {
        case 'completed':
          return '已完成';
        case 'pending':
          return '待確認';
        case 'cancelled':
          return '已取消';
        default:
          return '未知狀態';
      }
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // 查看書籍
    const viewBook = (bookId) => {
      router.push(`/books/${bookId}`);
    };
    
    // 確認交易
    const confirmTransaction = async (transactionId) => {
      try {
        // 調用store action確認交易
        await store.dispatch('transactions/confirmTransaction', transactionId);
        
        proxy.$notifySucceed('交易已確認');
      } catch (error) {
        proxy.$notifyError('確認交易失敗: ' + (error.message || '未知錯誤'));
      }
    };
    
    // 取消交易
    const cancelTransaction = async (transactionId) => {
      try {
        // 調用store action取消交易
        await store.dispatch('transactions/cancelTransaction', transactionId);
        
        proxy.$notifySucceed('交易已取消');
      } catch (error) {
        proxy.$notifyError('取消交易失敗: ' + (error.message || '未知錯誤'));
      }
    };
    
    return {
      getConditionType,
      getStatusType,
      getStatusText,
      formatDate,
      viewBook,
      confirmTransaction,
      cancelTransaction
    };
  }
};
</script>

<style scoped>
.loading-container {
  padding: 2rem 0;
}

.transaction-card {
  margin-bottom: 1rem;
}

.transaction-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-info {
  display: flex;
  gap: 1rem;
}

.book-cover {
  width: 80px;
  height: 120px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.book-cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.book-details {
  flex: 1;
}

.book-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.book-author {
  margin: 0 0 0.5rem 0;
  color: #606266;
  font-size: 0.9rem;
}

.book-price {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #f56c6c;
}

.transaction-info {
  margin-top: 0.5rem;
}

.transaction-info p {
  margin: 0.5rem 0;
}

.transaction-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ebeef5;
}

@media (min-width: 768px) {
  .transaction-content {
    flex-direction: row;
  }
  
  .book-info {
    width: 60%;
  }
  
  .transaction-info {
    width: 40%;
    margin-top: 0;
  }
}
</style> 