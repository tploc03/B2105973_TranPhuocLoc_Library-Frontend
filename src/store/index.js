import { createStore } from 'vuex';
import auth from './modules/auth';
import book from './modules/book';
import publisher from './modules/publisher';
import borrow from './modules/borrow';

export default createStore({
  modules: {
    auth,
    book,
    publisher,
    borrow
  }
});