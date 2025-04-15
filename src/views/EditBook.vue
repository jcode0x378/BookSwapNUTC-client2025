<template>
  <div class="edit-book-container">
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
    
    <!-- 編輯表單 -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">編輯書籍</h1>
        <el-button @click="goBack" icon="arrow-left">返回</el-button>
      </div>
      
      <el-form 
        ref="bookForm" 
        :model="bookForm" 
        :rules="rules" 
        label-position="top"
        class="book-form"
      >
        <!-- 書籍標題 -->
        <el-form-item label="書籍標題" prop="title">
          <el-input v-model="bookForm.title" placeholder="請輸入書籍標題" />
        </el-form-item>
        
        <!-- 作者 -->
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author" placeholder="請輸入作者姓名" />
        </el-form-item>
        
        <!-- ISBN -->
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="bookForm.isbn" placeholder="請輸入ISBN（選填）" />
        </el-form-item>
        
        <!-- 價格 -->
        <el-form-item label="價格" prop="price">
          <el-input-number 
            v-model="bookForm.price" 
            :min="0" 
            :precision="0" 
            :step="10" 
            style="width: 100%;"
          />
        </el-form-item>
        
        <!-- 書籍狀態 -->
        <el-form-item label="書籍狀態" prop="condition">
          <el-select v-model="bookForm.condition" placeholder="請選擇書籍狀態" style="width: 100%;">
            <el-option label="全新" value="全新" />
            <el-option label="良好" value="良好" />
            <el-option label="一般" value="一般" />
            <el-option label="破損" value="破損" />
          </el-select>
        </el-form-item>
        
        <!-- 書籍描述 -->
        <el-form-item label="書籍描述" prop="description">
          <el-input 
            v-model="bookForm.description" 
            type="textarea" 
            rows="4"
            placeholder="請描述書籍的內容、適用課程、使用情況等信息..."
          />
        </el-form-item>
        
        <!-- 書籍圖片 -->
        <el-form-item label="書籍圖片">
          <el-upload
            class="book-image-uploader"
            action="#"
            :auto-upload="false"
            :limit="3"
            list-type="picture-card"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">最多上傳3張圖片，建議包含封面和內頁</div>
        </el-form-item>
        
        <!-- 提交按鈕 -->
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm" 
            :loading="saveLoading"
          >
            保存修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'EditBookView',
  
  components: {
    Plus
  },
  
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
    
    // 表單引用
    const bookForm = ref({
      title: '',
      author: '',
      isbn: '',
      price: 0,
      condition: '',
      description: '',
      images: []
    });
    
    // 文件列表
    const fileList = ref([]);
    
    // 加載狀態
    const loading = ref(false);
    const saveLoading = ref(false);
    const error = ref('');
    
    // 表單驗證規則
    const rules = {
      title: [
        { required: true, message: '請輸入書籍標題', trigger: 'blur' },
        { min: 2, max: 100, message: '長度在 2 到 100 個字符', trigger: 'blur' }
      ],
      author: [
        { required: true, message: '請輸入作者姓名', trigger: 'blur' },
        { min: 2, max: 50, message: '長度在 2 到 50 個字符', trigger: 'blur' }
      ],
      price: [
        { required: true, message: '請輸入價格', trigger: 'blur' },
        { type: 'number', min: 0, message: '價格必須大於等於0', trigger: 'blur' }
      ],
      condition: [
        { required: true, message: '請選擇書籍狀態', trigger: 'change' }
      ],
      description: [
        { max: 500, message: '描述不能超過500個字符', trigger: 'blur' }
      ]
    };
    
    // 返回上一頁
    const goBack = () => {
      router.back();
    };
    
    // 處理圖片上傳
    const handleImageChange = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        bookForm.value.images.push({
          id: Date.now(),
          url: e.target.result,
          file: file.raw
        });
      };
      reader.readAsDataURL(file.raw);
    };
    
    // 處理圖片移除
    const handleImageRemove = (file) => {
      bookForm.value.images = bookForm.value.images.filter(img => {
        if (img.url === file.url) return false;
        return true;
      });
    };
    
    // 提交表單
    const submitForm = async () => {
      const formEl = proxy.$refs.bookForm;
      if (!formEl) return;
      
      await formEl.validate(async (valid) => {
        if (valid) {
          try {
            saveLoading.value = true;
            
            // 調用store action更新書籍
            await store.dispatch('books/updateBook', {
              id: bookId.value,
              bookData: bookForm.value
            });
            
            proxy.$notifySucceed('書籍更新成功');
            router.push('/my-books');
          } catch (error) {
            proxy.$notifyError('更新書籍失敗: ' + (error.message || '未知錯誤'));
          } finally {
            saveLoading.value = false;
          }
        } else {
          proxy.$message.error('請填寫必要的信息');
          return false;
        }
      });
    };
    
    // 重置表單
    const resetForm = () => {
      const formEl = proxy.$refs.bookForm;
      if (!formEl) return;
      
      // 重置為原始數據，而不是空值
      fetchBookDetail();
    };
    
    // 獲取書籍詳情
    const fetchBookDetail = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // 調用store action獲取書籍詳情
        const bookData = await store.dispatch('books/fetchBook', bookId.value);
        
        // 填充表單
        bookForm.value = { ...bookData };
        
        // 設置文件列表
        fileList.value = bookData.images.map(img => ({
          name: `圖片${img.id}`,
          url: img.url
        }));
        
      } catch (err) {
        error.value = '獲取書籍詳情失敗: ' + (err.message || '未知錯誤');
      } finally {
        loading.value = false;
      }
    };
    
    // 在組件掛載時獲取書籍詳情
    onMounted(() => {
      fetchBookDetail();
    });
    
    return {
      bookId,
      bookForm,
      fileList,
      loading,
      saveLoading,
      error,
      rules,
      goBack,
      handleImageChange,
      handleImageRemove,
      submitForm,
      resetForm
    };
  }
};
</script>

<style scoped>
.edit-book-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-container, .error-alert {
  margin-bottom: 2rem;
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

.book-form {
  margin-bottom: 2rem;
}

.book-image-uploader {
  width: 100%;
}

.upload-tip {
  font-size: 0.8rem;
  color: #909399;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style> 