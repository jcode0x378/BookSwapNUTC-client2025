<template>
  <div class="order">
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
          我的訂單
        </p>
      </div>
    </div>

    <div class="order-content" v-if="orders.length > 0">
      <div class="content" v-for="(item, index) in orders" :key="index">
        <ul>
          <li class="order-info">
            <div class="order-id">訂單編號: {{item[0].order_id}}</div>
            <div class="order-time">訂單時間: {{item[0].order_time | dateFormat}}</div>
          </li>
          <li class="header">
            <div class="pro-img"></div>
            <div class="pro-name">商品名稱</div>
            <div class="pro-price">單價</div>
            <div class="pro-num">數量</div>
            <div class="pro-total">小計</div>
          </li>

          <li class="product-list" v-for="(product, i) in item" :key="i">
            <div class="pro-img">
              <router-link :to="{ path: '/goods/details', query: {productID:product.product_id} }">
                <img :src="$target + product.product_picture" />
              </router-link>
            </div>
            <div class="pro-name">
              <router-link
                :to="{ path: '/goods/details', query: {productID:product.product_id} }"
              >{{product.product_name}}</router-link>
            </div>
            <div class="pro-price">{{product.product_price}}元</div>
            <div class="pro-num">{{product.product_num}}</div>
            <div class="pro-total pro-total-in">{{product.product_price * product.product_num}}元</div>
          </li>
        </ul>
        <div class="order-bar">
          <div class="order-bar-left">
            <span class="order-total">
              共
              <span class="order-total-num">{{total[index].totalNum}}</span> 件商品
            </span>
          </div>
          <div class="order-bar-right">
            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{total[index].totalPrice}}元</span>
            </span>
          </div>
        </div>
      </div>
      <div style="margin-top:-40px;"></div>
    </div>

    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的訂單還是空的！</h2>
        <p>快去購物吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, getCurrentInstance, onActivated, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const orders = ref([]);
    const total = ref([]);
    const { proxy } = getCurrentInstance();

    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        store.dispatch('setUser', JSON.parse(user));
      }
    });

    onActivated(() => {
      axios.post("https://bookswapnutc-server.zeabur.app/user/order/getOrder", {
        user_id: store.getters.getUser?.user_id || ''
      })
      .then(res => {
        if (res.data.code === "001") {
          orders.value = res.data.orders;
        } else {
          proxy.$notifyError(res.data.msg);
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
    });

    watch(orders, (val) => {
      let totalArr = [];
      for (let i = 0; i < val.length; i++) {
        const element = val[i];

        let totalNum = 0;
        let totalPrice = 0;
        for (let j = 0; j < element.length; j++) {
          const temp = element[j];
          totalNum += temp.product_num;
          totalPrice += temp.product_price * temp.product_num;
        }
        totalArr.push({ totalNum, totalPrice });
      }
      total.value = totalArr;
    });

    return {
      orders,
      total
    };
  }
});
</script>

<style scoped>
.order {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
.order .order-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}
.order .order-header .order-header-content {
  width: 1225px;
  margin: 0 auto;
}
.order .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}
.order .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
  margin-bottom: 50px;
}
.order .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}
.order .content ul .order-info {
  height: 60px;
  line-height: 60px;
  padding: 0 26px;
  color: #424242;
  border-bottom: 1px solid #ff6700;
}
.order .content ul .order-info .order-id {
  float: left;
  color: #ff6700;
}
.order .content ul .order-info .order-time {
  float: right;
}
.order .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}
.order .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}
.order .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
  padding-left: 80px;
}
.order .content ul .pro-img img {
  height: 80px;
  width: 80px;
}
.order .content ul .pro-name {
  float: left;
  width: 380px;
}
.order .content ul .pro-name a {
  color: #424242;
}
.order .content ul .pro-name a:hover {
  color: #ff6700;
}
.order .content ul .pro-price {
  float: left;
  width: 160px;
  padding-right: 18px;
  text-align: center;
}
.order .content ul .pro-num {
  float: left;
  width: 190px;
  text-align: center;
}
.order .content ul .pro-total {
  float: left;
  width: 160px;
  padding-right: 81px;
  text-align: right;
}
.order .content ul .pro-total-in {
  color: #ff6700;
}
.order .order-bar {
  width: 1185px;
  padding: 0 20px;
  border-top: 1px solid #ff6700;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}
.order .order-bar .order-bar-left {
  float: left;
}
.order .order-bar .order-bar-left .order-total {
  color: #757575;
}
.order .order-bar .order-bar-left .order-total-num {
  color: #ff6700;
}
.order .order-bar .order-bar-right {
  float: right;
}
.order .order-bar .order-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}
.order .order-bar .order-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}
.order .order-empty {
  width: 1225px;
  margin: 0 auto;
}
.order .order-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.order .order-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}
.order .order-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
</style>