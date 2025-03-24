<template>
  <div class="login-form">
    <LoadingSpinner :show="loading" />

    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: userType === 'reader' }" @click="userType = 'reader'">
              Độc giả
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: userType === 'staff' }" @click="userType = 'staff'">
              Nhân viên
            </a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="mb-3" v-if="userType === 'staff'">
            <label class="form-label">MSNV <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control"
              :class="{ 'is-invalid': errors.MSNV }"
              v-model="credentials.MSNV" 
              required
            >
            <div class="invalid-feedback" v-if="errors.MSNV">
              {{ errors.MSNV }}
            </div>
          </div>

          <div class="mb-3" v-if="userType === 'reader'">
            <label class="form-label">Email <span class="text-danger">*</span></label>
            <input 
              type="email" 
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              v-model="credentials.email" 
              required
            >
            <div class="invalid-feedback" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
            <input 
              type="password" 
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              v-model="credentials.password" 
              required
            >
            <div class="invalid-feedback" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
            <div class="card-footer text-center">
                <p class="mb-0">
                Chưa có tài khoản? 
                <router-link to="/register" class="text-primary">Đăng ký ngay</router-link>
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
import { showError } from '@/utils/notifications';

export default {
  name: 'LoginForm',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userType = ref('reader');
    const credentials = ref({
      MSNV: '',
      email: '',
      password: ''
    });
    const errors = ref({});

    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);

    const validateForm = () => {
      const errors = {};
      if (userType.value === 'staff' && !credentials.value.MSNV) {
        errors.MSNV = 'MSNV là bắt buộc';
      }
      if (userType.value === 'reader' && !credentials.value.email) {
        errors.email = 'Email là bắt buộc';
      }
      if (!credentials.value.password) {
        errors.password = 'Mật khẩu là bắt buộc';
      }
      return errors;
    };

    const handleSubmit = async () => {
      try {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          errors.value = validationErrors;
          return;
        }

        if (userType.value === 'staff') {
          await store.dispatch('auth/loginStaff', {
            MSNV: credentials.value.MSNV,
            password: credentials.value.password
          });
          router.push('/admin');
        } else {
          await store.dispatch('auth/loginReader', {
            email: credentials.value.email,
            password: credentials.value.password
          });
          router.push('/reader');
        }
      } catch (err) {
        showError(err);
      }
    };

    const clearError = () => {
      store.commit('auth/SET_ERROR', null);
    };

    return {
      userType,
      credentials,
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
.login-form {
  max-width: 400px;
  margin: 2rem auto;
}
.nav-link {
  cursor: pointer;
}
.card-footer {
  background-color: transparent;
  border-top: 1px solid rgba(0,0,0,.125);
  padding: 1rem;
}
</style>