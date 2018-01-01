<template lang='pug'>
mixin list-items
  li.list-item(v-for='(routine, i) in routineValues' :class='{selected: selectedIndex === i, dragged: draggingIndex === i}')
    template(v-if='editingIndex === i')
      p.title
        input(:id='"input" + i' v-model='routineValues[i].title' @blur='endEdit(i)')
      .icon.delete(@click='deleteRoutine(i)')
        i(class='fa fa-trash' aria-hidden='true')
    template(v-else)
      p.title(@touchstart='itemTouchStart(i)' @touchend='itemTouchEnd(i)'): | {{routine.title}}
      //- .icon.edit(@click='startEdit(i)')
      .icon.edit(@click='showEditModal')
        i(class='fa fa-pencil' aria-hidden='true')

.container
  .ksm_center-without-header(v-if='isRoutineLoading')
    loading
  template(v-else)
    #p2rfix
      ul.list
        draggable(v-if='this.draggingIndex !== null' v-model='routineValues' @end='endDrag')
          +list-items
          .empty
        template(v-else)
          +list-items
          .empty
      .footer-button.create(@click='createRoutine()')
        p: | ＋
  modal(heading='Edit Routine' v-if='showModal' @modal-closed='saveEditResult')
</template>

<style lang='stylus' scoped>
.list
  overflow scroll
  height calc(100vh - 60px)
  & .list-item
    display flex
    align-items center
    border solid 1px #BFBFBF
    &.selected
      background-color #EBF7DA
    &.dragged
      background-color #F3FFE1
      box-shadow 2px 2px 20px #7F7F7F
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
  & .empty
    width 100%
    height 100px

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
import Draggable from 'vuedraggable';
import fb from '../firebase-adapter';
import Routines from '../models/Routines';
import Loading from './Loading.vue';
import Modal from './Modal.vue';
const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;
let timer = null;

export default {
  components: {
    Loading,
    Draggable,
    Modal,
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
      draggingIndex: null,
      routineValues: [], // Routines classのvaluesのみ
      oldRoutine: null,
      isRoutineLoading: false,
      showModal: false,
    };
  },
  created() {
    if (this.routines) {
      this.routineValues = this.routines.getValues();
    } else {
      this.isRoutineLoading = true;
    }
    $(document).click((e) => {
      if(!$(e.target).closest('.list-item').length) {
        this.unselect();
        this.draggingIndex = null;
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
        this.isRoutineLoading = false;
      },
      deep: true
    },
    isRoutineLoading(val) {
      if (!this.isRoutineLoading) {
        // disable "pull-to-refresh" action of android's chrome
        this.$nextTick(() => {
          if(window.navigator.userAgent.toLowerCase().indexOf('chrome')!=-1){var i,s,o;i=document;i.getElementsByTagName('html')[0].style.height='100%';s=i.getElementsByTagName('body')[0].style;s.height='100%';s.overflowY='hidden';o=i.getElementById('p2rfix').style;o.height='100%';o.overflow='auto';}
        });
      }
    },
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
      this.draggingIndex = null;
    },
    updateRoutines(arr) {
      this.$emit('routines-updated', arr);
      // fb.updateRoutines(routines);
    },
    itemTouchStart(i) {
      if (i !== this.draggingIndex) this.draggingIndex = null;
      this.select(i);
      timer = setTimeout(() => {
        this.draggingIndex = i;
        this.unselect();
      }, 500);
    },
    itemTouchEnd(i) {
      clearTimeout(timer);
    },
    showEditModal() {
      this.showModal = true;
    },
    saveEditResult(result) {
      this.showModal = false;
      console.log("@@@result: ",result);
    }
  }
};
</script>
