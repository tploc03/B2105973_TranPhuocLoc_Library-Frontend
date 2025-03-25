<template>
  <div class="reader-dashboard">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#" @click.prevent="currentComponent = 'HomePage'">
          <i class="fas fa-book-reader me-2"></i>Thư viện PL
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'BookList' }"
                 @click="currentComponent = 'BookList'">
                Sách
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'PublisherList' }"
                 @click="currentComponent = 'PublisherList'">
                Nhà xuất bản
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'BorrowHistory' }"
                 @click="currentComponent = 'BorrowHistory'">
                Lịch sử mượn sách
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item me-3">
              <span class="nav-link">
                Xin chào, {{ currentUser?.hoLot }} {{ currentUser?.ten || 'Độc giả' }}
              </span>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="handleLogout">Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'; // Thêm watch vào đây
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HomePage from '@/components/reader/HomePage.vue';
import BookList from '@/components/reader/BookList.vue';
import PublisherList from '@/components/reader/PublisherList.vue';
import BorrowHistory from '@/components/reader/BorrowHistory.vue';

export default {
  name: 'ReaderDashboard',
  components: {
    HomePage,
    BookList,
    PublisherList,
    BorrowHistory
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // Lấy component từ localStorage hoặc mặc định là 'HomePage'
    const currentComponent = ref(localStorage.getItem('readerCurrentComponent') || 'HomePage');
    
    // Watch sự thay đổi của currentComponent và lưu vào localStorage
    watch(currentComponent, (newValue) => {
      localStorage.setItem('readerCurrentComponent', newValue);
    });

    const currentUser = computed(() => store.getters['auth/currentUser']);

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      localStorage.removeItem('readerCurrentComponent'); // Xóa khi logout
      router.push('/login');
    };

    return {
      currentComponent,
      currentUser,
      handleLogout
    };
  }
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
.navbar-nav .nav-item .nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>