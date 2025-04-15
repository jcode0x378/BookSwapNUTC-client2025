<template>
  <div id="myLogin">
    <el-dialog title="登入" width="300px" center v-model="isLogin">
      <el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" placeholder="請輸入帳號" v-model="LoginUser.name"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請輸入密碼"
            v-model="LoginUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Login" style="width:100%;">登入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { userApi } from '../utils/api';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const formRef = ref(null);
    
    const loginForm = reactive({
      userName: '',
      password: ''
    });
    
    const rules = {
      userName: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        { min: 5, max: 16, message: '長度在5到16個字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 6, max: 18, message: '長度在6到18個字符', trigger: 'blur' }
      ]
    };

    const handleLogin = async () => {
      try {
        await formRef.value.validate();
        const { data } = await userApi.login(
          loginForm.userName,
          loginForm.password
        );
        
        if (data.code === '001') {
          store.dispatch('setUser', data.user);
          store.dispatch('setAuthToken', data.token);
          store.dispatch('setShowLogin', false);
          
          // 如果有重定向路徑，則跳轉
          const redirect = router.currentRoute.value.query.redirect;
          if (redirect) {
            router.push(redirect);
          }
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return {
      loginForm,
      rules,
      formRef,
      handleLogin
    };
  }
};
</script>

<style>
</style>