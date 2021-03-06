<template lang='pug'>
transition(name='modal')
  .modal-mask(@click='emitCloseEvent("CANCEL")')
    .modal-wrapper(name)
      .modal-container(@click.stop='')
        .modal-header
          | {{heading}}
        .delete(@click='deleteRoutine')
          i.fa.fa-trash(aria-hidden='true' v-if='!isToDelete')
          span(v-else) delete?
        .modal-body
          .form-group
            .label
              label(for='title')
                | title
            .input
              input#title(v-model='title_' maxlength='30')
          .form-group
            .label
              label(for='description')
                | description
            .input
              textarea#description(v-model='description_')
          .form-group.has-option
            .checkbox
              label
                input(type='checkbox' v-model='isForOnlySomeDays_')
                span: | for only some days of the week
          .form-group.option(v-if='isForOnlySomeDays_')
            .checkbox.flex-row
              .checkbox-item(v-for='DAY in DAYS')
                .checkbox-item-each
                  input(type='checkbox' :value='DAY.VALUE' v-model='daysOfTheWeek_' :id='DAY.SHORT_NAME')
                .checkbox-item-each
                  label(:for='DAY.SHORT_NAME'): | {{DAY.SHORT_NAME}}
        .modal-footer
          .modal-cancel-button
            button(@click='emitCloseEvent("CANCEL")')
              | Cancel
          .modal-ok-button
            button(@click='emitCloseEvent("SAVE")')
              | OK
</template>

<script>
import DAY_OF_THE_WEEK from '../defs/day-of-the-week';

export default {
  props: {
    heading: {
      type: String,
      required: true,
    },
    values: {
      type: Object, // TODO: receive Array & generate form-elems
      default: {
        title: '',
        description: '',
        daysOfTheWeek: [],
        isForOnlySomeDays: false,
      },
    }
  },
  data() {
    return {
      title_: '',
      description_: '',
      daysOfTheWeek_: [],
      isForOnlySomeDays_: false,
      isToDelete: false,
    };
  },
  created() {
    this.title_ = this.values.title || '';
    this.description_ = this.values.description || '';
    this.isForOnlySomeDays_ = this.values.isForOnlySomeDays || false;
    if (Array.isArray(this.values.daysOfTheWeek) && this.values.daysOfTheWeek.length > 0) {
      this.daysOfTheWeek_ = this.values.daysOfTheWeek.map((v) => v.toString());
    }
  },
  computed: {
    DAYS() {
      return DAY_OF_THE_WEEK;
    }
  },
  methods: {
    emitCloseEvent(command) {
      switch (command) {
        case 'CANCEL':
        case 'DELETE':
          this.$emit('modal-closed', command, null);
          break;
        case 'SAVE':
          const days =
            this.daysOfTheWeek_
              .map((v) => Number(v))
              .sort((a, b) => {return a < b ? -1 : 1});
          const result = {
            title: this.title_,
            description: this.description_,
            isForOnlySomeDays: this.isForOnlySomeDays_,
            daysOfTheWeek: days,
          }
          this.$emit('modal-closed', command, result);
          break;
      }
    },
    deleteRoutine() {
      if (!this.isToDelete) {
        this.isToDelete = true;
      } else {
        this.isToDelete = false;
        this.emitCloseEvent('DELETE');
      }
    }
  },
};
</script>

<style lang='stylus' scoped>
$modal-width = 80vw
$modal-padding = 30px
$modal-item-top-margin = 20px
.modal-mask
  position fixed
  z-index 9998
  top 0
  left 0
  width 100%
  height 100%
  background-color rgba(0, 0, 0, .5)
  display table
  transition opacity .3s ease
.modal-wrapper
  display table-cell
  vertical-align middle
.modal-container
  position relative
  width $modal-width
  margin 0 auto 0 auto
  padding $modal-padding
  background-color #fff
  border-radius 2px
  box-shadow 0 2px 8px rgba(0, 0, 0, .33)
  transition all .3s ease
.modal-header
  font-size 1.2rem
  margin 0
  color #538D8F
.delete
  position absolute
  top 30px
  right 30px
  color #B80228
  font-size 1.2rem
  & span
    font-size 1.0rem
    text-decoration underline
.modal-body
  margin $modal-item-top-margin 0
.modal-footer
  padding 10px 0 0 0
  display flex
  justify-content space-around
  & button
    padding 2px 10px
    border 1px solid
    border-radius 5px
    font-size 1.2rem
  & .modal-cancel-button > button
    background-color #EBF7DA
    color #538D8F
  & .modal-ok-button > button
    background-color #538D8F
    color #EBF7DA
.form-group
  margin $modal-item-top-margin 0
  font-size 1.6rem
  &.has-option
    margin-bottom 0
  &.option
    margin-top 0
    margin-left 20px
  & .label
    font-size 1.2rem
  & .input
    margin 5px 0 0 0
    & input, textarea
      width 100%
      padding 5px
      border 1px solid #BFBFBF
      border-radius 2px
      font-size 1.2rem
    & input
      height 40px
    & textarea
      height 100px
      max-height 200px
      font-size 1.0rem
      resize vertical
  & .checkbox
    & label
      font-size 0.8rem
    &.flex-row
      display flex
      & .checkbox-item
        margin 0 10px 0 0
        &-each
          height 15px
          text-align center
          & label
            font-size 0.6rem
            color #7F7F7F
</style>
