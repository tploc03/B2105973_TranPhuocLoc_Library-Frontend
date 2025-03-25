<template>
  <div class="book-management">
    <LoadingSpinner :show="loading" />
    
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý sách</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm sách mới
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Search Box -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchTerm"
            placeholder="Tìm kiếm sách theo tên sách, mã sách, tên nhà xuất bản"
          >
          <button class="btn btn-outline-secondary" type="button" @click="searchBooks">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Books Table -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Nhà xuất bản</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm XB</th>
            <th>Nguồn gốc</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book._id">
            <td>{{ book.maSach }}</td>
            <td>{{ book.tenSach }}</td>
            <td>{{ book.maNXB?.tenNXB }}</td>
            <td>{{ formatCurrency(book.donGia) }}</td>
            <td :class="getQuantityClass(book.soQuyen)">
              {{ book.soQuyen }}
              <br>
              <small v-if="book.soQuyen <= 3" class="text-muted">
                {{ getQuantityMessage(book.soQuyen) }}
              </small>
            </td>
            <td>{{ book.namXuatBan }}</td>
            <td>{{ book.nguonGoc }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editBook(book)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(book)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingBook ? 'Sửa sách' : 'Thêm sách mới' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label class="form-label">Mã sách <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.maSach }"
                  v-model="bookForm.maSach"
                  required
                >
                <div class="invalid-feedback" v-if="errors.maSach">
                  {{ errors.maSach }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Tên sách <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.tenSach }"
                  v-model="bookForm.tenSach"
                  required
                >
                <div class="invalid-feedback" v-if="errors.tenSach">
                  {{ errors.tenSach }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nhà xuất bản <span class="text-danger">*</span></label>
                <select 
                  class="form-select"
                  :class="{ 'is-invalid': errors.maNXB }"
                  v-model="bookForm.maNXB"
                  required
                >
                  <option value="">Chọn nhà xuất bản</option>
                  <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
                    {{ publisher.tenNXB }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.maNXB">
                  {{ errors.maNXB }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Đơn giá <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.donGia }"
                  v-model.number="bookForm.donGia"
                  min="0"
                  required
                >
                <div class="invalid-feedback" v-if="errors.donGia">
                  {{ errors.donGia }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Số quyển <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.soQuyen }"
                  v-model.number="bookForm.soQuyen"
                  min="0"
                  required
                >
                <div class="invalid-feedback" v-if="errors.soQuyen">
                  {{ errors.soQuyen }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Năm xuất bản <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.namXuatBan }"
                  v-model.number="bookForm.namXuatBan"
                  min="1900"
                  :max="new Date().getFullYear()"
                  required
                >
                <div class="invalid-feedback" v-if="errors.namXuatBan">
                  {{ errors.namXuatBan }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nguồn gốc <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.nguonGoc }"
                  v-model="bookForm.nguonGoc"
                  required
                >
                <div class="invalid-feedback" v-if="errors.nguonGoc">
                  {{ errors.nguonGoc }}
                </div>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Đang xử lý...' : (editingBook ? 'Cập nhật' : 'Thêm mới') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sách "{{ selectedBook?.tenSach }}" không?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Hủy</button>
            <button type="button" class="btn btn-danger" @click="handleDelete" :disabled="loading">
              {{ loading ? 'Đang xử lý...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { validateBookForm } from '@/utils/validation';
import { showError } from '@/utils/notifications';

export default {
  name: 'BookManagement',
  components: { LoadingSpinner },
  
  setup() {
    const store = useStore();
    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const editingBook = ref(null);
    const selectedBook = ref(null);
    const errors = ref({});
    const searchTerm = ref('');

    const bookForm = ref({
      maSach: '',
      tenSach: '',
      maNXB: '',
      donGia: 0,
      soQuyen: 0,
      namXuatBan: new Date().getFullYear(),
      nguonGoc: ''
    });

    const loading = computed(() => store.getters['book/isLoading']);
    const error = computed(() => store.getters['book/error']);
    const books = computed(() => store.getters['book/allBooks']);
    const publishers = computed(() => store.getters['publisher/allPublishers']);

    const filteredBooks = computed(() => {
      if (!searchTerm.value) return books.value;
      const search = searchTerm.value.toLowerCase();
      return books.value.filter(book => 
        book.maSach.toLowerCase().includes(search) ||
        book.tenSach.toLowerCase().includes(search) ||
        book.maNXB?.tenNXB.toLowerCase().includes(search)
      );
    });

    const fetchData = async () => {
      try {
        await Promise.all([
          store.dispatch('book/fetchBooks'),
          store.dispatch('publisher/fetchPublishers')
        ]);
      } catch (error) {
        showError(error);
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingBook.value = null;
      errors.value = {};
      bookForm.value = {
        maSach: '',
        tenSach: '',
        maNXB: '',
        donGia: 0,
        soQuyen: 0,
        namXuatBan: new Date().getFullYear(),
        nguonGoc: ''
      };
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-danger fw-bold';
      if (quantity < 3) return 'text-warning fw-bold';
      return 'text-success';
    };

    const getQuantityMessage = (quantity) => {
      if (quantity === 0) return 'Hết sách';
      if (quantity < 3) return 'Sắp hết sách';
      return '';
    };

    const editBook = (book) => {
      editingBook.value = book;
      bookForm.value = { ...book };
      showAddModal.value = true;
    };

    const confirmDelete = (book) => {
      selectedBook.value = book;
      showDeleteModal.value = true;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch('book/deleteBook', selectedBook.value._id);
        await fetchData();
        showDeleteModal.value = false;
        selectedBook.value = null;
      } catch (error) {
        showError(error);
      }
    };

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validateBookForm(bookForm.value);
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        if (editingBook.value) {
          await store.dispatch('book/updateBook', {
            id: editingBook.value._id,
            bookData: bookForm.value
          });
        } else {
          await store.dispatch('book/createBook', bookForm.value);
        }
        
        await fetchData();
        closeModal();
      } catch (error) {
        showError(error);
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(value);
    };

    const clearError = () => {
      store.commit('book/SET_ERROR', null);
    };

    onMounted(fetchData);

    return {
      showAddModal,
      showDeleteModal,
      editingBook,
      selectedBook,
      bookForm,
      loading,
      getQuantityClass,
      getQuantityMessage,
      error,
      errors,
      books,
      publishers,
      searchTerm,
      filteredBooks,
      closeModal,
      editBook,
      confirmDelete,
      handleDelete,
      handleSubmit,
      formatCurrency,
      clearError
    };
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.form-label {
  font-weight: 500;
}
.text-danger {
  font-weight: bold;
  background-color: rgba(255, 0, 0, 0.1);
}

.text-warning {
  background-color: rgba(255, 193, 7, 0.1);
}

.text-success {
  color: #198754 !important;
}

.text-muted {
  font-size: 0.85em;
  font-style: italic;
}
</style>