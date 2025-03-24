<template>
  <div class="publisher-list">
    <LoadingSpinner :show="loading" />

    <h2>Danh sách nhà xuất bản</h2>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Tìm kiếm -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchTerm"
            placeholder="Tìm kiếm nhà xuất bản..."
          >
          <button class="btn btn-outline-secondary" type="button" @click="handleSearch">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách nhà xuất bản -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in publishers" :key="publisher._id">
            <td>{{ publisher.maNXB }}</td>
            <td>{{ publisher.tenNXB }}</td>
            <td>{{ publisher.diaChi }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError } from '@/utils/notifications';

export default {
  name: 'PublisherList',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const searchTerm = ref('');
    const loading = computed(() => store.getters['publisher/isLoading']);
    const error = computed(() => store.getters['publisher/error']);
    const allPublishers = computed(() => store.getters['publisher/allPublishers']);

    const publishers = computed(() => {
      if (!searchTerm.value) return allPublishers.value;
      const search = searchTerm.value.toLowerCase();
      return allPublishers.value.filter(pub => 
        pub.tenNXB.toLowerCase().includes(search) ||
        pub.maNXB.toLowerCase().includes(search)
      );
    });

    const handleSearch = () => {
      // Filtering is handled by computed property
    };

    const clearError = () => {
      store.commit('publisher/SET_ERROR', null);
    };

    onMounted(async () => {
      try {
        await store.dispatch('publisher/fetchPublishers');
      } catch (error) {
        showError(error);
      }
    });

    return {
      publishers,
      loading,
      error,
      searchTerm,
      handleSearch,
      clearError
    };
  }
};
</script>

<style scoped>
.table {
  margin-top: 1rem;
}
.search-box {
  max-width: 300px;
}
</style>