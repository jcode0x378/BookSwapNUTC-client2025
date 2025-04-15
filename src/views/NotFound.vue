<template>
  <div class="not-found-container">
    <el-result
      icon="error"
      title="404"
      sub-title="抱歉，您訪問的頁面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">返回首頁</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NotFoundView',
  
  setup() {
    const router = useRouter();
    
    const goHome = () => {
      router.push('/');
    };
    
    return {
      goHome
    };
  }
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}
</style> 