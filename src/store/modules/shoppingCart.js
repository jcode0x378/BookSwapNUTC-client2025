import axios from 'axios';
import { computed, reactive } from 'vue';

export default function useShoppingCart() {
  const state = reactive({
    shoppingCart: [],
  });

  const getShoppingCart = computed(() => state.shoppingCart);

  const getNum = computed(() => {
    return state.shoppingCart.reduce((total, item) => total + item.num, 0);
  });

  const getIsAllCheck = computed(() => {
    return state.shoppingCart.every(item => item.check);
  });

  const getCheckGoods = computed(() => {
    return state.shoppingCart.filter(item => item.check);
  });

  const getCheckNum = computed(() => {
    return state.shoppingCart.reduce(
      (total, item) => (item.check ? total + item.num : total),
      0,
    );
  });

  const getTotalPrice = computed(() => {
    return state.shoppingCart.reduce(
      (total, item) => (item.check ? total + item.price * item.num : total),
      0,
    );
  });

  const setShoppingCart = data => {
    state.shoppingCart = data;
  };

  const unshiftShoppingCart = data => {
    state.shoppingCart.unshift(data);
  };

  const updateShoppingCart = payload => {
    if (payload.prop === 'num') {
      if (
        state.shoppingCart[payload.key].maxNum < payload.val ||
        payload.val < 1
      ) {
        return;
      }
    }
    state.shoppingCart[payload.key][payload.prop] = payload.val;
  };

  const addShoppingCartNum = productID => {
    const item = state.shoppingCart.find(item => item.productID === productID);
    if (item && item.num < item.maxNum) {
      item.num++;
    }
  };

  const deleteShoppingCart = id => {
    const index = state.shoppingCart.findIndex(item => item.id === id);
    if (index !== -1) {
      state.shoppingCart.splice(index, 1);
    }
  };

  const checkAll = data => {
    state.shoppingCart.forEach(item => (item.check = data));
  };

  const handleChange = async (currentValue, key, productID) => {
    if (!store.getters.getUser?.user_id) {
      store.dispatch('setShowLogin', true);
      return;
    }

    try {
      const response = await axios.post(
        '/user/shoppingCart/updateShoppingCart',
        {
          user_id: store.getters.getUser.user_id,
          product_id: productID,
          num: currentValue,
        },
      );

      // 處理響應...
    } catch (error) {
      console.error('更新購物車失敗:', error);
      notifyError('更新購物車失敗，請稍後重試');
    }
  };

  return {
    state,
    getShoppingCart,
    getNum,
    getIsAllCheck,
    getCheckGoods,
    getCheckNum,
    getTotalPrice,
    setShoppingCart,
    unshiftShoppingCart,
    updateShoppingCart,
    addShoppingCartNum,
    deleteShoppingCart,
    checkAll,
    handleChange,
  };
}
