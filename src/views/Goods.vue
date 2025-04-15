<template>
  <div class="goods" id="goods" name="goods">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>全部書本</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜尋</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分類</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="nav">
      <div class="product-nav">
        <div class="title">分類</div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="''+item.category_id"
          >
            <div>{{ item.category_name }}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="main">
      <div class="list">
        <MyList :list="product" v-if="product.length > 0"></MyList>
        <div v-else class="none-product">抱歉沒找到相關的商品，看看其他的商品</div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    
    const categoryList = ref([]);
    const categoryID = ref([]);
    const product = ref([]);
    const total = ref(0);
    const pageSize = ref(15);
    const currentPage = ref(1);
    const activeName = ref("-1");
    const search = ref("");

    const methods = {
      getData: () => {
        return axios.post(proxy.$api('/product/getAllProduct'), {
          categoryID: categoryID.value,
          currentPage: currentPage.value,
          pageSize: pageSize.value
        })
          .then(res => {
            if (res.data.code === "001") {
              product.value = res.data.Product;
              total.value = res.data.total;
            }
          })
          .catch(err => {
            console.error('Error in getData:', err);
            product.value = [];
            total.value = 0;
          });
      },

      getProductBySearch: () => {
        if (search.value) {
          return axios.post(proxy.$api('/product/getProductBySearch'), {
            search: search.value,
            currentPage: currentPage.value,
            pageSize: pageSize.value
          })
            .then(res => {
              if (res.data.code === "001") {
                product.value = res.data.Product;
                total.value = res.data.total;
              }
            })
            .catch(err => {
              console.error('Error in getProductBySearch:', err);
              product.value = [];
              total.value = 0;
            });
        }
        return Promise.resolve();
      },

      getCategory: () => {
        return axios.post(proxy.$api('/product/getCategory'))
          .then(res => {
            if (res.data.code === "001") {
              categoryList.value = res.data.category;
            } else {
              console.error('Failed to fetch categories:', res.data.message);
            }
          })
          .catch(err => {
            console.error('Error in getCategory:', err);
            categoryList.value = [];
          });
      },

      currentChange: (val) => {
        currentPage.value = val;
        if (search.value) {
          methods.getProductBySearch();
        } else {
          methods.getData();
        }
      },

      handleRouteQuery: (query) => {
        if (query.categoryID) {
          categoryID.value = Array.isArray(query.categoryID) 
            ? query.categoryID.map(Number)
            : [Number(query.categoryID)];
          activeName.value = categoryID.value[0]?.toString() || "-1";
        }
        if (query.search) {
          search.value = query.search;
          return methods.getProductBySearch();
        } else {
          return methods.getData();
        }
      }
    };

    watch(() => route.query, methods.handleRouteQuery);

    watch(activeName, (val) => {
      if (val == "-1") {
        categoryID.value = [];
      } else if (val) {
        categoryID.value = [Number(val)];
      }
      total.value = 0;
      currentPage.value = 1;
      router.push({
        path: "/goods",
        query: { categoryID: categoryID.value }
      });
    });

    onMounted(() => {
      methods.getCategory();
      methods.handleRouteQuery(route.query);
    });

    return {
      categoryList,
      categoryID,
      product,
      total,
      pageSize,
      currentPage,
      activeName,
      search,
      currentChange: methods.currentChange
    };
  }
});
</script>

<style scoped>
.goods {
  background-color: #f5f5f5;
}
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
.goods .nav {
  background-color: white;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
</style>