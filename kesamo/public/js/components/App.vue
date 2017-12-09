<template lang="pug">
.container
  tab-view
  .ksm_center-without-header(v-if='isUserLoading')
    loading
  template(v-else)
    router-view.content(v-if="user" :routines='routines' :user='user' @routines-updated='updateRoutines')
    .ksm_center-without-header(v-else)
      button.login-button(@click="login")
        | Login with Google
</template>

<style lang="stylus" scoped>
.container
  width 100vw
  height 100vh
  & .content
    height calc(100vh - 60px)
  & .login-button
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
import Loading from './Loading.vue';

export default {
  components: {
    TabView,
    Loading,
  },
  data() {
    return {
      user: null,
      routines: null,
      isUserLoading: false,
    }
  },
  created() {
    if (!this.user) this.isUserLoading = true;
    fb.addAuthStateChangedEventListener((user) => {
      this.isUserLoading = false;
      console.log('user: ',user);
      if (user) {
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        console.log('filterd user: ',this.user);
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
