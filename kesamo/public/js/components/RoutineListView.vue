<template lang='pug'>
mixin list-items
  .list-item_wrapper(v-for='(routine_, i) in routines_')
    routine-list-item(
      :routine_='routine_'
      :i='i'
      :selectedIndex='selectedIndex' :editingIndex='editingIndex' :draggingIndex='draggingIndex'
      @save-quick-edit-result='saveQuickEditResult'
      @delete-routine='deleteRoutine'
      @enable-drag='enableDrag'
      @start-edit-if-double-tapped='startEditIfDoubleTapped'
      @show-edit-modal='showEditModal'
    )
.container
  .ksm_center-without-header(v-if='isRoutineLoading')
    loading
  template(v-else)
    #p2rfix
      ul.list
        draggable(v-if='this.draggingIndex !== null' v-model='routines_' @end='endDrag')
          +list-items
          .empty
        template(v-else)
          +list-items
          .empty
      .footer-button.create(@click='createRoutine()')
        p: | ＋
  modal(heading='Edit Routine' :values='modalValues' v-if='showModal' @modal-closed='saveEditModalResult')
</template>

<script>
import Draggable from 'vuedraggable';
import RoutineListItem from './RoutineListItem.vue'
import Loading from './Loading.vue';
import Modal from './Modal.vue';

import fb from '../firebase-adapter';
import Routines from '../models/Routines';
const USE_MODAL = true;
let timer = null;

export default {
  components: {
    Draggable,
    RoutineListItem,
    Loading,
    Modal,
  },
  props: {
    routines: {
      type: Routines,
      default: null,
    },
    currentRoutineIndex: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      selectedIndex: null,
      editingIndex: null,
      draggingIndex: null,
      routines_: [], // only values of Routines class
      oldRoutine: null,
      isRoutineLoading: false,
      showModal: false,
      modalValues: {},
      tappedTitleIndex: -1,
    };
  },
  created() {
    if (this.routines) {
      this.routines_ = this.routines.getValues();
      this.$nextTick(() => this.selectAndScrollTo(this.currentRoutineIndex));
    } else {
      this.isRoutineLoading = true;
    }
    $(document).click((e) => {
      if(!$(e.target).closest('.list-item').length) {
        this.unselect();
        this.draggingIndex = null;
      }
    });
  },
  watch: {
    routines: {
      handler(val) {
        this.routines_ = val.values;
        this.isRoutineLoading = false;
      },
      deep: true
    },
    isRoutineLoading(val) {
      if (!this.isRoutineLoading) {
        // disable 'pull-to-refresh' action of android's chrome
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
        this.endEditIfNeeded(this.editingIndex);
      }
    },
    selectAndScrollTo(i) {
      this.select(i);
      window.location.hash = `#${i}`
    },
    createRoutine(index) {
      let i;
      if (index === undefined) {
        i = this.selectedIndex !== null ? this.selectedIndex + 1 : this.routines_.length;
      } else {
        i = index;
      }
      this.routines_.splice(i, 0, {title: ''});
      this.$nextTick(() => {
        this.startEdit(i);
      });
    },
    startEditIfDoubleTapped(i, event) {
      if (this.tappedTitleIndex === i) {
        this.startEdit(i);
        event.preventDefault();
        this.tappedTitleIndex = -1;
      } else {
        this.select(i);
        this.tappedTitleIndex = i;
        setTimeout(() => { this.tappedTitleIndex = -1 }, 350);
      }
    },
    startEdit(i, useModal) {
      this.draggingIndex = null;
      if (!this.routines_[i]) return;
      this.editingIndex = i;
      this.$nextTick(() => {
        this.selectedIndex = i;
      });
      if (!useModal) {
        this.focusInput(i);
        try {
          this.oldRoutine = JSON.parse(JSON.stringify(this.routines_[i]));
        } catch(e) {
          this.oldRoutine = null;
        }
      }
    },
    focusInput(i) {
      this.$nextTick(() => {
        $('#input' + i).focus();
      });
    },
    endEditIfNeeded(i) {
      if (this.showModal) return null;
      return this.endEdit(i);
    },
    endEdit(i) {
      this.editingIndex = null;
      if (!this.routines_[i]) return;
      if (this.routines_[i].title === '' && this.oldRoutine) {
        // restore old value when title empty
        this.routines_[i] = JSON.parse(JSON.stringify(this.oldRoutine));
        try {
          this.routines_[i] = JSON.parse(JSON.stringify(this.routines_[i]));
        } catch(e) {
          this.routines_[i] = {title: ''};
        }
      }
      if (this.routines_[i].title === '') {
        this.deleteRoutine(i);
        return false;
      } else {
        this.updateRoutines(this.routines_);
        return true;
      }
    },
    deleteRoutine(i) {
      this.routines_.splice(i, 1);
      this.unselect();
      this.editingIndex = null;
      this.updateRoutines(this.routines_);
    },
    endDrag(e) {
      this.select(e.newIndex);
      this.updateRoutines(this.routines_);
      this.draggingIndex = null;
    },
    updateRoutines(arr) {
      this.$emit('routines-updated', arr);
      // fb.updateRoutines(routines);
    },
    enableDrag(i) {
      if (i !== this.draggingIndex) this.draggingIndex = null;
      this.select(i);
      this.draggingIndex = i;
    },
    showEditModal(i) {
      this.startEdit(i, USE_MODAL);
      const title = this.routines_[i].title;
      const description = this.routines_[i].description;
      const daysOfTheWeek = this.routines_[i].daysOfTheWeek;
      const isForOnlySomeDays = this.routines_[i].isForOnlySomeDays;
      this.modalValues = {
        title: title,
        description: description ? description : '',
        daysOfTheWeek: daysOfTheWeek,
        isForOnlySomeDays: isForOnlySomeDays
      };
      this.showModal = true;
    },
    saveEditModalResult(command, result) {
      this.showModal = false;
      if (command === 'DELETE') {
        this.deleteRoutine(this.editingIndex);
      } else if (command === 'SAVE' && result) {
        this.routines_[this.editingIndex].title = result.title;
        this.routines_[this.editingIndex].description = result.description;
        this.routines_[this.editingIndex].daysOfTheWeek = result.daysOfTheWeek;
        this.routines_[this.editingIndex].isForOnlySomeDays = result.isForOnlySomeDays;
      }
      this.endEdit(this.editingIndex);
    },
    saveQuickEditResult(i, title) {
      this.routines_[i].title = title;
      this.endEditIfNeeded(i);
    }
  }
};
</script>

<style lang='stylus' scoped>
.list
  overflow scroll
  height calc(100vh - 60px)
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
