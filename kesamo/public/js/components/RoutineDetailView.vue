<template lang='pug'>
.container
  template(v-if='routineValues && routineValues.length > 0')
    p.title
      | {{routineValues[currentIndex].title}}
    .side-tap-area.left(v-if='currentIndex > 0' @click='go(-1)')
      .arrow-icon.left
    .side-tap-area.right(v-if='currentIndex < routineValues.length - 1' @click='go(1)')
      .arrow-icon.right
    .accout-button(@click='toggleAccount')
      i(class='fa fa-user-o' aria-hidden='true')
    .balloon.account(v-if='showAccount')
      .profile-container
        img.photo(:src='user.photoURL')
        .profile
          .name
            | {{user.displayName}}
          .email
            | {{user.email}}
          button.logout(@click='logout')
            | logout
</template>

<style lang='stylus' scoped>
.container
  display flex
  justify-content center
  align-items center
  & .title
    font-size 2.4rem
  & .side-tap-area
    width 120px
    height calc(100vh - 60px)
    position absolute
    display flex
    justify-content center
    align-items center
    &.left
      left 0
    &.right
      right 0
    & .arrow-icon
      width 15px
      height 15px
      box-sizing border-box
      border 15px solid transparent
      &.left
        margin-right 90px
        border-right 15px solid #B80228
      &.right
        margin-left 90px
        border-left 15px solid #B80228
  & .accout-button
    position absolute
    left 20px
    bottom 20px
    font-size 1.6rem
  & .balloon
    position absolute
    left 15px
    bottom 70px
    width calc(100vw - 30px)
    max-width 400px
    height 90px
    background-color #EBF7DA
    border-radius 5px
    &::before
      content ''
      position absolute
      display block
      width 0
      height 0
      border solid 10px transparent
      border-top solid 20px #EBF7DA
      left 7px
      top 88px
    & .profile-container
      display flex
      padding 15px 15px 15px 15px
      & .photo
        width 60px
        height 60px
        border-radius 30px
      & .profile
        width calc(100% - 50px)
        & .name
          margin 0 0 8px 10px
          font-size 0.9rem
          color #404040
        & .email
          margin 8px 0 0 8px
          font-size 0.9rem
          color #7F7F7F
        & .logout
          width 100%
          font-size 0.9rem
          color #B80228
          text-decoration underline
          text-align right
          &:hover
            color #FF0337
          &:active
            color #980220
</style>

<script>
import Routines from '../models/Routines';
import fb from '../firebase-adapter';

export default {
  data() {
    return {
      routineValues: null,
      currentIndex: 0,
      showAccount: false,
    };
  },
  props: {
    routines: {
      type: Routines,
      default: null
    },
    user: {
      type: Object,
      default: null
    },
  },
  created() {
    if (this.routines) {
      this.routineValues = this.routines.getValues();
    }
  },
  watch: {
    routines: {
      handler(val) {
        this.routineValues = val.values;
      },
      deep: true
    }
  },
  methods: {
    go(n) {
      this.currentIndex += n;
    },
    toggleAccount() {
      this.showAccount = !this.showAccount;
    },
    logout() {
      fb.logout(() => {
        location.href = '/';
      }, (err) => {
        console.error('logout error: ', err);
      });
    }
  }
};
</script>
