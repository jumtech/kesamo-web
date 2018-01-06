<template lang='pug'>
mixin list-items
  li.list-item(v-for='(routine, i) in routines_' :class='{selected: selectedIndex === i, dragged: draggingIndex === i}' :id='i')
    template(v-if='editingIndex === i')
      p.title
        input(:id='"input" + i' v-model='routines_[i].title' @blur='endEditIfNeeded(i)')
      .icon.delete(@click='deleteRoutine(i)')
        i.fa.fa-trash(aria-hidden='true')
    template(v-else)
      .icon.drag(@click='enableDrag(i)')
        i.fa.fa-bars(aria-hidden='true')
      .list-item-content
        p.title(@click='startEdit(i)'): | {{routine.title}}
        .icon.edit(@click='showEditModal(i)')
          i.fa.fa-pencil(aria-hidden='true')

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
      modalValues: {title: 'parent-title', description: 'parent-description'},
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

    $(document).keyup((e) => {
      switch (e.which) {
        case KEYCODE_ENTER:
          if (this.editingIndex !== null) {
              const i = this.editingIndex;
              if (!this.routines_[i] || !this.endEditIfNeeded(this.editingIndex)) return;
              if (i !== this.routines_.length - 1) {
                this.select(i + 1);
              } else {
                this.createRoutine(this.routines_.length);
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
        this.routines_ = val.values;
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
    startEdit(i, event) {
      this.draggingIndex = null;
      if (!this.routines_[i]) return;
      this.editingIndex = i;
      this.$nextTick(() => {
        this.selectedIndex = i;
      });
      this.focusInput(i);
      try {
        this.oldRoutine = JSON.parse(JSON.stringify(this.routines_[i]));
      } catch(e) {
        this.oldRoutine = null;
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
      this.startEdit(i);
      const title = this.routines_[this.editingIndex].title;
      const description = this.routines_[this.editingIndex].description;
      const daysOfTheWeek = this.routines_[this.editingIndex].daysOfTheWeek;
      this.modalValues = {
        title: title,
        description: description ? description : '',
        daysOfTheWeek: daysOfTheWeek
      };
      this.showModal = true;
    },
    saveEditModalResult(result) {
      this.showModal = false;
      if (result) {
        this.routines_[this.editingIndex].title = result.title;
        this.routines_[this.editingIndex].description = result.description;
        this.routines_[this.editingIndex].daysOfTheWeek = result.daysOfTheWeek;
      }
      this.endEdit(this.editingIndex);
    }
  }
};
</script>

<style lang='stylus' scoped>
$icon-raw-width = 20px
$icon-side-padding = 20px
.list
  overflow scroll
  height calc(100vh - 60px)
  & .list-item
    display flex
    align-items center
    border solid 1px #BFBFBF
    background-color #FFFFFF
    &-content
      display flex
      align-items center
      width "calc(100vw - (%s + %s * 2))" % ($icon-raw-width $icon-side-padding)
    & .title
      padding 20px 10px 20px 20px
      flex-grow 1
      font-size 1.6rem
      word-break break-all
      & input
        width 100%
        font-size 1.6rem
    & .icon
      width "calc(%s + %s * 2)" % ($icon-raw-width $icon-side-padding)
      font-size 1.6rem
      padding 20px $icon-side-padding
      &.delete
        color #B80228
    &.selected
      background-color #EBF7DA
      & .list-item-content
        background-color #EBF7DA
      &.dragged
        background-color #538D8F
        box-shadow 2px 2px 20px #7F7F7F
        position relative
        & .list-item-content
          background-color #EBF7DA
        & .icon.drag
          background-color #538D8F
          color #EBF7DA
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
