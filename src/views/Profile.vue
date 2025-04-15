<template>
  <div class="profile-container">
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
    
    <!-- 個人資料 -->
    <div v-else class="profile-content">
      <h1 class="page-title">個人資料</h1>
      
      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- 基本資料 -->
        <el-tab-pane label="基本資料" name="basic">
          <el-form 
            ref="profileForm" 
            :model="profileForm" 
            :rules="rules" 
            label-position="top"
            class="profile-form"
          >
            <!-- 頭像 -->
            <div class="avatar-container">
              <el-avatar 
                :size="100" 
                :src="profileForm.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
              />
              <el-upload
                class="avatar-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
              >
                <el-button size="small" type="primary">更換頭像</el-button>
              </el-upload>
            </div>
            
            <!-- 用戶名 -->
            <el-form-item label="用戶名" prop="username">
              <div class="el-input">
                <input 
                  type="text"
                  class="el-input__inner"
                  v-model="profileForm.username"
                />
              </div>
            </el-form-item>
            
            <!-- 電子郵件 -->
            <el-form-item label="電子郵件" prop="email">
              <div class="el-input">
                <input 
                  type="email"
                  class="el-input__inner"
                  v-model="profileForm.email"
                  disabled
                />
              </div>
              <div class="form-hint">電子郵件無法修改</div>
            </el-form-item>
            
            <!-- 手機號碼 -->
            <el-form-item label="手機號碼" prop="phone">
              <div class="el-input">
                <input 
                  type="tel"
                  class="el-input__inner"
                  v-model="profileForm.phone"
                />
              </div>
            </el-form-item>
            
            <!-- 系所 -->
            <el-form-item label="系所" prop="department">
              <div class="el-input el-select">
                <select 
                  class="el-input__inner"
                  v-model="profileForm.department"
                >
                  <option value="" disabled selected>請選擇系所</option>
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
            
            <!-- 自我介紹 -->
            <el-form-item label="自我介紹" prop="bio">
              <div class="el-input">
                <textarea 
                  class="el-textarea__inner"
                  v-model="profileForm.bio"
                  rows="4"
                  placeholder="簡單介紹一下自己吧..."
                ></textarea>
              </div>
            </el-form-item>
            
            <!-- 保存按鈕 -->
            <el-form-item>
              <el-button 
                type="primary" 
                @click="saveProfile" 
                :loading="saveLoading"
              >
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 修改密碼 -->
        <el-tab-pane label="修改密碼" name="password">
          <el-form 
            ref="passwordForm" 
            :model="passwordForm" 
            :rules="passwordRules" 
            label-position="top"
            class="password-form"
          >
            <!-- 當前密碼 -->
            <el-form-item label="當前密碼" prop="currentPassword">
              <div class="el-input">
                <input 
                  type="password"
                  class="el-input__inner"
                  v-model="passwordForm.currentPassword"
                  placeholder="請輸入當前密碼"
                />
              </div>
            </el-form-item>
            
            <!-- 新密碼 -->
            <el-form-item label="新密碼" prop="newPassword">
              <div class="el-input">
                <input 
                  type="password"
                  class="el-input__inner"
                  v-model="passwordForm.newPassword"
                  placeholder="請輸入新密碼"
                />
              </div>
            </el-form-item>
            
            <!-- 確認新密碼 -->
            <el-form-item label="確認新密碼" prop="confirmPassword">
              <div class="el-input">
                <input 
                  type="password"
                  class="el-input__inner"
                  v-model="passwordForm.confirmPassword"
                  placeholder="請再次輸入新密碼"
                />
              </div>
            </el-form-item>
            
            <!-- 保存按鈕 -->
            <el-form-item>
              <el-button 
                type="primary" 
                @click="changePassword" 
                :loading="passwordLoading"
              >
                修改密碼
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 我的統計 -->
        <el-tab-pane label="我的統計" name="stats">
          <div class="stats-container">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8">
                <el-card class="stats-card">
                  <template #header>
                    <div class="stats-header">
                      <span>發佈的書籍</span>
                    </div>
                  </template>
                  <div class="stats-value">{{ stats.booksCount || 0 }}</div>
                </el-card>
              </el-col>
              
              <el-col :xs="24" :sm="8">
                <el-card class="stats-card">
                  <template #header>
                    <div class="stats-header">
                      <span>已售出</span>
                    </div>
                  </template>
                  <div class="stats-value">{{ stats.soldCount || 0 }}</div>
                </el-card>
              </el-col>
              
              <el-col :xs="24" :sm="8">
                <el-card class="stats-card">
                  <template #header>
                    <div class="stats-header">
                      <span>已購買</span>
                    </div>
                  </template>
                  <div class="stats-value">{{ stats.boughtCount || 0 }}</div>
                </el-card>
              </el-col>
            </el-row>
            
            <div class="join-date">
              <p>加入時間：{{ formatDate(userInfo.createdAt) }}</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProfileView',
  
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    
    // 標籤頁
    const activeTab = ref('basic');
    
    // 表單引用
    const profileForm = ref({
      username: '',
      email: '',
      phone: '',
      department: '',
      bio: '',
      avatar: ''
    });
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // 統計數據
    const stats = ref({
      booksCount: 0,
      soldCount: 0,
      boughtCount: 0
    });
    
    // 加載狀態
    const loading = ref(false);
    const saveLoading = ref(false);
    const passwordLoading = ref(false);
    const error = ref('');
    
    // 從 store 獲取用戶信息
    const userInfo = computed(() => store.getters['auth/currentUser'] || {});
    
    // 表單驗證規則
    const rules = {
      username: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        { min: 3, max: 20, message: '長度在 3 到 20 個字符', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^[0-9]{10}$/, message: '請輸入有效的手機號碼', trigger: 'blur' }
      ]
    };
    
    // 密碼表單驗證規則
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入新密碼'));
      } else {
        if (passwordForm.value.confirmPassword !== '') {
          if (value !== passwordForm.value.confirmPassword) {
            callback(new Error('兩次輸入密碼不一致'));
          }
        }
        callback();
      }
    };
    
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請再次輸入新密碼'));
      } else if (value !== passwordForm.value.newPassword) {
        callback(new Error('兩次輸入密碼不一致'));
      } else {
        callback();
      }
    };
    
    const passwordRules = {
      currentPassword: [
        { required: true, message: '請輸入當前密碼', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '請輸入新密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少為 6 個字符', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '請再次輸入新密碼', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
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
    
    // 處理頭像上傳
    const handleAvatarChange = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileForm.value.avatar = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    };
    
    // 保存個人資料
    const saveProfile = async () => {
      const formEl = proxy.$refs.profileForm;
      if (!formEl) return;
      
      await formEl.validate(async (valid) => {
        if (valid) {
          try {
            saveLoading.value = true;
            
            // 調用store action更新個人資料
            await store.dispatch('auth/updateProfile', profileForm.value);
            
            proxy.$notifySucceed('個人資料已更新');
          } catch (error) {
            proxy.$notifyError('更新個人資料失敗: ' + (error.message || '未知錯誤'));
          } finally {
            saveLoading.value = false;
          }
        } else {
          return false;
        }
      });
    };
    
    // 修改密碼
    const changePassword = async () => {
      const formEl = proxy.$refs.passwordForm;
      if (!formEl) return;
      
      await formEl.validate(async (valid) => {
        if (valid) {
          try {
            passwordLoading.value = true;
            
            // 調用store action修改密碼
            await store.dispatch('auth/changePassword', passwordForm.value);
            
            // 清空表單
            passwordForm.value = {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            };
            
            proxy.$notifySucceed('密碼已成功修改');
          } catch (error) {
            proxy.$notifyError('修改密碼失敗: ' + (error.message || '未知錯誤'));
          } finally {
            passwordLoading.value = false;
          }
        } else {
          return false;
        }
      });
    };
    
    // 獲取用戶資料和統計數據
    const fetchUserData = async () => {
      try {
        loading.value = true;
        
        // 獲取最新的用戶信息
        await store.dispatch('auth/fetchCurrentUser');
        
        // 填充表單
        profileForm.value = {
          username: userInfo.value.username || '',
          email: userInfo.value.email || '',
          phone: userInfo.value.phone || '',
          department: userInfo.value.department || '',
          bio: userInfo.value.bio || '',
          avatar: userInfo.value.avatar || ''
        };
        
        // 獲取交易統計
        const statsData = await store.dispatch('transactions/fetchTransactionStats');
        
        // 更新統計數據
        stats.value = {
          booksCount: statsData.booksCount || 0,
          soldCount: statsData.soldCount || 0,
          boughtCount: statsData.boughtCount || 0
        };
        
        error.value = '';
      } catch (err) {
        error.value = '獲取用戶資料失敗: ' + (err.message || '未知錯誤');
      } finally {
        loading.value = false;
      }
    };
    
    // 在組件掛載時獲取用戶資料
    onMounted(() => {
      fetchUserData();
    });
    
    return {
      activeTab,
      profileForm,
      passwordForm,
      stats,
      loading,
      saveLoading,
      passwordLoading,
      error,
      userInfo,
      rules,
      passwordRules,
      formatDate,
      handleAvatarChange,
      saveProfile,
      changePassword
    };
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  margin-bottom: 2rem;
  color: #303133;
}

.loading-container, .error-alert {
  margin-bottom: 2rem;
}

.profile-tabs {
  margin-bottom: 2rem;
}

.profile-form, .password-form {
  max-width: 600px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.form-hint {
  font-size: 0.8rem;
  color: #909399;
  margin-top: 0.5rem;
}

.stats-container {
  padding: 1rem 0;
}

.stats-card {
  margin-bottom: 1.5rem;
  text-align: center;
}

.stats-header {
  font-size: 1rem;
  color: #606266;
}

.stats-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #409EFF;
  padding: 1rem 0;
}

.join-date {
  text-align: center;
  color: #909399;
  margin-top: 2rem;
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

.el-input__inner:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
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