import '../vendor/semantic-ui/semantic.js'
import '../vendor/semantic-ui/semantic.css'
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import routes from './routes'
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
