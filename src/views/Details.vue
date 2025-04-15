<template>
  <div id="details">
    <div class="page-header">
      <div class="title">
        <p>{{productDetails.product_name}}</p>
        <div class="list">
          <ul>
            <li>
              <router-link to>描述</router-link>
            </li>
            <li>
              <router-link to>簡介</router-link>
            </li>
            <li>
              <router-link to>評價</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="block">
        <el-carousel height="560px" v-if="productPicture.length > 1">
          <el-carousel-item v-for="item in productPicture" :key="item.id">
            <img style="height:560px;" :src="$target + item.product_picture" :alt="item.intro" />
          </el-carousel-item>
        </el-carousel>
        <div v-if="productPicture.length == 1">
          <img
            style="height:560px;"
            :src="$target + productPicture[0].product_picture"
            :alt="productPicture[0].intro"
          />
        </div>
      </div>

      <div class="content">
        <h1 class="name">{{productDetails.product_name}}</h1>
        <p class="intro">{{productDetails.product_intro}}</p>
        <p class="store">現貨無須等待</p>
        <div class="price">
          <span>{{productDetails.product_selling_price}}元</span>
          <span
            v-show="productDetails.product_price != productDetails.product_selling_price"
            class="del"
          >{{productDetails.product_price}}元</span>
        </div>
        <div class="pro-list">
          <span class="pro-name">{{productDetails.product_name}}</span>
          <span class="pro-price">
            <span>{{productDetails.product_selling_price}}元</span>
            <span
              v-show="productDetails.product_price != productDetails.product_selling_price"
              class="pro-del"
            >{{productDetails.product_price}}元</span>
          </span>
          <p class="price-sum">總計 : {{productDetails.product_selling_price}}元</p>
        </div>
        <div class="button">
          <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入購物車</el-button>
          <el-button class="like" @click="addCollect">喜歡</el-button>
        </div>
        <div class="pro-policy">
          <ul>
            <li>
              <i class="el-icon-circle-check"></i> NUTC
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 書本交換平台
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天無理由退貨
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天不滿意退貨
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();
    const { proxy } = getCurrentInstance();
    
    const productID = ref(0);
    const productDetails = ref({});
    const dis = ref(false);

    onMounted(() => {
      // 從路由參數獲取商品 ID
      productID.value = route.query.productID;
      
      // 獲取商品詳情
      axios.post("/product/getDetails", {
        productID: productID.value
      })
      .then(res => {
        if (res.data.code === "001") {
          productDetails.value = res.data.Product[0];
        }
      })
      .catch(err => {
        proxy.$notifyError('獲取商品詳情失敗');
        return Promise.reject(err);
      });
    });

    // 添加到購物車
    const addShoppingCart = () => {
      if (!store.getters.getUser) {
        store.dispatch("setShowLogin", true);
        return;
      }
      
      axios.post("/user/shoppingCart/addShoppingCart", {
        user_id: store.getters.getUser.user_id,
        product_id: productID.value
      })
      .then(res => {
        switch (res.data.code) {
          case "001":
            store.dispatch("unshiftShoppingCart", {
              id: res.data.id,
              productID: productID.value,
              productName: productDetails.value.product_name,
              productImg: productDetails.value.product_picture,
              price: productDetails.value.product_selling_price,
              num: 1,
              maxNum: productDetails.value.product_num,
              check: false
            });
            proxy.$notifySucceed(res.data.msg);
            break;
          case "002":
            store.dispatch("addShoppingCartNum", productID.value);
            proxy.$notifySucceed(res.data.msg);
            break;
          case "003":
            dis.value = true;
            proxy.$notifyError(res.data.msg);
            break;
          default:
            proxy.$notifyError(res.data.msg);
        }
      })
      .catch(err => {
        proxy.$notifyError('添加購物車失敗');
        return Promise.reject(err);
      });
    };

    // 添加到收藏
    const addCollect = () => {
      if (!store.getters.getUser) {
        store.dispatch("setShowLogin", true);
        return;
      }
      
      axios.post("/user/collect/addCollect", {
        user_id: store.getters.getUser.user_id,
        product_id: productID.value
      })
      .then(res => {
        if (res.data.code === "001") {
          proxy.$notifySucceed(res.data.msg);
        } else {
          proxy.$notifyError(res.data.msg);
        }
      })
      .catch(err => {
        proxy.$notifyError('添加收藏失敗');
        return Promise.reject(err);
      });
    };

    return {
      productID,
      productDetails,
      dis,
      addShoppingCart,
      addCollect
    };
  }
});
</script>

<style>
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}
#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
  background-color: #757575;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
</style>