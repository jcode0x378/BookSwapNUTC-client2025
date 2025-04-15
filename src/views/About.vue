<template>
  <div class="about-container">
    <el-card class="about-card">
      <template #header>
        <h2 class="about-title">關於 BookSwapNUTC</h2>
      </template>
      
      <div class="about-content">
        <p>BookSwapNUTC 是一個為台中科技大學學生設計的二手教科書交換平台。</p>

        <h3>平台特色</h3>
        <p>我們的使命是幫助學生節省教科書開支，同時減少資源浪費，促進校園內的資源共享和循環利用。</p>
        
        <ul>
          <li>專為 NUTC 學生設計，確保交易安全</li>
          <li>簡單易用的界面，方便快速發佈和查找書籍</li>
          <li>支持校內面交，減少運費和等待時間</li>
          <li>完整的交易記錄和評價系統，建立信任機制</li>
        </ul>
        
        <h3>聯絡我們</h3>
        <p>如果您有任何問題或建議，請透過下列方式聯絡我們：</p>
        <p>電子郵件：<a href="mailto:contact@bookswapnutc.com">jcode0x378@gmail.com</a></p>
        
        <p>BookSwapNUTC 由台中科技大學學生開發和維護。</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
};
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-title {
  text-align: center;
  color: #409EFF;
}

.about-content {
  line-height: 1.6;
}

.about-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #409EFF;
}

.about-content ul {
  padding-left: 1.5rem;
}

.about-content li {
  margin-bottom: 0.5rem;
}

.about-content a {
  color: #409EFF;
  text-decoration: none;
}

.about-content a:hover {
  text-decoration: underline;
}
</style>
