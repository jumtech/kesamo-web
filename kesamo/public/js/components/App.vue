<template lang="pug">
.container
  tab-view
  router-view(:routines='routines' @routines-updated='updateRoutines').content(v-if="user")
  .login(v-else)
    button(@click="login")
      | Googleでログイン
</template>

<style lang="stylus" scoped>
.content
  height calc(100vh - 60px)
.login
  & button
    font-size 2.4rem
</style>

<script>
import TabView from './TabView.vue';
import fb from '../firebase-adapter';
import Routines from '../models/Routines';

export default {
  components: {
    TabView,
  },
  data() {
    return {
      user: null,
      routines: null,
    }
  },
  created() {
    fb.addAuthStateChangedEventListener((user) => {
      console.log('[authStateChanged] user: ',user);
      if (user) {
        this.user = user;
        fb.addValueEventListener('routines', (snapshot) => {
          console.log('[addValueEventListener] snapshot.val(): ',snapshot.val());
          this.routines = snapshot.val() ? new Routines(snapshot.val()) : new Routines([]);
        });
      }
    });
  },
  methods: {
    login() {
      fb.login((result) => {
        if (result && result.user) {
          console.log('login succeeded.');
        }
      },(err) => {
        console.warn('login error: ', err);
      });
    },
    updateRoutines(values) {
      this.routines.saveValues(values);
    },
  }
};
</script>
