<template>
  <div class="add-book-container">
    <div class="page-header">
      <h1 class="page-title">新增書籍</h1>
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
        <div class="el-input">
          <input 
            type="text"
            class="el-input__inner"
            v-model="bookForm.title" 
            placeholder="請輸入書籍標題"
          />
        </div>
      </el-form-item>
      
      <!-- 作者 -->
      <el-form-item label="作者" prop="author">
        <div class="el-input">
          <input 
            type="text"
            class="el-input__inner"
            v-model="bookForm.author" 
            placeholder="請輸入作者姓名"
          />
        </div>
      </el-form-item>
      
      <!-- ISBN -->
      <el-form-item label="ISBN" prop="isbn">
        <div class="el-input">
          <input 
            type="text"
            class="el-input__inner"
            v-model="bookForm.isbn" 
            placeholder="請輸入ISBN（選填）"
          />
        </div>
      </el-form-item>
      
      <!-- 價格 -->
      <el-form-item label="價格" prop="price">
        <div class="el-input">
          <input 
            type="number"
            class="el-input__inner"
            v-model="bookForm.price" 
            min="0"
            step="10"
            placeholder="請輸入價格"
          />
        </div>
      </el-form-item>
      
      <!-- 書籍狀態 -->
      <el-form-item label="書籍狀態" prop="condition">
        <div class="el-input el-select">
          <select 
            class="el-input__inner"
            v-model="bookForm.condition"
          >
            <option value="" disabled>請選擇書籍狀態</option>
            <option value="全新">全新</option>
            <option value="良好">良好</option>
            <option value="一般">一般</option>
            <option value="破損">破損</option>
          </select>
        </div>
      </el-form-item>
      
      <!-- 書籍描述 -->
      <el-form-item label="書籍描述" prop="description">
        <div class="el-input">
          <textarea 
            class="el-textarea__inner"
            v-model="bookForm.description" 
            rows="4"
            placeholder="請描述書籍的內容、適用課程、使用情況等信息..."
          ></textarea>
        </div>
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
          :loading="loading"
        >
          發佈書籍
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AddBookView',
  
  components: {
    Plus
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    
    // 表單引用
    const bookForm = ref({
      title: '',
      author: '',
      isbn: '',
      price: 100,
      condition: '良好',
      description: '',
      images: []
    });
    
    // 加載狀態
    const loading = ref(false);
    
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
            loading.value = true;
            
            // 調用store action創建書籍
            await store.dispatch('books/createBook', bookForm.value);
            
            proxy.$notifySucceed('書籍發佈成功');
            router.push('/my-books');
          } catch (error) {
            proxy.$notifyError('發佈書籍失敗: ' + (error.message || '未知錯誤'));
          } finally {
            loading.value = false;
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
      
      formEl.resetFields();
      bookForm.value.images = [];
    };
    
    return {
      bookForm,
      loading,
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
.add-book-container {
  max-width: 800px;
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

/* 自定義輸入框樣式 */
.el-input {
  position: relative;
  width: 100%;
}

.el-input__inner {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: 14px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  outline: none;
}

.el-input__inner:focus {
  border-color: #409EFF;
}

.el-input__inner::placeholder {
  color: #c0c4cc;
}

/* 下拉選擇框樣式 */
.el-select {
  position: relative;
  width: 100%;
}

.el-select .el-input__inner {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23606266'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 30px;
}

/* 文本域樣式 */
.el-textarea__inner {
  width: 100%;
  min-height: 80px;
  padding: 10px 15px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: 14px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.el-textarea__inner:focus {
  border-color: #409EFF;
}

.el-textarea__inner::placeholder {
  color: #c0c4cc;
}
</style> 