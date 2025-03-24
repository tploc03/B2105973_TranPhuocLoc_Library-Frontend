<template>
  <div class="publisher-management">
    <LoadingSpinner :show="loading" />
    
    <!-- Header section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý nhà xuất bản</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Danh sách nhà xuất bản -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in publishers" :key="publisher._id">
            <td>{{ publisher.maNXB }}</td>
            <td>{{ publisher.tenNXB }}</td>
            <td>{{ publisher.diaChi }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editPublisher(publisher)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="deletePublisher(publisher._id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa nhà xuất bản -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingPublisher ? 'Sửa nhà xuất bản' : 'Thêm nhà xuất bản mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label class="form-label">Mã NXB <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.maNXB }"
                  v-model="publisherForm.maNXB"
                  required
                >
                <div class="invalid-feedback" v-if="errors.maNXB">
                  {{ errors.maNXB }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Tên NXB <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.tenNXB }"
                  v-model="publisherForm.tenNXB"
                  required
                >
                <div class="invalid-feedback" v-if="errors.tenNXB">
                  {{ errors.tenNXB }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.diaChi }"
                  v-model="publisherForm.diaChi"
                  required
                >
                <div class="invalid-feedback" v-if="errors.diaChi">
                  {{ errors.diaChi }}
                </div>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Đang xử lý...' : (editingPublisher ? 'Cập nhật' : 'Thêm mới') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { validatePublisherForm } from '@/utils/validation';
import { showError } from '@/utils/notifications';

export default {
  name: 'PublisherManagement',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const showAddModal = ref(false);
    const editingPublisher = ref(null);
    const publisherForm = ref({
      maNXB: '',
      tenNXB: '',
      diaChi: ''
    });
    const errors = ref({});

    const publishers = computed(() => store.getters['publisher/allPublishers']);
    const loading = computed(() => store.getters['publisher/isLoading']);
    const error = computed(() => store.getters['publisher/error']);

    const fetchPublishers = async () => {
      await store.dispatch('publisher/fetchPublishers');
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingPublisher.value = null;
      publisherForm.value = {
        maNXB: '',
        tenNXB: '',
        diaChi: ''
      };
      errors.value = {};
    };

    const editPublisher = (publisher) => {
      editingPublisher.value = publisher;
      publisherForm.value = { ...publisher };
      showAddModal.value = true;
    };

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validatePublisherForm(publisherForm.value);
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        if (editingPublisher.value) {
          await store.dispatch('publisher/updatePublisher', {
            id: editingPublisher.value._id,
            publisherData: publisherForm.value
          });
        } else {
          await store.dispatch('publisher/createPublisher', publisherForm.value);
        }
        await fetchPublishers();
        closeModal();
      } catch (error) {
        showError(error);
      }
    };

    const deletePublisher = async (id) => {
      if (confirm('Bạn có chắc muốn xóa nhà xuất bản này?')) {
        try {
          await store.dispatch('publisher/deletePublisher', id);
          await fetchPublishers();
        } catch (error) {
          console.error('Error deleting publisher:', error);
        }
      }
    };

    const clearError = () => {
      store.commit('publisher/clearError');
    };

    onMounted(fetchPublishers);

    return {
      publishers,
      loading,
      error,
      showAddModal,
      editingPublisher,
      publisherForm,
      errors,
      closeModal,
      editPublisher,
      handleSubmit,
      deletePublisher,
      clearError
    };
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>