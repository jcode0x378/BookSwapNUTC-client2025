<template>
  <div class="book-detail-container">
    <!-- 加載中 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <!-- 錯誤提示 -->
    <el-alert
      v-else-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="error-alert"
    />
    
    <!-- 書籍詳情 -->
    <div v-else-if="book" class="book-detail">
      <div class="book-header">
        <el-button @click="goBack" icon="arrow-left">返回</el-button>
      </div>
      
      <el-row :gutter="30">
        <!-- 左側：書籍圖片 -->
        <el-col :xs="24" :sm="8" :md="6" class="book-image-col">
          <div class="book-image">
            <img 
              :src="book.image || 'https://via.placeholder.com/300x400?text=No+Image'" 
              :alt="book.title"
            />
          </div>
        </el-col>
        
        <!-- 右側：書籍信息 -->
        <el-col :xs="24" :sm="16" :md="18">
          <div class="book-info">
            <h1 class="book-title">{{ book.title }}</h1>
            
            <div class="book-meta">
              <p><strong>作者：</strong>{{ book.author }}</p>
              <p v-if="book.isbn"><strong>ISBN：</strong>{{ book.isbn }}</p>
              <p><strong>狀態：</strong><el-tag :type="getConditionType(book.condition)">{{ book.condition }}</el-tag></p>
              <p class="book-price"><strong>價格：</strong>NT$ {{ book.price }}</p>
            </div>
            
            <div class="book-description">
              <h3>書籍描述</h3>
              <p>{{ book.description || '賣家未提供描述' }}</p>
            </div>
            
            <div class="seller-info" v-if="book.user || book.seller">
              <h3>賣家信息</h3>
              <p><strong>賣家：</strong>{{ book.user?.username || book.seller?.username || '未知賣家' }}</p>
              <p><strong>上架時間：</strong>{{ formatDate(book.createdAt) }}</p>
            </div>
            
            <div class="book-actions">
              <el-button 
                type="primary" 
                size="large" 
                @click="handleContact"
                :disabled="!isAuthenticated"
              >
                聯絡賣家
              </el-button>
              
              <el-button 
                type="success" 
                size="large" 
                @click="handlePurchase"
                :disabled="!isAuthenticated"
              >
                購買
              </el-button>
              
              <el-button 
                v-if="isOwner" 
                type="warning" 
                size="large" 
                @click="handleEdit"
              >
                編輯
              </el-button>
              
              <el-button 
                v-if="isOwner" 
                type="danger" 
                size="large" 
                @click="handleDelete"
              >
                刪除
              </el-button>
            </div>
            
            <el-alert
              v-if="!isAuthenticated"
              title="請登入後進行交易操作"
              type="info"
              show-icon
              :closable="false"
              class="login-alert"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 書籍不存在 -->
    <el-empty v-else description="找不到該書籍" />
    
    <!-- 確認刪除對話框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="確認刪除"
      width="30%"
    >
      <span>確定要刪除這本書嗎？此操作不可逆。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="deleteLoading">確定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 聯絡賣家對話框 -->
    <el-dialog
      v-model="contactDialogVisible"
      title="聯絡賣家"
      width="50%"
    >
      <el-form :model="contactForm" label-position="top">
        <el-form-item label="訊息">
          <el-input 
            v-model="contactForm.message" 
            type="textarea" 
            rows="4"
            placeholder="請輸入您想告訴賣家的訊息..."
          />
        </el-form-item>
        <el-form-item label="聯絡方式">
          <el-input 
            v-model="contactForm.contact" 
            placeholder="請留下您的聯絡方式（電話、Line ID 等）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contactDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendContactMessage" :loading="contactLoading">發送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'BookDetailView',
  
  props: {
    id: {
      type: [String, Number],
      required: false
    }
  },
  
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    
    // 獲取書籍 ID
    const bookId = computed(() => props.id || route.params.id);
    
    // 狀態
    const deleteDialogVisible = ref(false);
    const deleteLoading = ref(false);
    const contactDialogVisible = ref(false);
    const contactLoading = ref(false);
    const contactForm = ref({
      message: '',
      contact: ''
    });
    
    // 從 store 獲取狀態
    const loading = computed(() => store.getters['books/isLoading']);
    const error = computed(() => store.getters['books/error']);
    const book = computed(() => store.getters['books/bookDetail'] || store.getters['books/currentBook']);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    
    // 檢查當前用戶是否為書籍擁有者
    const isOwner = computed(() => {
      if (!isAuthenticated.value || !book.value) return false;
      
      // 檢查書籍是否有賣家信息
      const sellerId = book.value.seller?.id || book.value.user?.id;
      const currentUserId = currentUser.value?.id;
      
      console.log('Seller ID:', sellerId);
      console.log('Current User ID:', currentUserId);
      
      return sellerId && currentUserId && sellerId === currentUserId;
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
    
    // 返回上一頁
    const goBack = () => {
      router.back();
    };
    
    // 處理編輯
    const handleEdit = () => {
      router.push(`/edit-book/${bookId.value}`);
    };
    
    // 處理刪除
    const handleDelete = () => {
      deleteDialogVisible.value = true;
    };
    
    // 確認刪除
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        await store.dispatch('books/deleteBook', bookId.value);
        deleteDialogVisible.value = false;
        proxy.$notifySucceed('書籍已成功刪除');
        router.push('/books');
      } catch (error) {
        proxy.$notifyError('刪除書籍失敗: ' + (error.message || '未知錯誤'));
      } finally {
        deleteLoading.value = false;
      }
    };
    
    // 處理聯絡賣家
    const handleContact = () => {
      if (!isAuthenticated.value) {
        router.push({ name: 'Login', query: { redirect: route.fullPath } });
        return;
      }
      
      contactDialogVisible.value = true;
    };
    
    // 發送聯絡訊息
    const sendContactMessage = async () => {
      try {
        contactLoading.value = true;
        
        // 這裡應該有一個 API 調用來發送訊息
        // 目前僅模擬成功
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        contactDialogVisible.value = false;
        proxy.$notifySucceed('訊息已發送給賣家');
        contactForm.value = { message: '', contact: '' };
      } catch (error) {
        proxy.$notifyError('發送訊息失敗: ' + (error.message || '未知錯誤'));
      } finally {
        contactLoading.value = false;
      }
    };
    
    // 處理購買
    const handlePurchase = () => {
      if (!isAuthenticated.value) {
        router.push({ name: 'Login', query: { redirect: route.fullPath } });
        return;
      }
      
      // 導航到支付頁面
      router.push(`/payment/${bookId.value}`);
    };
    
    // 獲取書籍詳情
    const fetchBookDetail = async () => {
      try {
        console.log('Fetching book detail for ID:', bookId.value);
        const bookData = await store.dispatch('books/fetchBook', bookId.value);
        console.log('Fetched book data:', bookData);
        if (!bookData) {
          console.error('No book data returned');
          error.value = '無法獲取書籍資料，請稍後再試';
        }
      } catch (error) {
        console.error('獲取書籍詳情失敗:', error);
        error.value = `獲取書籍詳情失敗: ${error.message || '未知錯誤'}`;
      }
    };
    
    // 在組件掛載時獲取書籍詳情
    onMounted(() => {
      if (bookId.value) {
        fetchBookDetail();
      } else {
        console.error('No book ID provided');
        error.value = '未提供書籍ID';
      }
    });
    
    return {
      bookId,
      loading,
      error,
      book,
      isAuthenticated,
      isOwner,
      deleteDialogVisible,
      deleteLoading,
      contactDialogVisible,
      contactLoading,
      contactForm,
      getConditionType,
      formatDate,
      goBack,
      handleEdit,
      handleDelete,
      confirmDelete,
      handleContact,
      sendContactMessage,
      handlePurchase
    };
  }
};
</script>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-container, .error-alert {
  margin-bottom: 2rem;
}

.book-header {
  margin-bottom: 2rem;
}

.book-image-col {
  margin-bottom: 2rem;
}

.book-image {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.book-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.book-title {
  margin: 0 0 1.5rem 0;
  color: #303133;
}

.book-meta {
  margin-bottom: 1.5rem;
}

.book-meta p {
  margin: 0.5rem 0;
}

.book-price {
  font-size: 1.2rem;
  color: #f56c6c;
}

.book-description, .seller-info {
  margin-bottom: 1.5rem;
}

.book-description h3, .seller-info h3 {
  margin-bottom: 0.5rem;
  color: #409EFF;
}

.book-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.login-alert {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .book-actions {
    flex-direction: column;
  }
  
  .book-actions .el-button {
    width: 100%;
  }
}
</style> 