<template>
  <div class="home-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-md-8 mx-auto text-center">
          <h1 class="display-4 mb-4">Chào mừng đến với Thư viện PL</h1>
          <p class="lead mb-5">
            Khám phá kho tàng sách phong phú của chúng tôi và tận hưởng trải nghiệm đọc sách tuyệt vời.
          </p>
          
          <!-- Thống kê -->
          <div class="row mb-5">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ totalBooks }}</h3>
                  <p class="card-text">Số sách của chúng tôi</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ totalPublishers }}</h3>
                  <p class="card-text">Số nhà xuất bản</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">{{ approvedBooks }}</h3>
                  <p class="card-text">Số sách bạn đã mượn</p>
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
  <footer class="footer mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4">
          <h5>Về chúng tôi</h5>
          <p>
            Thư viện trực tuyến - nơi kết nối tri thức và đam mê đọc sách. 
            Chúng tôi cam kết mang đến trải nghiệm đọc sách tốt nhất cho độc giả.
          </p>
        </div>
        <div class="col-md-4 mb-4">
          <h5>Liên kết nhanh</h5>
          <ul class="list-unstyled">
            <li><a href="#" @click.prevent="$parent.currentComponent = 'BookList'">Danh sách sách</a></li>
            <li><a href="#" @click.prevent="$parent.currentComponent = 'PublisherList'">Nhà xuất bản</a></li>
            <li><a href="#" @click.prevent="$parent.currentComponent = 'BorrowHistory'">Lịch sử mượn sách</a></li>
          </ul>
        </div>
        <div class="col-md-4 mb-4">
          <h5>Liên hệ</h5>
          <ul class="list-unstyled">
            <li><i class="fas fa-map-marker-alt me-2"></i> Đại học Cần Thơ</li>
            <li><i class="fas fa-phone me-2"></i> 0787933830</li>
            <li><i class="fas fa-envelope me-2"></i> locb2105973@student.ctu.edu.vn</li>
          </ul>
          <div class="social-links mt-3">
            <a href="#" class="me-3"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="me-3"><i class="fab fa-twitter"></i></a>
            <a href="#" class="me-3"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12 text-center">
          <p class="mb-0">
            © B2105973 - {{ currentYear }} Hệ thống Quản lý Thư viện. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
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
    const currentYear = computed(() => new Date().getFullYear());

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
      approvedBooks,
      currentYear
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
.footer {
  padding: 20px 0 20px;
  color: #6c757d;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer h5 {
  color: #0d6efd;
  font-weight: 600;
  margin-bottom: 20px;
}

.footer ul li {
  margin-bottom: 10px;
}

.footer a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.3s;
}

.footer a:hover {
  color: #0d6efd;
}

.social-links a {
  display: inline-block;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white !important;
  transition: transform 0.3s, background-color 0.3s;
}

.social-links a:hover {
  transform: translateY(-3px);
  background-color: #0b5ed7;
}

.footer hr {
  margin: 30px 0;
  border-color: rgba(108, 117, 125, 0.2);
}

.footer i {
  width: 20px;
}
</style>