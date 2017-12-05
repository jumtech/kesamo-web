import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import routes from './routes'
import fb from './firebase-adapter';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});
fb.init();
console.log('fb.init()');
console.log('fb: ',fb);

window.onload = () => {
  new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
};

