  <template>
    <div class="collect">
      <div class="collect-header">
        <div class="collect-title">
          <i class="el-icon-collection-tag" style="color: #ff6700;"></i>
          我的收藏
        </div>
      </div>
      <div class="content">
        <div class="goods-list" v-if="collectList.length > 0">
          <MyList :list="collectList" :isDelete="true"></MyList>
        </div>
        <div v-else class="collect-empty">
          <div class="empty">
            <h2>您的收藏還是空的！</h2>
            <p>快去購物吧！</p>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';
import { defineComponent, onActivated, ref } from 'vue';
import { useStore } from 'vuex';

  export default defineComponent({
    setup() {
      const store = useStore();
      const collectList = ref([]);

      onActivated(() => {
        const userId = store.getters.getUser?.user_id || '';
        axios.post("https://bookswapnutc-server.zeabur.app/user/collect/getCollect", {
          user_id: userId
        })
        .then(res => {
          if (res.data.code === "001") {
            collectList.value = res.data.collectList;
          }
        })
        .catch(err => {
          console.error('Error fetching collect list:', err);
          return Promise.reject(err);
        });
      });

      return {
        collectList
      };
    }
  });
  </script>

  <style>
  .collect {
    background-color: #f5f5f5;
  }
  .collect .collect-header {
    height: 64px;
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
  }
  .collect .collect-header .collect-title {
    width: 1225px;
    margin: 0 auto;
    height: 64px;
    line-height: 58px;
    font-size: 28px;
  }
  .collect .content {
    padding: 20px 0;
    width: 1225px;
    margin: 0 auto;
  }
  .collect .content .goods-list {
    margin-left: -13.7px;
    overflow: hidden;
  }
  .collect .collect-empty {
    width: 1225px;
    margin: 0 auto;
  }
  .collect .collect-empty .empty {
    height: 300px;
    padding: 0 0 130px 558px;
    margin: 65px 0 0;
    background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
    color: #b0b0b0;
    overflow: hidden;
  }
  .collect .collect-empty .empty h2 {
    margin: 70px 0 15px;
    font-size: 36px;
  }
  .collect .collect-empty .empty p {
    margin: 0 0 20px;
    font-size: 20px;
  }
  </style>