<template lang='pug'>
.container
  ul.list
    draggable(v-model='routineValues' @end='endDrag')
      li.list-item(v-for='(routine, index) in routineValues' :class='{selected: selectedIndex === index}')
        template(v-if='editingIndex === index')
          p.title(@click='select(index)')
            input(v-model='routineValues[index].title' @blur='endEdit()')
          .icon.delete(@click='deleteRoutine(index)')
            i(class='fa fa-trash' aria-hidden='true')
        template(v-else)
          p.title(@click='select(index)'): | {{routine.title}}
          .icon.edit(@click='startEdit(index)')
            i(class='fa fa-pencil' aria-hidden='true')
  .footer-button.create(@click='createRoutine')
    p: | ＋
  .footer-button.logout(@click='logout')
    p: i(class='fa fa-sign-out' aria-hidden='true')
</template>

<style lang='stylus' scoped>
.list-item
  display flex
  font-size 1.6rem
  border solid 1px #BFBFBF
  &.selected
    background-color #EBF7DA
  & .title
    flex-grow 1
    padding 20px 20px 20px 20px
    & input
      font-size 1.6rem
  & .icon
    width 50px
    font-size 1.6rem
    padding 20px 20px 20px 10px
    &.delete
      color #B80228
.logout
  width 100%
  font-size 1.6rem
  text-align center
  bottom 0
.footer-button
  position absolute
  bottom 10px
  width 60px
  height 60px
  border-radius 30px
  background-color #538D8F
  font-size 2.4rem
  color #EBF7DA
  box-shadow 5px 5px 20px #7F7F7F
  &.create
    right 84px
  &.logout
    right 12px
  & p
    position absolute
    margin auto
    width 40px
    height 40px
    top 0
    right 0
    bottom 0
    left 0
</style>

<script>
import draggable from 'vuedraggable';
import fb from '../firebase-adapter';
import Routines from '../models/Routines';

export default {
  components: {
    draggable
  },
  props: {
    routines: { // 親から受け取ったRoutines class(子はread only)
      type: Routines,
      default: null,
    },
  },
  data() {
    return {
      selectedIndex: null,
      editingIndex: null,
      routineValues: [], // Routines classのvaluesのみ
    };
  },
  created() {
    if (this.routines) {
      this.routineValues = this.routines.getValues();
    }
    console.log('[routineListView created]this.routineValues: ',this.routineValues);
  },
  watch: {
    routines: {
      handler(val) {
        console.log('parent routines changed: ',val);
        this.routineValues = val.values;
      },
      deep: true
    }
  },
  methods: {
    select(i) {
      this.selectedIndex = i;
    },
    createRoutine() {
      const i = this.selectedIndex !== null ? this.selectedIndex + 1 : this.routineValues.length;
      this.routineValues.splice(i, 0, {title: ''});
      this.updateRoutines(this.routineValues);
    },
    startEdit(i) {
      this.editingIndex = i;
    },
    endEdit() {
      this.editingIndex = null;
      this.updateRoutines(this.routineValues);
    },
    deleteRoutine() {
      this.routineValues.splice(this.editingIndex, 1);
      this.selectedIndex = null;
      this.editingIndex = null;
      this.updateRoutines(this.routineValues);
    },
    endDrag(e) {
      this.select(e.newIndex);
      this.updateRoutines(this.routineValues);
    },
    updateRoutines(arr) {
      this.$emit('routines-updated', arr);
      // fb.updateRoutines(routines);
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
