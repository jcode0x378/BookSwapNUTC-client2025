import api from './api';

const booksAPI = {
  // 獲取所有書籍
  getAllBooks: params => api.get('/books', { params }),

  // 獲取單本書籍詳情
  getBook: id => {
    console.log(`API call: Getting book with ID ${id}`);
    return api.get(`/books/${id}`)
      .then(response => {
        console.log('API response:', response);
        return response;
      })
      .catch(error => {
        console.error('API error when getting book:', error);
        throw error;
      });
  },

  // 獲取用戶的書籍
  getUserBooks: params => api.get('/books/user', { params }),

  // 創建書籍
  createBook: bookData => {
    // 如果包含圖片，需要使用FormData
    if (bookData.images && bookData.images.length > 0) {
      const formData = new FormData();

      // 添加基本信息
      Object.keys(bookData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, bookData[key]);
        }
      });

      // 添加圖片
      bookData.images.forEach(image => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      return api.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // 如果沒有圖片，直接發送JSON
    return api.post('/books', bookData);
  },

  // 更新書籍
  updateBook: (id, bookData) => {
    // 如果包含圖片，需要使用FormData
    if (bookData.images && bookData.images.length > 0) {
      const formData = new FormData();

      // 添加基本信息
      Object.keys(bookData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, bookData[key]);
        }
      });

      // 添加新圖片
      bookData.images.forEach(image => {
        if (image.file) {
          formData.append('images', image.file);
        } else if (image.id) {
          // 對於已有的圖片，傳遞ID
          formData.append('existingImages', image.id);
        }
      });

      return api.put(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // 如果沒有圖片，直接發送JSON
    return api.put(`/books/${id}`, bookData);
  },

  // 刪除書籍
  deleteBook: id => api.delete(`/books/${id}`),

  // 搜索書籍
  searchBooks: query => api.get('/books/search', { params: { query } }),
};

export default booksAPI;
