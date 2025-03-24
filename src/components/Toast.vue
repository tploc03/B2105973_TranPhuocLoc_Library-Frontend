<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div 
      v-for="toast in toasts" 
      :key="toast.id"
      class="toast show"
      :class="toast.type"
      role="alert"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ toast.title }}</strong>
        <button 
          type="button" 
          class="btn-close" 
          @click="removeToast(toast.id)"
        ></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Toast',
  setup() {
    const toasts = ref([]);
    let nextId = 1;

    const addToast = (message, type = 'success', timeout = 5000) => { // Tăng timeout lên 5s
      const id = nextId++;
      const toast = {
        id,
        message,
        type: `bg-${type} text-white`,
        title: getTitleByType(type)
      };
      toasts.value.push(toast);
      setTimeout(() => removeToast(id), timeout);
    };

    const getTitleByType = (type) => {
      switch(type) {
        case 'success': return 'Thành công';
        case 'danger': return 'Lỗi';
        case 'warning': return 'Cảnh báo';
        case 'info': return 'Thông báo';
        default: return 'Thông báo';
      }
    };

    const removeToast = (id) => {
      const index = toasts.value.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.value.splice(index, 1);
      }
    };

    return {
      toasts,
      addToast,
      removeToast
    };
  }
};
</script>

<style scoped>
.toast-container {
  z-index: 1056;
}
</style>
