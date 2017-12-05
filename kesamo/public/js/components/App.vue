<template lang="pug">
.container
  tab-view
  router-view.content(v-if="user")
  .login(v-else)
    button(@click="login")
      | Googleでログイン
</template>

<style lang="stylus" scoped>
.content
  height calc(100vh - 150px)
.login
  & button
    font-size 5.4rem
</style>

<script>
import TabView from './TabView.vue';
import fb from '../firebase-adapter';

export default {
  components: {
    TabView,
  },
  data() {
    return {
      user: null,
    }
  },
  created() {
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     console.log('user: ',user);
    //     this.user = user;
    //   } else {
    //     console.log('user: ',user);
    //   }
    // });
  },
  methods: {
    login() {
      fb.login((result) => {
        if (result) this.user = result.user;
      },(err) => {
        console.warn('login error: ', err);
      });
    },
  }
};
</script>
