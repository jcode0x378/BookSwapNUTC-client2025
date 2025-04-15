<template>
  <div class="books-container">
    <h1 class="page-title">書籍列表</h1>
    
    <!-- 搜索和篩選 -->
    <div class="search-filter">
      <div class="custom-input search-input">
        <el-icon class="custom-input-icon"><Search /></el-icon>
        <input
          v-model="searchQuery"
          placeholder="搜索書籍..."
          class="custom-input-inner"
          @input="handleSearch"
        />
        <span 
          v-if="searchQuery" 
          class="custom-input-clear" 
          @click="searchQuery = ''; handleSearch()"
        >×</span>
      </div>
      
      <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort" class="sort-select">
        <el-option label="最新上架" value="newest" />
        <el-option label="價格從低到高" value="price_asc" />
        <el-option label="價格從高到低" value="price_desc" />
      </el-select>
    </div>
    
    <!-- 加載中 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <!-- 無數據 -->
    <el-empty v-else-if="displayedBooks.length === 0" description="暫無書籍" />
    
    <!-- 書籍列表 -->
    <div v-else class="books-grid">
      <el-card
        v-for="book in displayedBooks"
        :key="book.id"
        class="book-card"
        shadow="hover"
        @click="viewBookDetails(book.id)"
      >
        <div class="book-cover">
          <img
            :src="book.image || 'https://via.placeholder.com/150x200?text=No+Image'"
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
        </div>
      </el-card>
    </div>
    
    <!-- 分頁 -->
    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalItems"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'BooksView',
  
  components: {
    Search
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // 狀態
    const searchQuery = ref('');
    const sortBy = ref('newest');
    const currentPage = ref(1);
    const pageSize = ref(12);
    
    // 從 store 獲取狀態
    const loading = computed(() => store.getters['books/isLoading']);
    const allBooks = computed(() => store.getters['books/allBooks']);
    
    // 篩選和排序後的書籍
    const filteredBooks = computed(() => {
      let result = [...allBooks.value];
      
      // 搜索篩選
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query)
        );
      }
      
      // 排序
      switch (sortBy.value) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
        default:
          // 假設有 createdAt 字段，如果沒有則使用 id
          result.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return b.id - a.id;
          });
          break;
      }
      
      return result;
    });
    
    // 分頁相關計算
    const totalItems = computed(() => filteredBooks.value.length);
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
    
    // 當前頁面顯示的書籍
    const displayedBooks = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredBooks.value.slice(start, end);
    });
    
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
    
    // 處理搜索
    const handleSearch = () => {
      currentPage.value = 1; // 重置頁碼
    };
    
    // 處理排序
    const handleSort = () => {
      currentPage.value = 1; // 重置頁碼
    };
    
    // 處理頁碼變化
    const handlePageChange = (page) => {
      currentPage.value = page;
      // 滾動到頁面頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 查看書籍詳情
    const viewBookDetails = (id) => {
      router.push(`/books/${id}`);
    };
    
    // 獲取書籍數據
    const fetchBooks = async () => {
      try {
        await store.dispatch('books/fetchBooks');
      } catch (error) {
        console.error('獲取書籍失敗:', error);
        // 使用模擬數據
        store.commit('books/SET_BOOKS', [
          {
            id: 1,
            title: '數據結構',
            author: '張三',
            price: 300,
            condition: '良好',
            image: 'https://via.placeholder.com/150x200?text=數據結構'
          },
          {
            id: 2,
            title: '計算機網絡',
            author: '李四',
            price: 250,
            condition: '全新',
            image: 'https://via.placeholder.com/150x200?text=計算機網絡'
          },
          {
            id: 3,
            title: '操作系統',
            author: '王五',
            price: 280,
            condition: '一般',
            image: 'https://via.placeholder.com/150x200?text=操作系統'
          },
          {
            id: 4,
            title: '編譯原理',
            author: '趙六',
            price: 320,
            condition: '良好',
            image: 'https://via.placeholder.com/150x200?text=編譯原理'
          }
        ]);
      }
    };
    
    // 在組件掛載時獲取書籍數據
    onMounted(() => {
      fetchBooks();
    });
    
    return {
      searchQuery,
      sortBy,
      currentPage,
      pageSize,
      loading,
      displayedBooks,
      totalItems,
      totalPages,
      getConditionType,
      handleSearch,
      handleSort,
      handlePageChange,
      viewBookDetails
    };
  }
};
</script>

<style scoped>
.books-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.page-title {
  margin-bottom: 1.5rem;
  color: #303133;
}

.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.custom-input {
  position: relative;
  flex: 3;
}

.sort-select {
  min-width: 150px;
  flex: 1;
}

.custom-input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  z-index: 1;
}

.custom-input-inner {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 35px 0 35px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
}

.custom-input-inner:focus {
  border-color: #409EFF;
}

.custom-input-inner::placeholder {
  color: #c0c4cc;
}

.custom-input-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #c0c4cc;
  font-size: 16px;
  z-index: 1;
}

.custom-input-clear:hover {
  color: #909399;
}

.loading-container {
  padding: 2rem 0;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.book-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.book-cover img {
  max-height: 100%;
  object-fit: cover;
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
}

.book-price {
  font-weight: bold;
  color: #f56c6c;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
  }
  
  .custom-input {
    flex: 1;
    margin-bottom: 10px;
    width: 100%;
  }
  
  .sort-select {
    width: 100%;
    min-width: 100%;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style> 