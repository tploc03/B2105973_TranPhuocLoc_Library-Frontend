<template>
  <div class="book-list">
    <LoadingSpinner :show="loading" />

    <h2>Danh sách sách</h2>

    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showConfirmModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận mượn sách</h5>
            <button type="button" class="btn-close" @click="closeConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn muốn mượn '{{ selectedBook?.tenSach }}'?</p>
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
            placeholder="Tìm kiếm theo tên sách, mã sách, tên NXB, tên tác giả"
          >
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
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
            <strong>Nguốc gốc/Tác giả:</strong> {{ book.nguonGoc }}
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
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {showSuccess, showError } from '@/utils/notifications';

export default {
  name: 'BookList',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const books = computed(() => {
      if (!searchTerm.value.trim()) return store.getters['book/allBooks'];
      
      const search = searchTerm.value.toLowerCase().trim();
      return store.getters['book/allBooks'].filter(book => 
        book.tenSach.toLowerCase().includes(search) ||
        book.maSach.toLowerCase().includes(search) ||
        book.maNXB?.tenNXB.toLowerCase().includes(search) ||
        book.nguonGoc.toLowerCase().includes(search)
      );
    });

    const { proxy } = getCurrentInstance();
    const error = ref(null);
    const loading = ref(false);
    const searchTerm = ref('');
    const selectedBook = ref(null);
    const selectedBookId = ref(null);
    const showConfirmModal = ref(false);

    const fetchBooks = async () => {
      try {
        loading.value = true;
        await store.dispatch('book/fetchBooks');
        books.value = store.getters['book/allBooks'];
      } catch (err) {
        error.value = err.message;
        console.error('Error fetching books:', err);
      } finally {
        loading.value = false;
      }
    };

    const borrowBook = (bookId) => {
      selectedBook.value = books.value.find(book => book._id === bookId);
      selectedBookId.value = bookId;
      showConfirmModal.value = true;
    };

    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      selectedBookId.value = null;
      selectedBook.value = null;
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

    const clearError = () => {
      error.value = null;
      store.commit('book/SET_ERROR', null);
    };

    onMounted(fetchBooks);

    return {
      books,
      loading,
      error,
      searchTerm,
      borrowBook,
      showConfirmModal,
      closeConfirmModal,
      handleConfirmBorrow,
      selectedBook,
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
.input-group {
  max-width: 500px;
}

.input-group-text {
  background-color: white;
  border-left: none;
}

.form-control:focus + .input-group-text {
  border-color: #86b7fe;
}

.form-control {
  border-right: none;
}
</style>