<template>
  <div id="myList" class="myList">
    <ul>
      <li v-for="item in list" :key="item.product_id">
        <el-popover placement="top">
          <p>確定刪除嗎？</p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button type="primary" size="small" @click="deleteCollect(item.product_id)">確定</el-button>
          </div>
          <i class="el-icon-close delete" slot="reference" v-show="isDelete"></i>
        </el-popover>
        <router-link :to="{ path: '/goods/details', query: {productID:item.product_id} }">
          <img :src="$target + item.product_picture" alt />
          <h2>{{ item.product_name }}</h2>
          <h3>{{ item.product_title }}</h3>
          <p>
            <span>{{ item.product_selling_price }}元</span>
            <span
              v-show="item.product_price != item.product_selling_price"
              class="del"
            >{{ item.product_price }}元</span>
          </p>
        </router-link>
      </li>
      <li v-show="isMore && list.length >= 1" id="more">
        <router-link :to="{ path: '/goods', query: {categoryID: categoryID} }">
          瀏覽更多
          <i class="el-icon-d-arrow-right"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: "MyList",
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    isMore: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore();

    const categoryID = computed(() => {
      const categoryIDSet = new Set();
      props.list.forEach(item => {
        categoryIDSet.add(item.category_id);
      });
      return Array.from(categoryIDSet);
    });

    const deleteCollect = (product_id) => {
      axios.post("https://bookswapnutc-server.zeabur.app/user/collect/deleteCollect", {
        user_id: store.getters.getUser?.user_id || '',
        product_id: product_id
      })
      .then(res => {
        switch (res.data.code) {
          case "001":
            // 刪除成功
            const index = props.list.findIndex(item => item.product_id === product_id);
            if (index !== -1) {
              props.list.splice(index, 1);
            }
            // 提示刪除成功信息
            notifySucceed(res.data.msg);
            break;
          default:
            // 提示刪除失敗信息
            notifyError(res.data.msg);
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
    };

    return {
      categoryID,
      deleteCollect
    };
  }
});
</script>

<style scoped>
.myList ul li {
  z-index: 1;
  float: left;
  width: 234px;
  height: 280px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.myList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.myList ul li img {
  display: block;
  width: 160px;
  height: 160px;
  background: url(../assets/imgs/placeholder.png) no-repeat 50%;
  margin: 0 auto;
}
.myList ul li h2 {
  margin: 25px 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li h3 {
  margin: 5px 10px;
  height: 18px;
  font-size: 12px;
  font-weight: 400;
  color: #b0b0b0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li p {
  margin: 10px 10px 10px;
  text-align: center;
  color: #ff6700;
}
.myList ul li p .del {
  margin-left: 0.5em;
  color: #b0b0b0;
  text-decoration: line-through;
}
.myList #more {
  text-align: center;
  line-height: 280px;
}
.myList #more a {
  font-size: 18px;
  color: #333;
}
.myList #more a:hover {
  color: #ff6700;
}
.myList ul li .delete {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.myList ul li:hover .delete {
  display: block
}
.myList ul li .delete:hover {
  color: #ff6700;
}
</style>