<template>
  <div class="home-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-md-8 mx-auto text-center">
          <h1 class="display-4 mb-4">Chào mừng đến với Thư viện</h1>
          <p class="lead mb-5">
            Khám phá kho tàng sách phong phú của chúng tôi và tận hưởng trải nghiệm đọc sách tuyệt vời.
          </p>
          
          <!-- Thống kê -->
          <div class="row mb-5">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ totalBooks }}</h3>
                  <p class="card-text">Tổng số sách</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ totalPublishers }}</h3>
                  <p class="card-text">Nhà xuất bản</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ approvedBooks }}</h3>
                  <p class="card-text">Sách đã mượn</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hướng dẫn -->
          <div class="guide-section">
            <h2 class="mb-4">Hướng dẫn sử dụng</h2>
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">
                      <i class="fas fa-search"></i> Tìm sách
                    </h5>
                    <p class="card-text">
                      Dễ dàng tìm kiếm sách theo tên, tác giả hoặc nhà xuất bản
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">
                      <i class="fas fa-book"></i> Mượn sách
                    </h5>
                    <p class="card-text">
                      Đặt yêu cầu mượn sách và theo dõi trạng thái
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomePage',
  setup() {
    const store = useStore();
    const totalBooks = computed(() => store.getters['book/allBooks'].length);
    const totalPublishers = computed(() => store.getters['publisher/allPublishers'].length);
    
    // Sửa lại cách tính số sách đã mượn
    const approvedBooks = computed(() => {
      return store.getters['borrow/borrowHistory'].filter(
        item => item.trangThai === 'Đã duyệt'
      ).length;
    });

    onMounted(async () => {
      await Promise.all([
        store.dispatch('book/fetchBooks'),
        store.dispatch('publisher/fetchPublishers'),
        store.dispatch('borrow/fetchBorrowHistory')
      ]);
    });

    return {
      totalBooks,
      totalPublishers,
      approvedBooks
    };
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.guide-section .card {
  background-color: rgba(255, 255, 255, 0.9);
}

.guide-section .card-title {
  color: #0d6efd;
}

.guide-section .fas {
  margin-right: 8px;
}
</style>