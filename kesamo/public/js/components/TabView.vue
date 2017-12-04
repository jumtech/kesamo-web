<template lang='pug'>
.container
  .tab-item(v-bind:class='{ selected: isRoutineSelected }' @click='select("routine")')
    .tab-link
      router-link(to='routine')
        | □
  .tab-item(v-bind:class='{ selected: !isRoutineSelected }' @click='select("routines")')
    .tab-link
      router-link(to='routines')
        | ≡
</template>

<style lang='stylus' scoped>
.container
  display flex
  width 100%
  height 100px
  padding 5px 0 5px 0
.tab-item
  flex-grow 1
  text-align center
  display flex
  justify-content center
  align-items center
  &.selected .tab-link a
    color red
.tab-link a
  font-size 5.4rem
</style>

<script>
export default {
  data() {
    return {
      isRoutineSelected: true
    };
  },
  methods: {
    select(tabName) {
      this.isRoutineSelected = tabName === 'routine' ? true : false;
      console.log("this.selisRoutineSelectedected: ",this.isRoutineSelected);
      return;
    },
  },
};
</script>
