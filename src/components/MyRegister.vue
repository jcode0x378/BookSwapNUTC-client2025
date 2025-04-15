<template>
  <div id="register">
    <el-dialog title="註冊" width="300px" center v-model="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="請輸入帳號"
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請輸入密碼"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請再次輸入密碼"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%;">註冊</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, reactive, ref, watch } from 'vue';

export default defineComponent({
  name: "MyRegister",
  props: {
    register: Boolean,
  },
  setup(props, { emit }) {
    const isRegister = ref(props.register);
    const RegisterUser = reactive({
      name: "",
      pass: "",
      confirmPass: ""
    });

    const ruleForm = ref(null);

    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("請輸入用戶名"));
      }
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
      if (userNameRule.test(value)) {
        axios
          .post("https://bookswapnutc-server.zeabur.app/users/findUserName", {
            userName: RegisterUser.name
          })
          .then(res => {
            if (res.data.code == "001") {
              ruleForm.value.validateField("checkPass");
              return callback();
            } else {
              return callback(new Error(res.data.msg));
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
      } else {
        return callback(new Error("字母開頭,長度5-16之間,允許字母數字下劃線"));
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入密碼"));
      }
      const passwordRule = /^[a-zA-Z]\w{5,17}$/;
      if (passwordRule.test(value)) {
        ruleForm.value.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("字母開頭,長度6-18之間,允許字母數字和下劃線")
        );
      }
    };

    const validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入確認密碼"));
      }
      if (RegisterUser.pass != "" && value === RegisterUser.pass) {
        ruleForm.value.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("兩次輸入的密碼不一致"));
      }
    };

    const rules = {
      name: [{ validator: validateName, trigger: "blur" }],
      pass: [{ validator: validatePass, trigger: "blur" }],
      confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
    };

    watch(() => props.register, (val) => {
      isRegister.value = val;
    });

    watch(isRegister, (val) => {
      if (!val) {
        ruleForm.value.resetFields();
        emit("fromChild", val);
      }
    });

    const Register = () => {
      ruleForm.value.validate(valid => {
        if (valid) {
          axios
            .post("https://bookswapnutc-server.zeabur.app/users/register", {
              userName: RegisterUser.name,
              password: RegisterUser.pass
            })
            .then(res => {
              if (res.data.code === "001") {
                isRegister.value = false;
                notifySucceed(res.data.msg);
              } else {
                notifyError(res.data.msg);
              }
            })
            .catch(err => {
              return Promise.reject(err);
            });
        } else {
          return false;
        }
      });
    };

    const closeRegister = () => {
      isRegister.value = false;
      emit('fromChild', false);
    };

    return {
      isRegister,
      RegisterUser,
      ruleForm,
      rules,
      Register,
      closeRegister
    };
  }
});
</script>

<style>
</style>