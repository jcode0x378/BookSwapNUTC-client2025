import { booksAPI } from '../../services';

const state = {
  books: [],
  book: null,
  userBooks: {
    selling: [],
    sold: [],
  },
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const getters = {
  allBooks: state => state.books,
  bookDetail: state => state.book,
  currentBook: state => state.book,
  sellingBooks: state => state.userBooks.selling,
  soldBooks: state => state.userBooks.sold,
  loading: state => state.loading,
  error: state => state.error,
  pagination: state => state.pagination,
};

const actions = {
  // 獲取所有書籍
  async fetchBooks({ commit }, params = {}) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await booksAPI.getAllBooks(params);
      const { books, pagination } = response.data;

      commit('SET_BOOKS', books);
      commit('SET_PAGINATION', pagination);

      return books;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取單本書籍詳情
  async fetchBook({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      console.log('Fetching book with ID:', id);
      const response = await booksAPI.getBook(id);
      const book = response.data;
      console.log('Received book data:', book);

      commit('SET_BOOK', book);

      return book;
    } catch (error) {
      console.error('Error fetching book:', error);
      const errorMsg = error.response?.data?.message || '獲取書籍詳情失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 獲取用戶的書籍
  async fetchUserBooks({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      // 獲取在售書籍
      const sellingResponse = await booksAPI.getUserBooks({
        status: 'selling',
      });
      const sellingBooks = sellingResponse.data;

      // 獲取已售出書籍
      const soldResponse = await booksAPI.getUserBooks({ status: 'sold' });
      const soldBooks = soldResponse.data;

      commit('SET_USER_BOOKS', { selling: sellingBooks, sold: soldBooks });

      return { selling: sellingBooks, sold: soldBooks };
    } catch (error) {
      const errorMsg = error.response?.data?.message || '獲取用戶書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 創建書籍
  async createBook({ commit }, bookData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await booksAPI.createBook(bookData);
      const newBook = response.data;

      // 更新用戶的在售書籍列表
      commit('ADD_USER_BOOK', { book: newBook, status: 'selling' });

      return newBook;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '創建書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 更新書籍
  async updateBook({ commit }, { id, bookData }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await booksAPI.updateBook(id, bookData);
      const updatedBook = response.data;

      // 更新書籍詳情
      commit('SET_BOOK', updatedBook);

      // 更新用戶的書籍列表
      commit('UPDATE_USER_BOOK', {
        book: updatedBook,
        status: updatedBook.status,
      });

      return updatedBook;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '更新書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 刪除書籍
  async deleteBook({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await booksAPI.deleteBook(id);

      // 從用戶的書籍列表中移除
      commit('REMOVE_USER_BOOK', id);

      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '刪除書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 搜索書籍
  async searchBooks({ commit }, query) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await booksAPI.searchBooks(query);
      const { books, pagination } = response.data;

      commit('SET_BOOKS', books);
      commit('SET_PAGINATION', pagination);

      return books;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '搜索書籍失敗';
      commit('SET_ERROR', errorMsg);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const mutations = {
  SET_BOOKS(state, books) {
    state.books = books;
  },
  SET_BOOK(state, book) {
    state.book = book;
  },
  SET_USER_BOOKS(state, { selling, sold }) {
    state.userBooks.selling = selling;
    state.userBooks.sold = sold;
  },
  ADD_USER_BOOK(state, { book, status }) {
    if (status === 'selling') {
      state.userBooks.selling.unshift(book);
    } else if (status === 'sold') {
      state.userBooks.sold.unshift(book);
    }
  },
  UPDATE_USER_BOOK(state, { book, status }) {
    // 從兩個列表中移除舊的書籍
    state.userBooks.selling = state.userBooks.selling.filter(
      b => b.id !== book.id,
    );
    state.userBooks.sold = state.userBooks.sold.filter(b => b.id !== book.id);

    // 添加到正確的列表
    if (status === 'selling') {
      state.userBooks.selling.unshift(book);
    } else if (status === 'sold') {
      state.userBooks.sold.unshift(book);
    }
  },
  REMOVE_USER_BOOK(state, id) {
    state.userBooks.selling = state.userBooks.selling.filter(
      book => book.id !== id,
    );
    state.userBooks.sold = state.userBooks.sold.filter(book => book.id !== id);
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
