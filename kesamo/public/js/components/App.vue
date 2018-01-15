<template lang='pug'>
.container
  tab-view
  .ksm_center-without-header(v-if='isUserLoading')
    loading
  template(v-else)
    router-view.content(v-if='user'
      :routines='routines'
      :user='user'
      :currentFilterdRoutineIndex='currentFilterdRoutineIndex'
      :currentRoutineIndex='currentRoutineIndex'
      @routines-updated='updateRoutines'
      @current-routine-index-updated='updateCurrentRoutineIndex'
    )
    .ksm_center-without-header(v-else)
      .login-container
        button.login-button(@click='login')
          span Sign In with with Google
        .exemption-from-responsibility
          span
            | By signing up, you are indicating that you have read and aggree to the 
            a(href='#') Privacy Policy
            | .
</template>

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
      currentFilterdRoutineIndex: 0,
      currentRoutineIndex: 0
    }
  },
  created() {
    if (!this.user) this.isUserLoading = true;
    fb.addAuthStateChangedEventListener((user) => {
      this.isUserLoading = false;
      if (user) {
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        fb.addValueEventListener('routines', (snapshot) => {
          this.routines = snapshot.val() ? new Routines(snapshot.val()) : new Routines([]);
        });
      }
    });
  },
  methods: {
    login() {
      fb.login((result) => {
        if (result && result.user) {
          console.info('login succeeded.');
        }
      },(err) => {
        console.warn('login error: ', err);
      });
    },
    updateRoutines(values) {
      this.routines.saveValues(values);
    },
    updateCurrentRoutineIndex(result) {
      this.currentFilterdRoutineIndex = result.filterdIndex;
      this.currentRoutineIndex = result.index;
    },
  }
};
</script>

<style lang='stylus' scoped>
.container
  width 100vw
  height 100vh
  & .content
    height calc(100vh - 60px)
  & .login-container
    width 290px
    display flex
    flex-direction column
    & .login-button
      padding 10px 10px 10px 10px
      font-size 1.2rem
      background-color #538D8F
      border-radius 5px
      color white
    & .exemption-from-responsibility
      text-align center
      margin 30px 0 0 0
      & span
        color #7F7F7F
        font-size 0.8rem
        & a
          text-decoration underline
</style>