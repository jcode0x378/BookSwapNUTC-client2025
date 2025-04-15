import api from './api';

const authAPI = {
  // 用戶登入
  login: credentials => api.post('/auth/login', credentials),

  // 用戶註冊
  register: userData => api.post('/auth/register', userData),

  // 獲取當前用戶信息
  getCurrentUser: () => api.get('/auth/me'),

  // 更新用戶資料
  updateProfile: profileData => {
    // 如果包含頭像且為base64格式，需要使用FormData
    if (profileData.avatar && profileData.avatar.startsWith('data:')) {
      const formData = new FormData();

      // 將base64轉換為文件
      const blob = dataURItoBlob(profileData.avatar);
      formData.append('avatar', blob, 'avatar.jpg');

      // 添加其他資料
      Object.keys(profileData).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, profileData[key]);
        }
      });

      return api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // 如果沒有新頭像，直接發送JSON
    return api.put('/users/profile', profileData);
  },

  // 修改密碼
  changePassword: passwordData => api.put('/users/password', passwordData),
};

// 輔助函數：將base64轉換為Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export default authAPI;
