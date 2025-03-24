import { getCurrentInstance } from 'vue';

export const showSuccess = (message) => {
  const app = getCurrentInstance();
  if (app) {
    app.proxy.$toast.show(message, 'success');
  }
};

export const showError = (error) => {
  const app = getCurrentInstance();
  let message = 'Có lỗi xảy ra';

  if (error.response) {
    message = error.response.data.message || error.response.data.error || 'Lỗi từ server';
  } else if (error.request) {
    message = 'Không thể kết nối đến server';
  } else {
    message = error.message;
  }

  if (app) {
    app.proxy.$toast.show(message, 'danger');
  }
};

export const showConfirm = (message) => {
  return window.confirm(message || 'Bạn có chắc chắn muốn thực hiện thao tác này?');
};