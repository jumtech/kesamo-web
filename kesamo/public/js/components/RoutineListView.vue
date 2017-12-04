<template lang='pug'>
.container
  ul.list
    li.list-item(v-for='(routine, index) in routines' :class='{selected: selectedIndex === index}')
      p.title(@click='select(index)'): | {{routine.title}}
      .edit.icon
        i(class='fa fa-pencil' aria-hidden='true')
      .move.icon
        i(class='fa fa-arrows-v' aria-hidden='true')
</template>

<style lang='stylus' scoped>
.list-item
  display flex
  font-size 3.2rem
  border solid 1px #BFBFBF
  &.selected
    background-color #EBF7DA
  & .title
    flex-grow 1
    padding 50px 50px 50px 50px
  & .icon
    width 50px
    font-size 4.0rem
    padding 50px 25px 50px 25px
    height 100%
</style>

<script>
export default {
  data() {
    return {
      selectedIndex: null,
      routines: [],
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
    select(index) {
      this.selectedIndex = index;
    },
  }
};
</script>
