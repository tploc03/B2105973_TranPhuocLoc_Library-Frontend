import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    borrowRequests: [],
    borrowHistory: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_BORROW_REQUESTS(state, requests) {
      state.borrowRequests = requests;
    },
    SET_BORROW_HISTORY(state, history) {
      state.borrowHistory = history;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    // Lấy tất cả yêu cầu mượn sách (cho admin)
    async fetchBorrowRequests({ commit }) {
        commit('SET_LOADING', true);
        try {
        const response = await api.get('/muonsach/admin/requests');
        // Kiểm tra và xử lý dữ liệu trước khi lưu
        const cleanedData = response.data.map(request => ({
            ...request,
            maDocGia: request.maDocGia || { hoLot: 'N/A', ten: '', maDocGia: 'N/A' },
            maSach: request.maSach || { tenSach: 'N/A', maSach: 'N/A' }
        }));
        commit('SET_BORROW_REQUESTS', cleanedData);
        } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Có lỗi xảy ra');
        throw error;
        } finally {
        commit('SET_LOADING', false);
        }
    },

    // Lấy lịch sử mượn sách (cho độc giả)
    async fetchBorrowHistory({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/muonsach/history');
        commit('SET_BORROW_HISTORY', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Tạo yêu cầu mượn sách mới
    async createBorrowRequest({ commit }, bookId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/muonsach/request', { maSach: bookId });
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Cập nhật trạng thái yêu cầu mượn sách
    async updateBorrowStatus({ commit }, { id, status }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/muonsach/admin/requests/${id}`, { trangThai: status });
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR');
    }
  },
  getters: {
    allBorrowRequests: state => state.borrowRequests,
    borrowHistory: state => state.borrowHistory,
    isLoading: state => state.loading,
    error: state => state.error
  }
};