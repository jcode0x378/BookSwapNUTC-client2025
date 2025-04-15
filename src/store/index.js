import { createStore } from 'vuex';
import auth from './modules/auth';
import books from './modules/books';
import transactions from './modules/transactions';
import system from './modules/system';

export default createStore({
  modules: {
    auth,
    books,
    transactions,
    system,
  },
});
