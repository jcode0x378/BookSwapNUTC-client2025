<template>
  <div class="home-container">
    <!-- Banner輪播區 -->
    <section class="banner-section">
      <el-carousel height="400px" indicator-position="outside" trigger="click">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button v-if="banner.buttonText" type="primary" @click="navigateTo(banner.link)">
                {{ banner.buttonText }}
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
    
    <!-- 英雄區塊 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>歡迎使用 BookSwapNUTC</h1>
        <p>中科技術學院二手教科書交換平台</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="navigateTo('/books')">
            瀏覽書籍
          </el-button>
          <el-button v-if="!isAuthenticated" @click="navigateTo('/register')" size="large">
            立即註冊
          </el-button>
          <el-button v-else @click="navigateTo('/add-book')" size="large" type="success">
            發佈書籍
          </el-button>
        </div>
      </div>
    </section>
    
    <!-- 最新書籍區塊 -->
    <section class="latest-books-section">
      <div class="section-header">
        <h2>最新上架</h2>
        <el-button type="text" @click="navigateTo('/books')">
          查看全部 <el-icon><arrow-right /></el-icon>
        </el-button>
      </div>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="latestBooks.length === 0" class="empty-container">
        <el-empty description="暫無書籍" />
      </div>
      
      <div v-else class="books-grid">
        <el-card 
          v-for="book in latestBooks" 
          :key="book.id" 
          class="book-card"
          shadow="hover"
          @click="viewBookDetail(book.id)"
        >
          <div class="book-cover">
            <img 
              :src="book.image || 'https://via.placeholder.com/150x200?text=No+Image'" 
              :alt="book.title"
            />
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <div class="book-price">
              <span>NT$ {{ book.price }}</span>
              <el-tag size="small">{{ book.condition }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </section>
    
    <!-- 中間Banner區 -->
    <section class="mid-banner-section">
      <div class="mid-banner-item" :style="{ backgroundImage: `url(${midBanner.image})` }">
        <div class="mid-banner-content">
          <h2>{{ midBanner.title }}</h2>
          <p>{{ midBanner.description }}</p>
          <el-button type="primary" @click="navigateTo(midBanner.link)">
            {{ midBanner.buttonText }}
          </el-button>
        </div>
      </div>
    </section>
    
    <!-- 新增：推薦專區 -->
    <section class="recommended-books-section">
      <div class="section-header">
        <h2>推薦專區</h2>
        <el-button type="text" @click="navigateTo('/books')">
          查看更多 <el-icon><arrow-right /></el-icon>
        </el-button>
      </div>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="recommendedBooks.length === 0" class="empty-container">
        <el-empty description="暫無推薦書籍" />
      </div>
      
      <div v-else class="books-grid">
        <el-card 
          v-for="book in recommendedBooks" 
          :key="book.id" 
          class="book-card"
          shadow="hover"
          @click="viewBookDetail(book.id)"
        >
          <div class="book-cover">
            <img 
              :src="book.image || 'https://via.placeholder.com/150x200?text=No+Image'" 
              :alt="book.title"
            />
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <div class="book-price">
              <span>NT$ {{ book.price }}</span>
              <el-tag size="small">{{ book.condition }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </section>
    
    <!-- 功能介紹區塊 -->
    <section class="features-section">
      <h2>平台特色</h2>
      
      <div class="features-grid">
        <div class="feature-item">
          <el-icon size="40"><Money /></el-icon>
          <h3>節省開支</h3>
          <p>購買二手教科書，節省高達 70% 的費用</p>
        </div>
        
        <div class="feature-item">
          <el-icon size="40"><Connection /></el-icon>
          <h3>校內交易</h3>
          <p>與校內同學交易，安全便捷</p>
        </div>
        
        <div class="feature-item">
          <el-icon size="40"><Document /></el-icon>
          <h3>多樣選擇</h3>
          <p>各系所教科書一應俱全</p>
        </div>
        
        <div class="feature-item">
          <el-icon size="40"><Promotion /></el-icon>
          <h3>快速發佈</h3>
          <p>簡單幾步，輕鬆發佈您的二手書</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ArrowRight, Connection, Document, Money, Promotion } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  
  components: {
    ArrowRight,
    Money,
    Connection,
    Document,
    Promotion
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const latestBooks = ref([]);
    const recommendedBooks = ref([]);
    
    // 輪播Banner數據
    const banners = ref([
      {
        title: '春季二手書交換活動',
        description: '即日起至4月30日，參與春季二手書交換活動，享受特別優惠！',
        image: 'https://picsum.photos/id/24/1200/400',
        buttonText: '了解更多',
        link: '/activities'
      },
      {
        title: '熱門教科書推薦',
        description: '查看本學期最熱門的教科書，提前準備新學期所需',
        image: 'https://picsum.photos/id/415/1200/400',
        buttonText: '立即查看',
        link: '/books'
      },
      {
        title: '賺取課外收入',
        description: '出售您不再需要的教科書，讓知識流動起來',
        image: 'https://picsum.photos/id/42/1200/400',
        buttonText: '開始出售',
        link: '/add-book'
      }
    ]);
    
    // 中間Banner數據
    const midBanner = ref({
      title: '加入我們的二手書社群',
      description: '與其他同學交流學習心得，分享您的閱讀體驗，建立校園知識生態圈',
      image: 'https://picsum.photos/id/89/1200/200',
      buttonText: '立即加入',
      link: '/community'
    });
    
    // 從 store 獲取狀態
    const loading = computed(() => store.getters['books/isLoading']);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    
    // 導航到指定路由
    const navigateTo = (path) => {
      router.push(path);
    };

    // 查看書籍詳情
    const viewBookDetail = (bookId) => {
      console.log('Navigating to book detail, ID:', bookId);
      router.push(`/books/${bookId}`);
    };
    
    // 獲取最新書籍
    const fetchLatestBooks = async () => {
      try {
        const books = await store.dispatch('books/fetchBooks');
        // 只顯示最新的 4 本書
        latestBooks.value = books.slice(0, 4);
      } catch (error) {
        console.error('獲取最新書籍失敗:', error);
        // 如果獲取失敗，使用模擬數據
        latestBooks.value = [
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
          }
        ];
      }
    };
    
    // 獲取推薦書籍
    const fetchRecommendedBooks = async () => {
      try {
        // 如果用戶已登入，嘗試獲取基於用戶的推薦
        if (isAuthenticated.value && currentUser.value) {
          // 基於用戶系所推薦相關書籍
          const department = currentUser.value.department;
          
          // 這裡可以添加一個新的API或使用現有API提供基於用戶系所的書籍
          // 暫時使用搜索功能模擬推薦功能
          if (department) {
            try {
              const books = await store.dispatch('books/searchBooks', { department });
              if (books && books.length > 0) {
                recommendedBooks.value = books.slice(0, 4);
                return;
              }
            } catch (error) {
              console.error('獲取系所相關書籍失敗:', error);
            }
          }
        }
        
        // 如果用戶未登入或無法獲取基於用戶的推薦，則顯示熱門書籍或隨機書籍
        const allBooks = await store.dispatch('books/fetchBooks');
        
        // 這裡簡單地隨機排序所有書籍然後取前4本作為推薦
        // 在實際應用中，可能需要基於更複雜的邏輯（例如評分、熱度等）
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        recommendedBooks.value = shuffled.slice(0, 4);
      } catch (error) {
        console.error('獲取推薦書籍失敗:', error);
        // 如果獲取失敗，使用模擬數據
        recommendedBooks.value = [
          {
            id: 3,
            title: '操作系統',
            author: '王五',
            price: 280,
            condition: '良好',
            image: 'https://via.placeholder.com/150x200?text=操作系統'
          },
          {
            id: 4,
            title: '數據庫系統',
            author: '趙六',
            price: 320,
            condition: '全新',
            image: 'https://via.placeholder.com/150x200?text=數據庫系統'
          }
        ];
      }
    };
    
    // 在組件掛載時獲取書籍
    onMounted(() => {
      fetchLatestBooks();
      fetchRecommendedBooks();
    });
    
    return {
      latestBooks,
      recommendedBooks,
      loading,
      isAuthenticated,
      currentUser,
      navigateTo,
      viewBookDetail,
      banners,
      midBanner
    };
  }
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Banner樣式 */
.banner-section {
  width: 100%;
  margin-bottom: 2rem;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
}

.banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.banner-content {
  position: relative;
  color: white;
  padding: 0 4rem;
  max-width: 600px;
  z-index: 1;
}

.banner-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

/* 英雄區塊 */
.hero-section {
  padding: 4rem 0;
  text-align: center;
  background-color: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #409EFF;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #606266;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* 最新書籍區塊和推薦書籍區塊共用樣式 */
.latest-books-section,
.recommended-books-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
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

.book-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.book-info p {
  margin: 0 0 0.5rem 0;
  color: #606266;
}

.book-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #f56c6c;
}

.loading-container, .empty-container {
  padding: 2rem;
  text-align: center;
}

/* 功能介紹區塊 */
.features-section {
  margin-bottom: 3rem;
  text-align: center;
}

.features-section h2 {
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.feature-item {
  padding: 1.5rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item h3 {
  margin: 1rem 0;
}

.feature-item p {
  color: #606266;
}

/* 中間Banner樣式 */
.mid-banner-section {
  width: 100%;
  margin: 3rem 0;
}

.mid-banner-item {
  height: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.mid-banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.mid-banner-content {
  position: relative;
  color: white;
  padding: 0 4rem;
  max-width: 600px;
  z-index: 1;
}

.mid-banner-content h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.mid-banner-content p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-buttons .el-button {
    width: 80%;
    margin-bottom: 0.5rem;
  }
}
</style>