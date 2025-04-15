<template>
  <div class="payment-container">
    <h1 class="page-title">訂單付款</h1>
    
    <!-- 付款進度條 -->
    <div class="payment-progress">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="確認訂單" />
        <el-step title="選擇付款方式" />
        <el-step title="輸入付款資訊" />
        <el-step title="完成付款" />
      </el-steps>
    </div>
    
    <!-- 訂單摘要 -->
    <div v-if="orderInfo" class="order-summary">
      <h2>訂單摘要</h2>
      <div class="order-details">
        <div class="book-info" v-if="orderInfo.book">
          <div class="book-cover">
            <img :src="orderInfo.book.image || 'https://dummyimage.com/150x200/cccccc/666666&text=No+Image'" 
                 :alt="orderInfo.book.title" />
          </div>
          <div class="book-details">
            <h3>{{ orderInfo.book.title }}</h3>
            <p class="author">作者：{{ orderInfo.book.author }}</p>
            <p class="price">價格：NT$ {{ orderInfo.amount }}</p>
            <p class="order-no">訂單編號：{{ orderInfo.orderNo }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 步驟1：確認訂單 -->
    <div v-if="currentStep === 0" class="step-content">
      <h2>確認訂單資訊</h2>
      <p>請確認您的訂單資訊無誤，點擊下一步進行付款。</p>
      <el-button type="primary" @click="goToNextStep">下一步：選擇付款方式</el-button>
    </div>
    
    <!-- 步驟2：選擇付款方式 -->
    <div v-else-if="currentStep === 1" class="step-content">
      <h2>選擇付款方式</h2>
      <div class="payment-methods">
        <div 
          class="payment-method-option" 
          :class="{ selected: selectedPaymentMethod === 'CREDIT' }"
          @click="selectPaymentMethod('CREDIT')"
          data-method="CREDIT"
        >
          <i class="el-icon-credit-card"></i>
          <div class="method-details">
            <h3>信用卡付款</h3>
            <p>使用Visa、MasterCard、JCB信用卡付款</p>
          </div>
        </div>
        
        <div 
          class="payment-method-option" 
          :class="{ selected: selectedPaymentMethod === 'ATM' }"
          @click="selectPaymentMethod('ATM')"
          data-method="ATM"
        >
          <i class="el-icon-money"></i>
          <div class="method-details">
            <h3>ATM轉帳</h3>
            <p>使用ATM或網路銀行轉帳</p>
          </div>
        </div>
        
        <div 
          class="payment-method-option" 
          :class="{ selected: selectedPaymentMethod === 'CVS' }"
          @click="selectPaymentMethod('CVS')"
          data-method="CVS"
        >
          <i class="el-icon-shopping-bag-1"></i>
          <div class="method-details">
            <h3>超商代碼付款</h3>
            <p>至7-11、全家、萊爾富、OK超商繳款</p>
          </div>
        </div>
      </div>
      
      <div class="step-buttons">
        <el-button @click="goToPrevStep">上一步</el-button>
        <el-button type="primary" @click="goToNextStep" :disabled="!selectedPaymentMethod">
          下一步：輸入付款資訊
        </el-button>
      </div>
    </div>
    
    <!-- 步驟3：輸入付款資訊 -->
    <div v-else-if="currentStep === 2" class="step-content">
      <h2>輸入付款資訊</h2>
      
      <!-- 信用卡付款表單 -->
      <div v-if="selectedPaymentMethod === 'CREDIT'" class="payment-form credit-form">
        <div class="form-group">
          <label>持卡人姓名</label>
          <el-input v-model="paymentForm.cardName" placeholder="請輸入持卡人姓名" />
        </div>
        <div class="form-group">
          <label>卡號</label>
          <el-input v-model="paymentForm.cardNumber" placeholder="請輸入信用卡卡號" maxlength="16" />
        </div>
        <div class="form-row">
          <div class="form-group half">
            <label>有效期限 (MM/YY)</label>
            <el-input v-model="paymentForm.cardExpiry" placeholder="MM/YY" maxlength="5" />
          </div>
          <div class="form-group half">
            <label>CVV</label>
            <el-input v-model="paymentForm.cardCvv" placeholder="請輸入CVV碼" maxlength="3" type="password" />
          </div>
        </div>
        
        <!-- 測試信用卡資訊 -->
        <div class="test-card-info">
          <h4>測試用信用卡資訊</h4>
          <div class="test-card-table">
            <table>
              <thead>
                <tr>
                  <th>卡片類型</th>
                  <th>測試卡號</th>
                  <th>安全碼</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>一般信用卡</td>
                  <td class="card-number" @click="copyCardInfo('4311-9522-2222-2222')">4311-9522-2222-2222</td>
                  <td>任意三碼數字</td>
                </tr>
                <tr>
                  <td>圓夢彈性分期信用卡</td>
                  <td class="card-number" @click="copyCardInfo('4938-1777-7777-7777')">4938-1777-7777-7777</td>
                  <td>任意三碼數字</td>
                </tr>
                <tr>
                  <td>海外信用卡</td>
                  <td class="card-number" @click="copyCardInfo('4000-2011-1111-1111')">4000-2011-1111-1111</td>
                  <td>任意三碼數字</td>
                </tr>
                <tr>
                  <td rowspan="2">美國運通信用卡</td>
                  <td class="card-number" @click="copyCardInfo('3403-532780-80900')">3403-532780-80900 (國內)</td>
                  <td rowspan="2">任意三碼數字</td>
                </tr>
                <tr>
                  <td class="card-number" @click="copyCardInfo('3712-222222-22222')">3712-222222-22222 (國外)</td>
                </tr>
              </tbody>
            </table>
            <p class="click-to-copy">點擊卡號可複製，有效期請輸入任意未過期日期</p>
          </div>
        </div>
      </div>
      
      <!-- ATM轉帳表單 -->
      <div v-else-if="selectedPaymentMethod === 'ATM'" class="payment-form atm-form">
        <p class="notice">
          請注意：選擇ATM轉帳後，系統將提供您一組銀行帳號，請在1天內完成轉帳。
        </p>
        <div class="simulated-info">
          <p><strong>銀行代碼：</strong> 812（台新銀行）</p>
          <p><strong>虛擬帳號：</strong> 12345678901234</p>
          <p><strong>付款金額：</strong> NT$ {{ orderInfo?.amount || 0 }}</p>
          <p><strong>繳費期限：</strong> {{ getExpireDate() }}</p>
        </div>
      </div>
      
      <!-- 超商代碼表單 -->
      <div v-else-if="selectedPaymentMethod === 'CVS'" class="payment-form cvs-form">
        <p class="notice">
          請注意：選擇超商代碼後，系統將提供您一組繳費代碼，請在3天內至超商完成繳費。
        </p>
        <div class="simulated-info">
          <p><strong>繳費代碼：</strong> 12345678</p>
          <p><strong>付款金額：</strong> NT$ {{ orderInfo?.amount || 0 }}</p>
          <p><strong>繳費期限：</strong> {{ getExpireDate(3) }}</p>
        </div>
      </div>
      
      <div class="step-buttons">
        <el-button @click="goToPrevStep">上一步</el-button>
        <el-button type="primary" @click="submitPayment" :loading="isProcessing">
          確認付款
        </el-button>
      </div>
    </div>
    
    <!-- 步驟4：完成付款 -->
    <div v-else-if="currentStep === 3" class="step-content">
      <div v-if="isSuccess" class="payment-success">
        <i class="el-icon-success success-icon"></i>
        <h2>付款成功！</h2>
        <div class="payment-details">
          <p><strong>訂單編號：</strong> {{ orderInfo?.orderNo }}</p>
          <p><strong>交易編號：</strong> {{ tradeNo }}</p>
          <p><strong>交易金額：</strong> NT$ {{ orderInfo?.amount }}</p>
          <p><strong>付款方式：</strong> {{ getPaymentMethodText() }}</p>
          <p><strong>交易時間：</strong> {{ getCurrentDateTime() }}</p>
        </div>
        <el-button type="primary" @click="goToOrders">查看我的訂單</el-button>
      </div>
      
      <div v-else-if="isError" class="payment-error">
        <i class="el-icon-error error-icon"></i>
        <h2>付款失敗</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="step-buttons">
          <el-button @click="resetPayment">重新付款</el-button>
          <el-button type="primary" @click="goToOrders">返回訂單列表</el-button>
        </div>
      </div>
    </div>
    
    <!-- 支付容器 -->
    <div v-if="!isSimulated && currentStep === 2" id="ECPayPayment" class="ecpay-container"></div>
    
    <!-- 加載中或處理中 -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="processing-content">
        <i class="el-icon-loading"></i>
        <p>處理付款中，請稍候...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

export default {
  name: 'PaymentProcess',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // 訂單ID和信息
    const orderId = ref(route.params.id);
    const orderInfo = ref(null);
    
    // 當前步驟
    const currentStep = ref(0);
    
    // 付款方式
    const selectedPaymentMethod = ref('CREDIT');
    
    // 付款表單
    const paymentForm = reactive({
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: ''
    });
    
    // 狀態
    const isLoading = ref(false);
    const isProcessing = ref(false);
    const isSuccess = ref(false);
    const isError = ref(false);
    const errorMessage = ref('');
    const tradeNo = ref('');
    
    // 是否為模擬支付
    const isSimulated = computed(() => {
      return process.env.NODE_ENV === 'development' || 
             orderInfo.value?.isSimulated === true;
    });
    
    // 獲取訂單信息
    const fetchOrderInfo = async () => {
      try {
        isLoading.value = true;
        
        const response = await api.get(`/orders/${orderId.value}`);
        orderInfo.value = response.data;
        
        console.log('獲取訂單信息:', orderInfo.value);
        
      } catch (error) {
        console.error('獲取訂單信息失敗:', error);
        errorMessage.value = error.response?.data?.message || '獲取訂單信息失敗';
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };
    
    // 選擇付款方式
    const selectPaymentMethod = (method) => {
      selectedPaymentMethod.value = method;
    };
    
    // 提交付款
    const submitPayment = async () => {
      isProcessing.value = true;
      
      try {
        // 模擬處理延遲
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 發送付款請求
        const response = await api.post('/payments/process-token', {
          payToken: 'SIMULATED_TOKEN_' + Date.now(),
          orderId: orderId.value,
          isSimulated: true,
          paymentMethod: selectedPaymentMethod.value
        });
        
        if (response.data.success) {
          tradeNo.value = response.data.tradeNo;
          isSuccess.value = true;
          currentStep.value = 3;
        } else {
          throw new Error(response.data.message || '付款處理失敗');
        }
      } catch (error) {
        console.error('付款處理錯誤:', error);
        errorMessage.value = error.message || '付款處理失敗，請稍後再試';
        isError.value = true;
        currentStep.value = 3;
      } finally {
        isProcessing.value = false;
      }
    };
    
    // 複製信用卡號到剪貼板
    const copyCardInfo = (cardNumber) => {
      // 移除破折號
      const cleanCardNumber = cardNumber.replace(/-/g, '');
      
      // 複製到剪貼板
      navigator.clipboard.writeText(cleanCardNumber)
        .then(() => {
          // 自動填入卡號
          paymentForm.cardNumber = cleanCardNumber;
          
          // 顯示複製成功提示
          alert('卡號已複製並填入表單！');
        })
        .catch(err => {
          console.error('複製失敗:', err);
          alert('複製失敗，請手動輸入卡號');
        });
    };
    
    // 下一步
    const goToNextStep = () => {
      currentStep.value++;
    };
    
    // 上一步
    const goToPrevStep = () => {
      currentStep.value--;
    };
    
    // 重置付款流程
    const resetPayment = () => {
      currentStep.value = 0;
      isError.value = false;
      errorMessage.value = '';
    };
    
    // 前往訂單列表
    const goToOrders = () => {
      router.push('/transactions');
    };
    
    // 獲取過期日期
    const getExpireDate = (days = 1) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toLocaleDateString('zh-TW');
    };
    
    // 獲取當前日期時間
    const getCurrentDateTime = () => {
      return new Date().toLocaleString('zh-TW');
    };
    
    // 獲取付款方式文字
    const getPaymentMethodText = () => {
      switch (selectedPaymentMethod.value) {
        case 'CREDIT':
          return '信用卡付款';
        case 'ATM':
          return 'ATM轉帳';
        case 'CVS':
          return '超商代碼付款';
        default:
          return '未知方式';
      }
    };
    
    // 生命週期鉤子
    onMounted(() => {
      fetchOrderInfo();
    });
    
    return {
      orderId,
      orderInfo,
      currentStep,
      selectedPaymentMethod,
      paymentForm,
      isLoading,
      isProcessing,
      isSuccess,
      isError,
      errorMessage,
      tradeNo,
      isSimulated,
      selectPaymentMethod,
      submitPayment,
      goToNextStep,
      goToPrevStep,
      resetPayment,
      goToOrders,
      getExpireDate,
      getCurrentDateTime,
      getPaymentMethodText,
      copyCardInfo
    };
  }
};
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #303133;
}

