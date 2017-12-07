<template lang='pug'>
mixin list-item
  li.list-item(v-for='(routine, index) in routineValues' :class='{selected: selectedIndex === index}')
    template(v-if='editingIndex === index')
      p.title(@click='select(index)')
        input(:id='"input" + index' v-model='routineValues[index].title' @blur='endEdit(index)')
      .icon.delete(@click='deleteRoutine(index)')
        i(class='fa fa-trash' aria-hidden='true')
    template(v-else)
      p.title(@click='select(index)'): | {{routine.title}}
      .icon.edit(@click='startEdit(index)')
        i(class='fa fa-pencil' aria-hidden='true')

.container
  ul.list
    draggable(v-if='this.editingIndex === null' v-model='routineValues' @end='endDrag')
      +list-item
    template(v-else)
      +list-item
  .footer-button.create(@click='createRoutine()')
    p: | ＋
</template>

<style lang='stylus' scoped>
.list
  overflow scroll
  height calc(100vh - 60px)
.list-item
  display flex
  align-items center
  border solid 1px #BFBFBF
  &.selected
    background-color #EBF7DA
  & .title
    padding 20px 10px 20px 20px
    flex-grow 1
    font-size 1.6rem
    word-break break-all
    & input
      width 100%
      font-size 1.6rem
  & .icon
    width 20px
    font-size 1.6rem
    padding 20px 20px 20px 10px
    &.delete
      color #B80228
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
const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;

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
      oldRoutine: null,
    };
  },
  created() {
    if (this.routines) {
      this.routineValues = this.routines.getValues();
    }
    // handlar for all click event
    $(document).click((e) => {
      if(!$(e.target).closest('.list').length) {
        this.unselect();
      }
    });
    $(document).keyup((e) => {
      switch (e.which) {
        case KEYCODE_ENTER:
          if (this.editingIndex !== null) {
              const i = this.editingIndex;
              if (!this.routineValues[i] || !this.endEdit(this.editingIndex)) return;
              if (i !== this.routineValues.length - 1) {
                this.select(i + 1);
              } else {
                this.createRoutine(this.routineValues.length);
              }
            } else if (this.selectedIndex !== null) {
              this.startEdit(this.selectedIndex);
              return;
            }
          break;
        case KEYCODE_ESC:
          this.unselect();
          break;
      }
   });
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
    select(i) {
      this.selectedIndex = i;
    },
    unselect(i) {
      this.selectedIndex = null;
      if (this.editingIndex !== null) {
        this.endEdit(this.editingIndex);
      }
    },
    createRoutine(index) {
      let i;
      if (index === undefined) {
        i = this.selectedIndex !== null ? this.selectedIndex + 1 : this.routineValues.length;
      } else {
        i = index;
      }
      this.routineValues.splice(i, 0, {title: ''});
      this.$nextTick(() => {
        this.startEdit(i);
      });
    },
    startEdit(i) {
      if (!this.routineValues[i]) return;
      this.editingIndex = i;
      this.$nextTick(() => {
        this.selectedIndex = i;
      });
      this.focusInput(i);
      try {
        this.oldRoutine = JSON.parse(JSON.stringify(this.routineValues[i]));
      } catch(e) {
        this.oldRoutine = null;
      }
    },
    focusInput(i) {
      this.$nextTick(() => {
        $('#input' + i).focus();
      });
    },
    endEdit(i) {
      this.editingIndex = null;
      if (!this.routineValues[i]) return;
      if (this.routineValues[i].title === '' && this.oldRoutine) {
        // restore old value when title empty
        this.routineValues[i] = JSON.parse(JSON.stringify(this.oldRoutine));
        try {
          this.routineValues[i] = JSON.parse(JSON.stringify(this.routineValues[i]));
        } catch(e) {
          this.routineValues[i] = {title: ''};
        }
      }
      if (this.routineValues[i].title === '') {
        this.deleteRoutine(i);
        return false;
      } else {
        this.updateRoutines(this.routineValues);
        return true;
      }
    },
    deleteRoutine(i) {
      this.routineValues.splice(i, 1);
      this.unselect();
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
    }
  }
};
</script>
