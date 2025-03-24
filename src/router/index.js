import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ReaderDashboard from '../views/ReaderDashboard.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/reader',
    name: 'reader',
    component: ReaderDashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

const initializeAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = localStorage.getItem('userType');
  
  if (token && user) {
    store.commit('auth/SET_TOKEN', token);
    store.commit('auth/SET_USER', user);
    store.commit('auth/SET_USER_TYPE', userType);
  }
};

router.beforeEach((to, from, next) => {
  // Khởi tạo auth khi router bắt đầu
  initializeAuth();
  
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.adminOnly && !isAdmin) {
    next('/');
  } else if (to.meta.guestOnly && isAuthenticated) {
    next(isAdmin ? '/admin' : '/reader');
  } else {
    next();
  }
});

export default router;