.payment-progress {
  margin-bottom: 2rem;
}

.order-summary {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f7f7f7;
}

.order-details {
  display: flex;
  flex-direction: column;
}

.book-info {
  display: flex;
  gap: 1rem;
}

.book-cover {
  width: 100px;
  height: 140px;
  overflow: hidden;
  border-radius: 4px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details {
  flex: 1;
}

.book-details h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.author, .price, .order-no {
  margin: 0.3rem 0;
  color: #606266;
}

.price {
  font-weight: bold;
  color: #409EFF;
}

.step-content {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.step-content h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap:.8rem;
  margin-bottom: 1.5rem;
}

.payment-method-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-option:hover {
  border-color: #409EFF;
  background-color: #f0f9ff;
}

.payment-method-option.selected {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.payment-method-option i {
  font-size: 2rem;
  margin-right: 1rem;
  color: #909399;
}

.payment-method-option.selected i {
  color: #409EFF;
}

.method-details {
  flex: 1;
}

.method-details h3 {
  margin: 0 0 0.3rem;
  font-size: 1.1rem;
}

.method-details p {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
}

.payment-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex: 1;
}

.notice {
  color: #e6a23c;
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #fdf6ec;
  margin-bottom: 1rem;
}

.simulated-info {
  padding: 1rem;
  border-radius: 4px;
  background-color: #f0f9eb;
}

.step-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.payment-success, .payment-error {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 5rem;
  color: #67c23a;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 5rem;
  color: #f56c6c;
  margin-bottom: 1rem;
}

.payment-details {
  text-align: left;
  max-width: 400px;
  margin: 1.5rem auto;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.payment-details p {
  margin: 0.5rem 0;
}

.error-message {
  color: #f56c6c;
  margin: 1rem 0;
}

.ecpay-container {
  margin: 1.5rem 0;
  min-height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 1rem;
}

.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.processing-content {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.processing-content i {
  font-size: 3rem;
  color: #409EFF;
  margin-bottom: 1rem;
}

/* 測試卡資訊樣式 */
.test-card-info {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f5f7fa;
  border: 1px dashed #c0c4cc;
}

.test-card-info h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #606266;
  text-align: center;
}

.test-card-table {
  overflow-x: auto;
}

.test-card-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.test-card-table th, 
.test-card-table td {
  padding: 0.8rem;
  border: 1px solid #dcdfe6;
  text-align: center;
}

.test-card-table th {
  background-color: #f2f6fc;
  font-weight: bold;
  color: #303133;
}

.test-card-table .card-number {
  font-family: monospace;
  color: #409EFF;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.test-card-table .card-number:hover {
  background-color: #ecf5ff;
  text-decoration: underline;
}

.click-to-copy {
  margin-top: 0.8rem;
  font-size: 0.8rem;
  color: #909399;
  text-align: center;
  font-style: italic;
}
</style>
