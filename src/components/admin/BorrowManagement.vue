<template>
  <div class="borrow-management">
    <LoadingSpinner :show="loading" />
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý mượn sách</h2>
    </div>

    <!-- Phần tìm kiếm -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchTerm"
            placeholder="Tìm kiếm theo tên độc giả, mã độc giả, tên sách, mã sách"
          >
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Tabs for different request status -->
    <ul class="nav nav-tabs mb-3">
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
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request._id">
            <td>
              {{ request.maDocGia?.hoLot || 'N/A' }} {{ request.maDocGia?.ten || '' }}
              <br>
              <small class="text-muted">{{ request.maDocGia?.maDocGia || 'N/A' }}</small>
            </td>
            <td>
              {{ request.maSach?.tenSach || 'N/A' }}
              <br>
              <small class="text-muted">{{ request.maSach?.maSach || 'N/A' }}</small>
              <br>
              <small :class="getQuantityClass(request.maSach?.soQuyen)">
                Còn lại: {{ request.maSach?.soQuyen || 0 }} quyển
              </small>
            </td>
            <td>{{ formatDate(request.ngayMuon) }}</td>
            <td>{{ request.ngayTra ? formatDate(request.ngayTra) : '-' }}</td>
            <td>
              <span :class="getStatusBadgeClass(request.trangThai)">
                {{ request.trangThai }}
              </span>
            </td>
            <td>
              <template v-if="request.trangThai === 'Chờ duyệt'">
                <button class="btn btn-sm btn-success me-2" 
                        @click="showConfirmAction('approve', request)"
                        :disabled="request.maSach?.soQuyen <= 0">
                  <i class="fas fa-check"></i> Duyệt
                </button>
                <button class="btn btn-sm btn-danger" 
                        @click="showConfirmAction('reject', request)">
                  <i class="fas fa-times"></i> Từ chối
                </button>
              </template>
              <template v-if="request.trangThai === 'Đã duyệt'">
                <button class="btn btn-sm btn-info" 
                        @click="showConfirmAction('return', request)">
                  <i class="fas fa-undo"></i> Đánh dấu đã trả
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance} from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError, showConfirm } from '@/utils/notifications';

export default {
  name: 'BorrowManagement',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const currentTab = ref('pending');
    const loading = ref(false);
    const { proxy } = getCurrentInstance();
    const borrowRequests = computed(() => store.getters['borrow/allBorrowRequests']);
    const searchTerm = ref('');

    const filteredRequests = computed(() => {
      let requests = borrowRequests.value;

      if (currentTab.value !== 'all') {
        const statusMap = {
          pending: 'Chờ duyệt',
          approved: 'Đã duyệt',
          rejected: 'Từ chối',
          returned: 'Đã trả'
        };
        requests = requests.filter(
          request => request.trangThai === statusMap[currentTab.value]
        );
      }

      if (searchTerm.value.trim()) {
        const search = searchTerm.value.toLowerCase().trim();
        requests = requests.filter(request => 
          `${request.maDocGia?.hoLot} ${request.maDocGia?.ten}`.toLowerCase().includes(search) ||
          request.maDocGia?.maDocGia.toLowerCase().includes(search) ||
          request.maSach?.tenSach.toLowerCase().includes(search) ||
          request.maSach?.maSach.toLowerCase().includes(search)
        );
      }

      return requests;
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

    const fetchBorrowRequests = async () => {
      loading.value = true;
      try {
        await store.dispatch('borrow/fetchBorrowRequests');
      } catch (error) {
        showError(error);
      } finally {
        loading.value = false;
      }
    };

    const getQuantityClass = (quantity) => {
      if (quantity <= 0) return 'text-danger fw-bold';
      if (quantity < 3) return 'text-warning fw-bold';
      return 'text-success';
    };

    const showConfirmAction = async (action, request) => {
      const messages = {
        approve: 'Bạn có chắc chắn muốn duyệt yêu cầu mượn sách này?',
        reject: 'Bạn có chắc chắn muốn từ chối yêu cầu mượn sách này?',
        return: 'Bạn có chắc chắn muốn đánh dấu sách này đã được trả?'
      };

      const statusMap = {
        approve: 'Đã duyệt',
        reject: 'Từ chối',
        return: 'Đã trả'
      };

      if (await showConfirm(messages[action])) {
        await updateStatus(request._id, statusMap[action]);
      }
    };

    const updateStatus = async (id, status) => {
      loading.value = true;
      try {
        await store.dispatch('borrow/updateBorrowStatus', { id, status });
        proxy.$toast.show('Cập nhật trạng thái thành công', 'success');
        await fetchBorrowRequests();
      } catch (error) {
        proxy.$toast.show(error.response?.data?.message || 'Có lỗi xảy ra', 'danger');
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchBorrowRequests);

    return {
      currentTab,
      loading,
      searchTerm,
      filteredRequests,
      formatDate,
      getStatusBadgeClass,
      getQuantityClass,
      showConfirmAction,
      updateStatus
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
.text-danger {
  color: #dc3545 !important;
}
.text-warning {
  color: #ffc107 !important;
}
.text-success {
  color: #198754 !important;
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