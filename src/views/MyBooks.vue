<template>
  <div class="my-books-container">
    <div class="page-header">
      <h1 class="page-title">我的書籍</h1>
      <el-button type="primary" @click="navigateTo('/add-book')">
        <el-icon><Plus /></el-icon> 新增書籍
      </el-button>
    </div>
    
    <!-- 標籤頁 -->
    <el-tabs v-model="activeTab" class="book-tabs">
      <el-tab-pane label="在售中" name="selling">
        <book-list 
          :books="sellingBooks" 
          :loading="loading" 
          :empty-text="'您目前沒有在售的書籍'"
          @view="viewBook"
          @edit="editBook"
          @delete="confirmDelete"
        />
      </el-tab-pane>
      
      <el-tab-pane label="已售出" name="sold">
        <book-list 
          :books="soldBooks" 
          :loading="loading" 
          :empty-text="'您還沒有售出任何書籍'"
          :show-actions="false"
          @view="viewBook"
        />
      </el-tab-pane>
    </el-tabs>
    
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
          <el-button type="danger" @click="deleteBook" :loading="deleteLoading">確定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BookList from '../components/books/BookList.vue';

export default {
  name: 'MyBooksView',
  
  components: {
    BookList,
    Plus
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    
    // 標籤頁
    const activeTab = ref('selling');
    
    // 刪除對話框
    const deleteDialogVisible = ref(false);
    const deleteLoading = ref(false);
    const bookToDelete = ref(null);
    
    // 加載狀態
    const loading = ref(false);
    
    // 從store獲取書籍數據
    const sellingBooks = computed(() => store.getters['books/sellingBooks']);
    const soldBooks = computed(() => store.getters['books/soldBooks']);
    
    // 導航到指定路由
    const navigateTo = (path) => {
      router.push(path);
    };
    
    // 查看書籍詳情
    const viewBook = (book) => {
      router.push(`/books/${book.id}`);
    };
    
    // 編輯書籍
    const editBook = (book) => {
      router.push(`/edit-book/${book.id}`);
    };
    
    // 確認刪除
    const confirmDelete = (book) => {
      bookToDelete.value = book;
      deleteDialogVisible.value = true;
    };
    
    // 刪除書籍
    const deleteBook = async () => {
      if (!bookToDelete.value) return;
      
      try {
        deleteLoading.value = true;
        
        // 調用store action刪除書籍
        await store.dispatch('books/deleteBook', bookToDelete.value.id);
        
        deleteDialogVisible.value = false;
        bookToDelete.value = null;
        
        proxy.$notifySucceed('書籍已成功刪除');
      } catch (error) {
        proxy.$notifyError('刪除書籍失敗: ' + (error.message || '未知錯誤'));
      } finally {
        deleteLoading.value = false;
      }
    };
    
    // 獲取我的書籍
    const fetchMyBooks = async () => {
      try {
        loading.value = true;
        
        // 調用store action獲取用戶書籍
        await store.dispatch('books/fetchUserBooks');
        
      } catch (error) {
        proxy.$notifyError('獲取書籍失敗: ' + (error.message || '未知錯誤'));
      } finally {
        loading.value = false;
      }
    };
    
    // 在組件掛載時獲取書籍
    onMounted(() => {
      fetchMyBooks();
    });
    
    return {
      activeTab,
      sellingBooks,
      soldBooks,
      loading,
      deleteDialogVisible,
      deleteLoading,
      navigateTo,
      viewBook,
      editBook,
      confirmDelete,
      deleteBook
    };
  }
};
</script>

<style scoped>
.my-books-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  margin: 0;
  color: #303133;
}

.book-tabs {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style> 