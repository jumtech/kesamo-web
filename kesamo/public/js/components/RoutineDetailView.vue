<template lang='pug'>
.container
  p.title
    | {{routines[currentIndex].title}}
  .left.side(v-if='currentIndex > 0' @click='go(-1)')
  .right.side(v-if='currentIndex < routines.length - 1' @click='go(1)')
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
import fb from '../firebase-adapter';

export default {
  data() {
    return {
      title: 'Wake up!',
      routines: [],
      currentIndex: 0,
    };
  },
  created() {
    this.routines = [
      { title: 'Wake up!' },
      { title: 'Put away the futon!' },
      { title: 'Brush your theeth!' },
    ]
  },
  methods: {
    go(n) {
      this.currentIndex += n;
    }
  }
};
</script>
