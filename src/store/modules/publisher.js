import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    publishers: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_PUBLISHERS(state, publishers) {
      state.publishers = publishers;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchPublishers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/nhaxuatban');
        commit('SET_PUBLISHERS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createPublisher({ commit }, publisherData) {
      try {
        const response = await api.post('/nhaxuatban', publisherData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async updatePublisher({ commit }, { id, publisherData }) {
      try {
        const response = await api.put(`/nhaxuatban/${id}`, publisherData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async deletePublisher({ commit }, id) {
      try {
        await api.delete(`/nhaxuatban/${id}`);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    }
  },
  getters: {
    allPublishers: state => state.publishers,
    isLoading: state => state.loading,
    error: state => state.error
  }
};