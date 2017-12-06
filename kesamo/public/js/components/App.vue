<template lang="pug">
.container
  tab-view
  router-view(:routines='routines' @routines-updated='updateRoutines').content(v-if="user")
  .login(v-else)
    button.login-button(@click="login")
      | Login with Google
</template>

<style lang="stylus" scoped>
.container
  width 100vw
  height 100vh
.content
  height calc(100vh - 60px)
.login
  width 100vw
  height calc(100vh - 60px)
  display flex
  justify-content center
  align-items center
  &-button
    padding 10px 10px 10px 10px
    font-size 1.2rem
    background-color #538D8F
    border-radius 5px
    color white
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
