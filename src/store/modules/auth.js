import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userType: localStorage.getItem('userType') || null, // 'admin' hoặc 'reader'
    loading: false,
    error: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER_TYPE(state, type) {
      state.userType = type;
      localStorage.setItem('userType', type);
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    }
  },
  actions: {
    async loginStaff({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await api.post('/auth/staff/login', credentials);
        commit('SET_USER', response.data.nhanvien);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER_TYPE', 'admin');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Đăng nhập thất bại');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async loginReader({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await api.post('/auth/reader/login', credentials);
        commit('SET_USER', response.data.docgia);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER_TYPE', 'reader');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Đăng nhập thất bại');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async registerReader({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await api.post('/auth/reader/register', userData);
        commit('SET_USER', response.data.docgia);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER_TYPE', 'reader');
        return response;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Đăng ký thất bại');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateProfile({ commit, state }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await api.put('/docgia/profile', userData);
        const updatedUser = { ...state.user, ...response.data };
        commit('SET_USER', updatedUser);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Cập nhật thông tin thất bại');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH');
    },

    clearError({ commit }) {
      commit('SET_ERROR', null);
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.userType === 'admin',
    isReader: state => state.userType === 'reader',
    currentUser: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
};