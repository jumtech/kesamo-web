import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import routes from './routes'
import fb from './firebase-adapter';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes
});
fb.init();

window.onload = () => {
  new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./dist/serviceWorker.js")
      .then((registration) => {
        console.log("serviceWorker registed.");
      }).catch((error) => {
        console.warn("serviceWorker error.", error);
      });
  }
};

