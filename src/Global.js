import { ElMessage, ElNotification } from 'element-plus';

export default {
  install: app => {
    // 全局變量
    app.config.globalProperties.$baseUrl =
      import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    // 全局方法 - 成功提示
    app.config.globalProperties.$notifySucceed = message => {
      ElNotification({
        title: '成功',
        message: message,
        type: 'success',
        duration: 2000,
      });
    };

    // 全局方法 - 錯誤提示
    app.config.globalProperties.$notifyError = message => {
      ElNotification({
        title: '錯誤',
        message: message,
        type: 'error',
        duration: 3000,
      });
    };

    // 全局方法 - 警告提示
    app.config.globalProperties.$notifyWarning = message => {
      ElNotification({
        title: '警告',
        message: message,
        type: 'warning',
        duration: 2500,
      });
    };

    // 全局方法 - 消息提示
    app.config.globalProperties.$message = {
      success: message => {
        ElMessage({
          message: message,
          type: 'success',
          duration: 2000,
        });
      },
      error: message => {
        ElMessage({
          message: message,
          type: 'error',
          duration: 3000,
        });
      },
      warning: message => {
        ElMessage({
          message: message,
          type: 'warning',
          duration: 2500,
        });
      },
      info: message => {
        ElMessage({
          message: message,
          type: 'info',
          duration: 2000,
        });
      },
    };

    // 全局方法 - 格式化日期
    app.config.globalProperties.$formatDate = (date, format = 'YYYY-MM-DD') => {
      if (!date) return '';

      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');

      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    };

    // 全局方法 - 格式化價格
    app.config.globalProperties.$formatPrice = price => {
      return `NT$ ${Number(price)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };
  },
};
