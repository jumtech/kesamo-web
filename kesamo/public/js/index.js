import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import routes from './routes'
import { FIREBASE_CONFIG } from  './_config';
import firebase from 'firebase';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

window.onload = () => {
  new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
};

const config = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DATABASE_URL,
  projectId: FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};
firebase.initializeApp(config);
