<template>
  <div class="register-form">
    <LoadingSpinner :show="loading" />
    
    <div class="card">
      <div class="card-header">
        <h4>Đăng ký tài khoản độc giả</h4>
      </div>
      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="mb-3">
            <label class="form-label">Mã độc giả <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control"
              :class="{ 'is-invalid': errors.maDocGia }"
              v-model="formData.maDocGia"
              required
            >
            <div class="invalid-feedback" v-if="errors.maDocGia">
              {{ errors.maDocGia }}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Họ lót</label>
            <input type="text" class="form-control" v-model="formData.hoLot" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Tên</label>
            <input type="text" class="form-control" v-model="formData.ten" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Ngày sinh</label>
            <input type="date" class="form-control" v-model="formData.ngaySinh" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Phái</label>
            <select class="form-select" v-model="formData.phai" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Địa chỉ</label>
            <input type="text" class="form-control" v-model="formData.diaChi" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Điện thoại</label>
            <input type="tel" class="form-control" v-model="formData.dienThoai" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="formData.email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input type="password" class="form-control" v-model="formData.password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
          </button>
          <div class="card-footer text-center">
        <p class="mb-0">
          Đã có tài khoản? 
          <router-link to="/login" class="text-primary">Đăng nhập</router-link>
        </p>
      </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { validateReaderForm } from '@/utils/validation';
import { showError, showSuccess } from '@/utils/notifications';

export default {
  name: 'RegisterForm',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = ref({
      maDocGia: '',
      hoLot: '',
      ten: '',
      ngaySinh: '',
      phai: 'Nam',
      diaChi: '',
      dienThoai: '',
      email: '',
      password: ''
    });
    const errors = ref({});

    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validateReaderForm(formData.value);
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        await store.dispatch('auth/registerReader', formData.value);
        showSuccess('Đăng ký thành công');
        router.push('/reader');
      } catch (err) {
        showError(err);
      }
    };

    const clearError = () => {
      store.commit('auth/SET_ERROR', null);
    };

    return {
      formData,
      loading,
      error,
      errors,
      handleSubmit,
      clearError
    };
  }
};
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 2rem auto;
}
.card-footer {
  background-color: transparent;
  border-top: 1px solid rgba(0,0,0,.125);
  padding: 1rem;
}
</style>