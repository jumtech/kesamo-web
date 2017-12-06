<template lang='pug'>
.container
  template(v-if='routineValues && routineValues.length > 0')
    p.title
      | {{routineValues[currentIndex].title}}
    .side-tap-area.left(v-if='currentIndex > 0' @click='go(-1)')
      .arrow-icon.left
    .side-tap-area.right(v-if='currentIndex < routineValues.length - 1' @click='go(1)')
      .arrow-icon.right
</template>

<style lang='stylus' scoped>
.container
  display flex
  justify-content center
  align-items center
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
  & .title
    font-size 2.4rem
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
