<template>
  <div class="staff-management">
    <LoadingSpinner :show="loading" />
    
    <!-- Header section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý nhân viên</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm nhân viên mới
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Danh sách nhân viên -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>MSNV</th>
            <th>Họ tên</th>
            <th>Chức vụ</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffList" :key="staff._id">
            <td>{{ staff.MSNV }}</td>
            <td>{{ staff.hoTenNV }}</td>
            <td>{{ staff.chucVu }}</td>
            <td>{{ staff.diaChi }}</td>
            <td>{{ staff.soDienThoai }}</td>
            <td>{{ staff.role === 'admin' ? 'Quản trị' : 'Nhân viên' }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editStaff(staff)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteStaff(staff._id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa nhân viên -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên mới' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
                <div class="mb-3">
                    <label class="form-label">MSNV</label>
                    <input type="text" class="form-control" v-model="staffForm.MSNV" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Họ tên</label>
                    <input type="text" class="form-control" v-model="staffForm.hoTenNV" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Chức vụ</label>
                    <input type="text" class="form-control" v-model="staffForm.chucVu" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <input type="text" class="form-control" v-model="staffForm.diaChi" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" v-model="staffForm.soDienThoai" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control" v-model="staffForm.password" 
                        :required="!editingStaff">
                <small class="text-muted" v-if="editingStaff">
                    Để trống nếu không muốn thay đổi mật khẩu
                </small>
                </div>
                <button type="submit" class="btn btn-primary">
                    {{ editingStaff ? 'Cập nhật' : 'Thêm mới' }}
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { validateStaffForm } from '@/utils/validation';
import { showError } from '@/utils/notifications';
import api from '@/services/api';

export default {
  name: 'StaffManagement',
  components: { LoadingSpinner },
  setup() {
    const staffList = ref([]);
    const showAddModal = ref(false);
    const editingStaff = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const staffForm = ref({
      MSNV: '',
      hoTenNV: '',
      chucVu: '',
      diaChi: '',
      soDienThoai: '',
      password: ''
    }); 
    const errors = ref({}); // Thêm errors state

    const fetchStaff = async () => {
      loading.value = true;
      try {
        const response = await api.get('/nhanvien');
        staffList.value = response.data;
      } catch (err) {
        showError(err);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingStaff.value = null;
      staffForm.value = {
        MSNV: '',
        hoTenNV: '',
        chucVu: '',
        diaChi: '',
        soDienThoai: '',
        role: 'staff',
        password: ''
      };
    };

    const editStaff = (staff) => {
      editingStaff.value = staff;
      staffForm.value = { ...staff, password: '' };
      showAddModal.value = true;
    };

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validateStaffForm(staffForm.value);
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        if (editingStaff.value) {
          await api.put(`/nhanvien/${editingStaff.value._id}`, staffForm.value);
        } else {
          await api.post('/nhanvien', staffForm.value);
        }
        await fetchStaff();
        closeModal();
      } catch (error) {
        showError(error);
      }
    };

    const deleteStaff = async (id) => {
      if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
        try {
          await api.delete(`/nhanvien/${id}`);
          await fetchStaff();
        } catch (error) {
          console.error('Error deleting staff:', error);
        }
      }
    };

    const clearError = () => {
      error.value = null;
    };

    onMounted(fetchStaff);

    return {
      staffList,
      showAddModal,
      editingStaff,
      staffForm,
      loading,
      error,
      errors,
      closeModal,
      editStaff,
      handleSubmit,
      deleteStaff,
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