<template lang='pug'>
.container.ksm_center-without-header
  loading(v-if='isRoutineLoading')
  template(v-if='!isRoutineLoading && routines_ && routines_.length > 0 && routines_[currentIndex_]')
    .routine
      p.title
        | {{routines_[currentIndex_].title}}
      .description(v-if='descriptions[currentIndex_]')
        p.description-line(v-for='line in descriptions[currentIndex_]')
          | {{line}}
    .side-tap-area.left(v-if='currentIndex_ > 0' @click='advanceRoutine(-1)')
      .arrow-icon.left
    .side-tap-area.right(v-if='currentIndex_ < routines_.length - 1' @click='advanceRoutine(1)')
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
        .logout
          button(@click='logout')
            | logout
</template>

<script>
import Routines from '../models/Routines';
import fb from '../firebase-adapter';
import Loading from './Loading.vue';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      routines_: null,
      currentIndex_: 0,
      showAccount: false,
      isRoutineLoading: false,
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
    currentFilterdRoutineIndex: {
      type: Number,
      default: 0
    },
    currentRoutineIndex: {
      type: Number,
      default: 0
    },
  },
  created() {
    this.currentIndex_ = this.currentFilterdRoutineIndex || 0;
    if (this.routines) {
      const {routines, filterdRoutines} = this.proccessRoutines(this.routines.getValues());
      this.routines_ = filterdRoutines;
      const filterdIndex = this.calcFilterdIndex(this.currentRoutineIndex, routines, filterdRoutines);
      this.currentIndex_ = filterdIndex;
    } else {
      this.isRoutineLoading = true;
    }
  },
  watch: {
    routines: {
      handler(val) {
        this.routines_ = val.values.filter(this.isTodaysRoutine);
        this.isRoutineLoading = false;
      },
      deep: true
    }
  },
  computed: {
    // TODO: make 'RoutineDetail.vue' & delete this computed property
    descriptions() {
      return this.routines_.map((routine) => {
        return routine.description ? routine.description.split('\n') : [];
      });
    }
  },
  methods: {
    proccessRoutines(routines) {
      routines = routines.map((r, i) => {
        r.isTodaysRoutine = this.isTodaysRoutine(r);
        r.index = i;
        return r;
      });
      let filterdRoutines = routines.filter((r) => r.isTodaysRoutine);
      return {routines, filterdRoutines};
    },
    calcFilterdIndex(index, routines, filterdRoutines) {
      let filterdIndex = 0;
      for (let i = index; i > -1; i--) {
        if (routines[i].isTodaysRoutine) {
          filterdIndex = filterdRoutines.findIndex((r) => {
            return r.index === i;
          });
          break;
        }
      }
      return filterdIndex;
    },
    advanceRoutine(n) {
      const i = this.currentIndex_ + n;
      let result = {
        filterdIndex: i,
        index: this.routines_[i].index
      };
      this.$emit('current-routine-index-updated', result);
      this.currentIndex_ = i;
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
    },
    isTodaysRoutine(routine) {
      if (!routine.daysOfTheWeek || !Array.isArray(routine.daysOfTheWeek)) return true;
      const todaysDay = (new Date()).getDay();
      return routine.daysOfTheWeek.includes(todaysDay);
    },
  }
};
</script>


<style lang='stylus' scoped>
.container
  & .routine
      padding 0 50px 0 50px
    & .title
      text-align center
      font-size 2.4rem
    & .description
      margin 30px 0 0 0
      &-line
        margin .8rem 0 0 0
        font-size 1.6rem
        white-space pre-line
        line-height 2.0rem
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
          word-break break-all
        & .logout
          width 100%
          text-align right
          & button
            font-size 0.9rem
            text-decoration underline
            color #B80228
            background-color inherit
            border none
            &:hover
              color #FF0337
            &:active
              color #980220
</style>
