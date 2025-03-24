<template>
  <div class="book-list">
    <LoadingSpinner :show="loading" />

    <h2>Danh sách sách</h2>

    <!-- <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div> -->

    <!-- Confirmation Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showConfirmModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận mượn sách</h5>
            <button type="button" class="btn-close" @click="closeConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc muốn mượn sách này?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeConfirmModal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="handleConfirmBorrow" :disabled="loading">
              {{ loading ? 'Đang xử lý...' : 'Mượn sách' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showConfirmModal"></div>

    <!-- Tìm kiếm -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchTerm"
            placeholder="Tìm kiếm sách..."
          >
          <button class="btn btn-outline-secondary" type="button" @click="searchBooks">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="book in books" :key="book._id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ book.tenSach }}</h5>
            <p class="card-text">
              <small class="text-muted">Mã sách: {{ book.maSach }}</small>
            </p>
            <p class="card-text">
              <strong>Nhà xuất bản:</strong> {{ book.maNXB?.tenNXB }}
            </p>
            <p class="card-text">
              <strong>Năm xuất bản:</strong> {{ book.namXuatBan }}
            </p>
            <p class="card-text">
              <strong>Số quyển còn:</strong> {{ book.soQuyen }}
            </p>
          </div>
          <div class="card-footer">
            <button 
              class="btn btn-primary"
              @click="borrowBook(book._id)"
              :disabled="book.soQuyen === 0 || loading"
            >
              {{ loading ? 'Đang xử lý...' : 'Mượn sách' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {showSuccess, showError } from '@/utils/notifications';

export default {
  name: 'BookList',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const books = ref([]);
    const { proxy } = getCurrentInstance();
    const loading = ref(false);
    const searchTerm = ref('');
    const showConfirmModal = ref(false);
    const selectedBookId = ref(null);

    const fetchBooks = async () => {
      try {
        await store.dispatch('book/fetchBooks');
        books.value = store.getters['book/allBooks'];
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      selectedBookId.value = null;
    };

    const borrowBook = (bookId) => {
      selectedBookId.value = bookId;
      showConfirmModal.value = true;
    };

    const handleConfirmBorrow = async () => {
      try {
        loading.value = true;
        await store.dispatch('borrow/createBorrowRequest', selectedBookId.value);
        proxy.$toast.show('Yêu cầu mượn sách đã được gửi. Vui lòng chờ quản lý duyệt!', 'success');
        closeConfirmModal();
        await fetchBooks();
      } catch (error) {
        proxy.$toast.show(error.response?.data?.message || 'Có lỗi xảy ra', 'danger');
      } finally {
        loading.value = false;
      }
    };

    const searchBooks = () => {
      if (!searchTerm.value) {
        fetchBooks();
        return;
      }
      
      books.value = store.getters['book/allBooks'].filter(book => 
        book.tenSach.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        book.maSach.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    };

    const clearError = () => {
      store.commit('book/SET_ERROR', null);
    };

    onMounted(fetchBooks);

    return {
      books,
      loading,
      searchTerm,
      borrowBook,
      searchBooks,
      showConfirmModal,
      closeConfirmModal,
      handleConfirmBorrow,
      clearError
    };
  }
};
</script>

<style scoped>
.card-title {
  font-size: 1.1rem;
}
.card-footer {
  background-color: transparent;
  border-top: none;
  padding-top: 0;
}
</style>