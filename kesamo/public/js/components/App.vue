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
import firebase from 'firebase';

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
    console.log('firebase.auth().currentUser: ',firebase.auth().currentUser)
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('user: ',user);
      this.user = user;
    } else {
      console.log('user: ',user);
    }
    });


  },
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithPopup(provider).then((result) => {
            if (result) this.user = result.user;
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = error.credential;
            console.error(errorCode + ' error: ' + errorMessage);
          });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
  }
};
</script>
