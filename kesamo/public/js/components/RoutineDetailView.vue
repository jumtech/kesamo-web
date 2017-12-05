<template lang='pug'>
.container
  template(v-if='routineValues && routineValues.length > 0')
    p.title
      | {{routineValues[currentIndex].title}}
    .left.side(v-if='currentIndex > 0' @click='go(-1)')
    .right.side(v-if='currentIndex < routineValues.length - 1' @click='go(1)')
</template>

<style lang='stylus' scoped>
.container
  display flex
  justify-content center
  align-items center
  & .side
    width 200px
    height calc(100vh - 150px)
    position absolute
    &.left
      left 0
    &.right
      right 0
  & .title
    font-size 5.4rem
</style>

<script>
import Routines from '../models/Routines';

export default {
  data() {
    return {
      routineValues: null,
      currentIndex: 0,
    };
  },
  props: {
    routines: {
      type: Routines,
      default: null
    },
  },
  created() {
    if (this.routines) {
      this.routineValues = this.routines.getValues();
    }
  },
  methods: {
    go(n) {
      this.currentIndex += n;
    }
  }
};
</script>
