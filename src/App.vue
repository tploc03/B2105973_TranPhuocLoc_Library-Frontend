<template>
  <div class="app-container">
    <Toast />
    <router-view></router-view>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue'

export default {
  name: 'App',
  components: {
    Toast
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  min-height: 100vh;
  background-image: url('@/assets/nen.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: -1;
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
}

.table {
  background-color: rgba(255, 255, 255, 0.95);
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.98);
}

.navbar {
  background-color: rgba(13, 110, 253, 0.95) !important;
}
</style>