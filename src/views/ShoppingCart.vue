<template>
  <div class="shoppingCart">
    <div class="cart-header">
      <div class="cart-header-content">
        <p>
          <i class="el-icon-shopping-cart-full" style="color:#ff6700; font-weight: 600;"></i>
          我的購物車
        </p>
        <span>温馨提示：產品是否購買成功，以最終下單為準哦，請儘快結算</span>
      </div>
    </div>

    <div class="content" v-if="getShoppingCart && getShoppingCart.length > 0">
      <ul>
        <li class="header">
          <div class="pro-check">
            <el-checkbox v-model="isAllCheck">全選</el-checkbox>
          </div>
          <div class="pro-img"></div>
          <div class="pro-name">商品名稱</div>
          <div class="pro-price">單價</div>
          <div class="pro-num">數量</div>
          <div class="pro-total">小計</div>
          <div class="pro-action">操作</div>
        </li>

        <li class="product-list" v-for="(item, index) in getShoppingCart" :key="item.id">
          <div class="pro-check">
            <el-checkbox :value="item.check" @change="checkChange($event, index)"></el-checkbox>
          </div>
          <div class="pro-img">
            <router-link :to="{ path: '/goods/details', query: {productID:item.productID} }">
              <img :src="$target + item.productImg" />
            </router-link>
          </div>
          <div class="pro-name">
            <router-link
              :to="{ path: '/goods/details', query: {productID:item.productID} }"
            >{{item.productName}}</router-link>
          </div>
          <div class="pro-price">{{item.price}}元</div>
          <div class="pro-num">
            <el-input-number
              size="small"
              :value="item.num"
              @change="handleChange($event, index, item.productID)"
              :min="1"
              :max="item.maxNum"
            ></el-input-number>
          </div>
          <div class="pro-total pro-total-in">{{item.price * item.num}}元</div>
          <div class="pro-action">
            <el-popover placement="right">
              <p>確定刪除嗎？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button
                  type="primary"
                  size="small"
                  @click="deleteItem($event, item.id, item.productID)"
                >確定</el-button>
              </div>
              <i class="el-icon-error" slot="reference" style="font-size: 18px;"></i>
            </el-popover>
          </div>
        </li>
      </ul>
      <div style="height:20px;background-color: #f5f5f5"></div>
      <div class="cart-bar">
        <div class="cart-bar-left">
          <span>
            <router-link to="/goods">繼續購物</router-link>
          </span>
          <span class="sep">|</span>
          <span class="cart-total">
            共
            <span class="cart-total-num">{{getNum}}</span> 件商品，已選擇
            <span class="cart-total-num">{{getCheckNum}}</span> 件
          </span>
        </div>
        <div class="cart-bar-right">
          <span>
            <span class="total-price-title">合計：</span>
            <span class="total-price">{{getTotalPrice}}元</span>
          </span>
          <router-link :to="getCheckNum > 0 ? '/confirmOrder' : ''">
            <div :class="getCheckNum > 0 ? 'btn-primary' : 'btn-primary-disabled'">結帳</div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="cart-empty">
      <div class="empty">
        <h2>您的購物車還是空的！</h2>
        <p>快去購物吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const getShoppingCart = computed(() => store.getters.getShoppingCart);
    const getCheckNum = computed(() => store.getters.getCheckNum);
    const getTotalPrice = computed(() => store.getters.getTotalPrice);
    const getNum = computed(() => store.getters.getNum);
    const isAllCheck = computed({
      get() {
        return store.getters.getIsAllCheck;
      },
      set(val) {
        store.dispatch("checkAll", val);
      }
    });

    const handleChange = (currentValue, key, productID) => {
      store.dispatch("updateShoppingCart", { key: key, prop: "check", val: true });
      axios.post("https://bookswapnutc-server.zeabur.app/user/shoppingCart/updateShoppingCart", {
        user_id: store.getters.getUser?.user_id || '',
        product_id: productID,
        num: currentValue
      })
      .then(res => {
        switch (res.data.code) {
          case "001":
            store.dispatch("updateShoppingCart", {
              key: key,
              prop: "num",
              val: currentValue
            });
            notifySucceed(res.data.msg);
            break;
          default:
            notifyError(res.data.msg);
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
    };

    const checkChange = (val, key) => {
      store.dispatch("updateShoppingCart", { key: key, prop: "check", val: val });
    };

    const deleteItem = (e, id, productID) => {
      axios.post("https://bookswapnutc-server.zeabur.app/user/shoppingCart/deleteShoppingCart", {
        user_id: store.getters.getUser?.user_id || '',
        product_id: productID
      })
      .then(res => {
        switch (res.data.code) {
          case "001":
            store.dispatch("deleteShoppingCart", id);
            notifySucceed(res.data.msg);
            break;
          default:
            notifyError(res.data.msg);
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
    };

    return {
      getShoppingCart,
      getCheckNum,
      getTotalPrice,
      getNum,
      isAllCheck,
      handleChange,
      checkChange,
      deleteItem
    };
  }
});
</script>

<style scoped>
.shoppingCart {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
.shoppingCart .cart-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}
.shoppingCart .cart-header .cart-header-content {
  width: 1225px;
  margin: 0 auto;
}
.shoppingCart .cart-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}
.shoppingCart .cart-header span {
  color: #757575;
  font-size: 12px;
  float: left;
  height: 20px;
  line-height: 20px;
  margin-top: 30px;
  margin-left: 15px;
}
.shoppingCart .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
}
.shoppingCart .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}
.shoppingCart .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}
.shoppingCart .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}
.shoppingCart .content ul .pro-check {
  float: left;
  height: 85px;
  width: 110px;
}
.shoppingCart .content ul .pro-check .el-checkbox {
  font-size: 16px;
  margin-left: 24px;
}
.shoppingCart .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
}
.shoppingCart .content ul .pro-img img {
  height: 80px;
  width: 80px;
}
.shoppingCart .content ul .pro-name {
  float: left;
  width: 380px;
}
.shoppingCart .content ul .pro-name a {
  color: #424242;
}
.shoppingCart .content ul .pro-name a:hover {
  color: #ff6700;
}
.shoppingCart .content ul .pro-price {
  float: left;
  width: 140px;
  padding-right: 18px;
  text-align: center;
}
.shoppingCart .content ul .pro-num {
  float: left;
  width: 150px;
  text-align: center;
}
.shoppingCart .content ul .pro-total {
  float: left;
  width: 120px;
  padding-right: 81px;
  text-align: right;
}
.shoppingCart .content ul .pro-total-in {
  color: #ff6700;
}
.shoppingCart .content ul .pro-action {
  float: left;
  width: 80px;
  text-align: center;
}
.shoppingCart .content ul .pro-action i:hover {
  color: #ff6700;
}
.shoppingCart .cart-bar {
  width: 1225px;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}
