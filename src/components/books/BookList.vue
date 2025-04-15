<template>
  <div class="book-list">
    <!-- 加載中 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <!-- 無數據 -->
    <el-empty v-else-if="books.length === 0" :description="emptyText" />
    
    <!-- 書籍列表 -->
    <div v-else class="book-grid">
      <el-card 
        v-for="book in books" 
        :key="book.id" 
        class="book-card"
        shadow="hover"
      >
        <div class="book-content" @click="$emit('view', book)">
          <div class="book-cover">
            <img 
              :src="book.image || 'https://dummyimage.com/150x200/cccccc/666666&text=No+Image'" 
              :alt="book.title"
            />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-details">
              <span class="book-price">NT$ {{ book.price }}</span>
              <el-tag size="small" :type="getConditionType(book.condition)">
                {{ book.condition }}
              </el-tag>
            </div>
            <p class="book-date">
              <span v-if="book.status === 'sold'">
                售出時間: {{ formatDate(book.soldAt) }}
              </span>
              <span v-else>
                上架時間: {{ formatDate(book.createdAt) }}
              </span>
            </p>
          </div>
        </div>
        
        <!-- 操作按鈕 -->
        <div v-if="showActions" class="book-actions">
          <el-button 
            type="primary" 
            size="small" 
            @click="$emit('edit', book)"
          >
            編輯
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="$emit('delete', book)"
          >
            刪除
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookList',
  
  props: {
    books: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暫無書籍'
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['view', 'edit', 'delete'],
  
  setup() {
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
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    return {
      getConditionType,
      formatDate
    };
  }
};
</script>

<style scoped>
.loading-container {
  padding: 2rem 0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.book-card {
  display: flex;
  flex-direction: column;
}

.book-content {
  flex: 1;
  cursor: pointer;
}

.book-cover {
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.book-cover img {
  max-height: 100%;
  object-fit: contain;
}

.book-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  margin: 0 0 0.5rem 0;
  color: #606266;
  font-size: 0.9rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.book-price {
  font-weight: bold;
  color: #f56c6c;
}

.book-date {
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  color: #909399;
}

.book-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style> 