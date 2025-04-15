<template>
  <div class="order-list">
    <!-- 加載中 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <!-- 無數據 -->
    <el-empty v-else-if="orders.length === 0" :description="emptyText" />
    
    <!-- 訂單列表 -->
    <div v-else>
      <el-timeline>
        <el-timeline-item
          v-for="order in orders"
          :key="order.id"
          :timestamp="formatDate(order.createdAt)"
          :type="getStatusType(order.status)"
        >
          <el-card class="order-card">
            <div class="order-content">
              <!-- 書籍信息 -->
              <div class="book-info">
                <div class="book-cover">
                  <img 
                    :src="order.book?.image || 'https://dummyimage.com/150x200/cccccc/666666&text=No+Image'" 
                    :alt="order.book?.title"
                  />
                </div>
                <div class="book-details">
                  <h3 class="book-title">{{ order.book?.title }}</h3>
                  <p class="book-author">{{ order.book?.author }}</p>
                  <p class="book-price">NT$ {{ order.totalAmount }}</p>
                  <p class="order-no">訂單編號: {{ order.orderNo }}</p>
                </div>
              </div>
              
              <!-- 訂單信息 -->
              <div class="order-info">
                <p v-if="type === 'bought'">
                  <strong>賣家：</strong>{{ order.seller ? order.seller.username : '未知賣家' }}
                </p>
                <p v-else>
                  <strong>買家：</strong>{{ order.buyer ? order.buyer.username : '未知買家' }}
                </p>
                <p>
                  <strong>狀態：</strong>
                  <el-tag :type="getStatusType(order.status)">
                    {{ getStatusText(order.status) }}
                  </el-tag>
                </p>
                <p v-if="order.paymentType">
                  <strong>付款方式：</strong>{{ getPaymentTypeText(order.paymentType) }}
                </p>
                <p v-if="order.paymentDate">
                  <strong>付款時間：</strong>{{ formatDate(order.paymentDate) }}
                </p>
                <p>
                  <strong>創建時間：</strong>{{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'OrderList',
  
  props: {
    orders: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暫無訂單記錄'
    },
    type: {
      type: String,
      default: 'bought',
      validator: (value) => ['bought', 'sold'].includes(value)
    }
  },
  
  setup() {
    const router = useRouter();
    
    // 獲取訂單狀態對應的標籤類型
    const getStatusType = (status) => {
      switch (status) {
        case 'paid':
          return 'success';
        case 'pending':
          return 'warning';
        case 'cancelled':
          return 'danger';
        default:
          return 'info';
      }
    };
    
    // 獲取訂單狀態文本
    const getStatusText = (status) => {
      switch (status) {
        case 'paid':
          return '已支付';
        case 'pending':
          return '待支付';
        case 'cancelled':
          return '已取消';
        default:
          return '未知狀態';
      }
    };
    
    // 獲取付款方式文本
    const getPaymentTypeText = (paymentType) => {
      switch (paymentType) {
        case 'CREDIT':
          return '信用卡';
        case 'ATM':
          return 'ATM轉帳';
        case 'CVS':
          return '超商代碼';
        default:
          return paymentType || '未知方式';
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
    
    return {
      getStatusType,
      getStatusText,
      getPaymentTypeText,
      formatDate,
      viewBook
    };
  }
};
</script>

<style scoped>
.loading-container {
  padding: 2rem 0;
}

.order-card {
  margin-bottom: 1rem;
}

.order-content {
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
  border-radius: 4px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details {
  flex: 1;
}

.book-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.book-author {
  margin: 0 0 0.5rem;
  color: #606266;
}

.book-price {
  margin: 0 0 0.5rem;
  font-weight: bold;
  color: #409EFF;
}

.order-no {
  margin: 0;
  font-size: 0.9rem;
  color: #909399;
}

.order-info {
  background-color: #f8f8f8;
  padding: 0.8rem;
  border-radius: 4px;
}

.order-info p {
  margin: 0.5rem 0;
}

@media (min-width: 768px) {
  .order-content {
    flex-direction: row;
  }
  
  .book-info {
    flex: 1;
  }
  
  .order-info {
    flex: 1;
  }
}
</style> 