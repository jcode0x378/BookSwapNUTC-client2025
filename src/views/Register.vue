<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="register-title">註冊 BookSwapNUTC</h2>
      </template>
      
      <el-form 
        ref="registerForm" 
        :model="registerForm" 
        :rules="rules" 
        label-position="top"
        @submit.prevent="handleRegister"
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
        
        <!-- 用戶名 -->
        <el-form-item label="用戶名" prop="username">
          <div class="el-input">
            <input 
              type="text"
              class="el-input__inner"
              v-model="registerForm.username"
              placeholder="請輸入用戶名"
            />
          </div>
        </el-form-item>
        
        <!-- 電子郵件 -->
        <el-form-item label="電子郵件" prop="email">
          <div class="el-input">
            <input 
              type="email"
              class="el-input__inner"
              v-model="registerForm.email"
              placeholder="請輸入電子郵件"
            />
          </div>
        </el-form-item>
        
        <!-- 手機號碼 -->
        <el-form-item label="手機號碼" prop="phone">
          <div class="el-input">
            <input 
              type="tel"
              class="el-input__inner"
              v-model="registerForm.phone"
              placeholder="請輸入手機號碼 (選填)"
            />
          </div>
        </el-form-item>
        
        <!-- 系所 -->
        <el-form-item label="系所" prop="department">
          <div class="el-input el-select">
            <select 
              class="el-input__inner"
              v-model="registerForm.department"
            >
              <option value="" disabled selected>請選擇系所 (選填)</option>
              <option value="資訊管理系">資訊管理系</option>
              <option value="資訊工程系">資訊工程系</option>
              <option value="電機工程系">電機工程系</option>
              <option value="機械工程系">機械工程系</option>
              <option value="企業管理系">企業管理系</option>
              <option value="國際貿易系">國際貿易系</option>
              <option value="應用外語系">應用外語系</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </el-form-item>
        
        <!-- 密碼 -->
        <el-form-item label="密碼" prop="password">
          <div class="el-input">
            <input 
              type="password"
              class="el-input__inner"
              v-model="registerForm.password"
              placeholder="請輸入密碼"
            />
          </div>
        </el-form-item>
        
        <!-- 確認密碼 -->
        <el-form-item label="確認密碼" prop="confirmPassword">
          <div class="el-input">
            <input 
              type="password"
              class="el-input__inner"
              v-model="registerForm.confirmPassword"
              placeholder="請再次輸入密碼"
            />
          </div>
        </el-form-item>
        
        <!-- 註冊按鈕 -->
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit" 
            :loading="loading" 
            class="register-button"
          >
            註冊
          </el-button>
        </el-form-item>
        
        <!-- 登入連結 -->
        <div class="text-center mt-4">
          <p>已有帳號？ <router-link to="/login">立即登入</router-link></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'RegisterView',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const registerForm = ref({
      username: '',
      email: '',
      phone: '',
      department: '',
      password: '',
      confirmPassword: ''
    });
    
    // 表單驗證規則
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入密碼'));
      } else {
        if (registerForm.value.confirmPassword !== '') {
          // 如果確認密碼已填寫，則同時驗證確認密碼
          if (value !== registerForm.value.confirmPassword) {
            callback(new Error('兩次輸入密碼不一致'));
          }
        }
        callback();
      }
    };
    
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請再次輸入密碼'));
      } else if (value !== registerForm.value.password) {
        callback(new Error('兩次輸入密碼不一致'));
      } else {
        callback();
      }
    };
    
    const rules = {
      username: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        { min: 3, max: 20, message: '長度在 3 到 20 個字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '請輸入電子郵件', trigger: 'blur' },
        { type: 'email', message: '請輸入有效的電子郵件', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^09\d{8}$/, message: '請輸入有效的台灣手機號碼', trigger: 'blur' }
      ],
      department: [
        { message: '請選擇系所', trigger: 'change' }
      ],
      password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少為 6 個字符', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '請再次輸入密碼', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
    };
    
    // 從 store 獲取狀態
    const loading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/authError']);
    
    // 清除錯誤
    const clearError = () => {
      store.dispatch('auth/clearError');
    };
    
    // 處理註冊
    const handleRegister = async () => {
      try {
        // 移除確認密碼字段，因為後端不需要
        const { confirmPassword, ...userData } = registerForm.value;
        
        await store.dispatch('auth/register', userData);
        
        // 註冊成功後跳轉到登入頁面
        router.push('/login');
      } catch (error) {
        console.error('註冊失敗:', error);
      }
    };
    
    return {
      registerForm,
      rules,
      loading,
      error,
      clearError,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 450px;
}

.register-title {
  text-align: center;
  margin: 0;
  color: #409EFF;
}

.register-button {
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
</style> 