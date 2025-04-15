<template>
  <div class="confirmOrder">
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>確認訂單</p>
        <router-link to></router-link>
      </div>
    </div>

    <div class="content">
      <div class="section-address">
        <p class="title">收貨地址</p>
        <div class="address-body">
          <ul>
            <li
              :class="item.id == confirmAddress ? 'in-section' : ''"
              v-for="item in address"
              :key="item.id"
            >
              <h2>{{item.name}}</h2>
              <p class="phone">{{item.phone}}</p>
              <p class="address">{{item.address}}</p>
            </li>
            <li class="add-address">
              <i class="el-icon-circle-plus-outline"></i>
              <p>添加新地址</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="section-goods">
        <p class="title">商品及優惠券</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckGoods" :key="item.id">
              <img :src="$target + item.productImg" />
              <span class="pro-name">{{item.productName}}</span>
              <span class="pro-price">{{item.price}}元 x {{item.num}}</span>
              <span class="pro-status"></span>
              <span class="pro-total">{{item.price * item.num}}元</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="section-shipment">
        <p class="title">運送方式</p>
        <p class="shipment">含運費</p>
      </div>

      <div class="section-invoice">
        <p class="title">發票</p>
        <p class="invoice">電子發票</p>
        <p class="invoice">個人</p>
        <p class="invoice">商品明細</p>
      </div>

      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{getCheckNum}}件</span>
            </li>
            <li>
              <span class="title">商品總價：</span>
              <span class="value">{{getTotalPrice}}元</span>
            </li>
            <li>
              <span class="title">活動優惠：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">優惠券抵扣：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">運費：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">應付總額：</span>
              <span class="value">
                <span class="total-price">{{getTotalPrice}}</span>元
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCart" class="btn-base btn-return">返回購物車</router-link>
          <a href="javascript:void(0);" @click="addOrder" class="btn-base btn-primary">結帳</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default defineComponent({
  setup() {
    const store = useStore();
    const confirmAddress = ref(1);
    const address = ref([
      {
        id: 1,
        name: "曾子涵",
        phone: "0912345678",
        address: "408台中市南屯區培德路11號"
      },
      {
        id: 2,
        name: "張瑜桓",
        phone: "0987654321",
        address: "408台中市南屯區培德路11號"
      }
    ]);

    const getCheckNum = computed(() => store.getters.getCheckNum);
    const getTotalPrice = computed(() => store.getters.getTotalPrice);
    const getCheckGoods = computed(() => store.getters.getCheckGoods);

    onMounted(() => {
      if (getCheckNum.value < 1) {
        notifyError("請勾選商品後再結算");
        this.$router.push({ path: "/shoppingCart" });
      }
    });

    const addOrder = () => {
      createTransaction();
    };

    const createTransaction = async () => {
      try {
        const response = await axios.post('/payment/create');
        document.body.innerHTML = response.data;
      } catch (error) {
        //console.error('Error creating transaction:', error);
      }
    };

    return {
      confirmAddress,
      address,
      getCheckNum,
      getTotalPrice,
      getCheckGoods,
      addOrder
    };
  }
});
</script>

<style scoped>
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
.confirmOrder .confirmOrder-header {
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
  margin-bottom: 20px;
}
.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  margin: 0 auto;
  height: 80px;
}
.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}
.confirmOrder .confirmOrder-header .header-content p i {
  font-size: 45px;
  color: #ff6700;
  line-height: 80px;
}
.confirmOrder .content {
  width: 1225px;
  margin: 0 auto;
  padding: 48px 0 0;
  background-color: #fff;
}
.confirmOrder .content .section-address {
  margin: 0 48px;
  overflow: hidden;
}
.confirmOrder .content .section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}
.confirmOrder .content .address-body li {
  float: left;
  color: #333;
  width: 220px;
  height: 178px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}
.confirmOrder .content .address-body .in-section {
  border: 1px solid #ff6700;
}
.confirmOrder .content .address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}
.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}
.confirmOrder .content .address-body li .address {
  padding: 10px 0;
  max-width: 180px;
  max-height: 88px;
  line-height: 22px;
  overflow: hidden;
}
.confirmOrder .content .address-body .add-address {
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}
.confirmOrder .content .section-goods {
  margin: 0 48px;
}
.confirmOrder .content .section-goods p.title {
  color: #333;
  font-size: 18px;
  line-height: 40px;
}
.confirmOrder .content .section-goods .goods-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.confirmOrder .content .section-goods .goods-list li {
  padding: 10px 0;
  color: #424242;
  overflow: hidden;
}
.confirmOrder .content .section-goods .goods-list li img {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.confirmOrder .content .section-goods .goods-list li .pro-name {
  float: left;
  width: 650px;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-price {
  float: left;
  width: 150px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-status {
  float: left;
  width: 99px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-total {
  float: left;
  width: 190px;
  text-align: center;
  color: #ff6700;
  line-height: 30px;
}
.confirmOrder .content .section-shipment {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}
.confirmOrder .content .section-shipment .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-shipment .shipment {
  float: left;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}
.confirmOrder .content .section-invoice {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}
.confirmOrder .content .section-invoice .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-invoice .invoice {
  float: left;
  line-height: 38px;
  font-size: 14px;
  margin-right: 20px;
  color: #ff6700;
}
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
  float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}
</style>