.shoppingCart .cart-bar .cart-bar-left {
  float: left;
}
.shoppingCart .cart-bar .cart-bar-left a {
  line-height: 50px;
  margin-left: 32px;
  color: #757575;
}
.shoppingCart .cart-bar .cart-bar-left a:hover {
  color: #ff6700;
}
.shoppingCart .cart-bar .cart-bar-left .sep {
  color: #eee;
  margin: 0 20px;
}
.shoppingCart .cart-bar .cart-bar-left .cart-total {
  color: #757575;
}
.shoppingCart .cart-bar .cart-bar-left .cart-total-num {
  color: #ff6700;
}
.shoppingCart .cart-bar .cart-bar-right {
  float: right;
}
.shoppingCart .cart-bar .cart-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}
.shoppingCart .cart-bar .cart-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}
.shoppingCart .cart-bar .cart-bar-right .btn-primary {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #ff6700;
  color: #fff;
}
.shoppingCart .cart-bar .cart-bar-right .btn-primary-disabled {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #e0e0e0;
  color: #b0b0b0;
}
.shoppingCart .cart-bar .cart-bar-right .btn-primary:hover {
  background-color: #f25807;
}
.shoppingCart .cart-empty {
  width: 1225px;
  margin: 0 auto;
}
.shoppingCart .cart-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.shoppingCart .cart-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}
.shoppingCart .cart-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
</style>