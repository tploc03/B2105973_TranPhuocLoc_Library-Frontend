import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    books: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchBooks({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/sach');
        commit('SET_BOOKS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createBook({ commit }, bookData) {
      try {
        const response = await api.post('/sach', bookData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async updateBook({ commit }, { id, bookData }) {
      try {
        const response = await api.put(`/sach/${id}`, bookData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async deleteBook({ commit }, id) {
      try {
        await api.delete(`/sach/${id}`);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    }
  },
  getters: {
    allBooks: state => state.books,
    isLoading: state => state.loading,
    error: state => state.error
  }
};