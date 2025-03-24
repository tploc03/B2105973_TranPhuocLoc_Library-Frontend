import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from './components/Toast.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);

// Toast plugin
const toast = {
  install: (app) => {
    const toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
    const toastInstance = createApp(Toast).mount(toastContainer);
    
    app.config.globalProperties.$toast = {
      show(message, type = 'success') {
        toastInstance.addToast(message, type);
      }
    };
  }
};

app.use(store);
app.use(toast);
app.use(router);

app.mount('#app');