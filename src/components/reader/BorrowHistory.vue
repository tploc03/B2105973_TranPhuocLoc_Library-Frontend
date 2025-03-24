<template>
  <div class="borrow-history">
    <LoadingSpinner :show="loading" />

    <h2>Lịch sử mượn sách</h2>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Tabs for different request status -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'all' }" 
           @click="currentTab = 'all'">
          Tất cả
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'pending' }" 
           @click="currentTab = 'pending'">
          Chờ duyệt
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'approved' }" 
           @click="currentTab = 'approved'">
          Đã duyệt
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'rejected' }" 
           @click="currentTab = 'rejected'">
          Đã từ chối
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'returned' }" 
           @click="currentTab = 'returned'">
          Đã trả
        </a>
      </li>
    </ul>

    <!-- Danh sách yêu cầu mượn sách -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
  <tbody>
    <tr v-for="request in filteredHistory" :key="request._id">
      <td>
        {{ request.maSach?.tenSach || 'N/A' }}
        <br>
        <small class="text-muted">{{ request.maSach?.maSach || 'N/A' }}</small>
      </td>
      <td>{{ formatDate(request.ngayMuon) }}</td>
      <td>{{ request.ngayTra ? formatDate(request.ngayTra) : '-' }}</td>
      <td>
        <span :class="getStatusBadgeClass(request.trangThai)">
          {{ request.trangThai }}
        </span>
      </td>
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
  name: 'BorrowHistory',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const currentTab = ref('all');
    const loading = ref(false);
    const error = ref(null);

    const borrowHistory = computed(() => store.getters['borrow/borrowHistory']);
    
    const filteredHistory = computed(() => {
      if (currentTab.value === 'all') {
        return borrowHistory.value;
      }
      
      const statusMap = {
        pending: 'Chờ duyệt',
        approved: 'Đã duyệt',
        rejected: 'Từ chối',
        returned: 'Đã trả'
      };
      
      return borrowHistory.value.filter(
        request => request.trangThai === statusMap[currentTab.value]
      );
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        'Chờ duyệt': 'badge bg-warning',
        'Đã duyệt': 'badge bg-success',
        'Từ chối': 'badge bg-danger',
        'Đã trả': 'badge bg-info'
      };
      return classes[status] || 'badge bg-secondary';
    };

    const fetchHistory = async () => {
      loading.value = true;
      try {
        await store.dispatch('borrow/fetchBorrowHistory');
      } catch (err) {
        error.value = err.message;
        showError(err);
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      store.commit('borrow/SET_ERROR', null);
    };

    onMounted(fetchHistory);

    return {
      currentTab,
      filteredHistory,
      formatDate,
      getStatusBadgeClass,
      loading,
      error,
      clearError
    };
  }
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
.badge {
  font-size: 0.9em;
}
</style>