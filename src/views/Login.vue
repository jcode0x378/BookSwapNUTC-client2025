<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">登入 BookSwapNUTC</h2>
      </template>
      
      <el-form 
        ref="loginForm" 
        :model="loginForm" 
        :rules="rules" 
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <!-- 錯誤提示 -->
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="true"
          @close="clearError"
          class="mb-4"
        />
        
        <!-- 資料庫連接狀態提示 -->
        <el-alert
          v-if="dbChecked && !dbConnected"
          title="伺服器資料庫連接失敗，部分功能可能無法使用"
          type="warning"
          show-icon
          :closable="false"
          class="mb-4"
        />
        
        <!-- 電子郵件 -->
        <el-form-item label="電子郵件" prop="email">
          <div class="el-input">
            <input 
              type="email"
              class="el-input__inner"
              v-model="loginForm.email"
              placeholder="請輸入電子郵件"
              autocomplete="email"
            />
          </div>
        </el-form-item>
        
        <!-- 密碼 -->
        <el-form-item label="密碼" prop="password">
          <div class="el-input">
            <input 
              type="password"
              class="el-input__inner"
              v-model="loginForm.password"
              placeholder="請輸入密碼"
              autocomplete="current-password"
            />
          </div>
        </el-form-item>
        
        <!-- 登入按鈕 -->
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit" 
            :loading="loading" 
            class="login-button"
          >
            登入
          </el-button>
        </el-form-item>
        
        <!-- 註冊連結 -->
        <div class="text-center mt-4">
          <p>還沒有帳號？ <router-link to="/register">立即註冊</router-link></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'LoginView',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const loginForm = ref({
      email: '',
      password: ''
    });
    
    // 表單驗證規則
    const rules = {
      email: [
        { required: true, message: '請輸入電子郵件', trigger: 'blur' },
        { type: 'email', message: '請輸入有效的電子郵件', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少為 6 個字符', trigger: 'blur' }
      ]
    };
    
    // 從 store 獲取狀態
    const loading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/authError']);
    const dbConnected = computed(() => store.getters['system/isDbConnected']);
    const dbChecked = computed(() => store.getters['system/isDbChecked']);
    
    // 清除錯誤
    const clearError = () => {
      store.dispatch('auth/clearError');
    };
    
    // 處理登入
    const handleLogin = async () => {
      try {
        await store.dispatch('auth/login', loginForm.value);
        
        // 登入成功後重定向
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
      } catch (error) {
        console.error('登入失敗:', error);
      }
    };
    
    // 檢查資料庫連接狀態
    onMounted(() => {
      if (!dbChecked.value) {
        store.dispatch('system/checkDbStatus').catch(error => {
          console.warn('無法檢查資料庫狀態:', error);
        });
      }
    });
    
    return {
      loginForm,
      rules,
      loading,
      error,
      dbConnected,
      dbChecked,
      clearError,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #409EFF;
}

.login-button {
  width: 100%;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
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
</style> 