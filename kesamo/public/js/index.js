import Vue from 'vue';
import App from './components/App.vue';
import '../vendor/semantic-ui/semantic.js'
import '../vendor/semantic-ui/semantic.css'

window.onload = () => {
  new Vue({
    el: '#app',
    render: h => h(App)
  });
};
