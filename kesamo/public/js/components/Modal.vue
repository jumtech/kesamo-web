<template lang='pug'>
transition(name='modal')
  .modal-mask(@click='emitCloseEvent(false)')
    .modal-wrapper(name)
      .modal-container(@click.stop='')
        .modal-header
          | {{heading}}
        .modal-body
          .form-group
            .label
              label(for='title')
                | title
            .input
              input#title(v-model='values.title' maxlength='30')
          .form-group
            .label
              label(for='description')
                | description
            .input
              textarea#description(v-model='values.description')
        .modal-footer
          .modal-cancel-button
            button(@click='emitCloseEvent(false)')
              | Cancel
          .modal-ok-button
            button(@click='emitCloseEvent(true)')
              | OK
</template>

<script>
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
      },
    }
  },
  data() {
    return {};
  },
  methods: {
    emitCloseEvent(isOK) {
      this.$emit('modal-closed', isOK ? this.values : null);
    },
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
  width $modal-width
  margin 0 auto 0 auto
  padding $modal-padding
  background-color #fff
  border-radius 2px
  box-shadow 0 2px 8px rgba(0, 0, 0, .33)
  transition all .3s ease
.modal-header
  font-size 1.8rem
  margin 0
  color #538D8F
.modal-body
  margin $modal-item-top-margin 0
.modal-footer
  display flex
  & button
    font-size 1.6rem
.form-group
  margin $modal-item-top-margin 0
  font-size 1.6rem
  & .input
    margin 10px 0 10px 0
    & input, textarea
      box-sizing border-box
      width 100%
      padding 5px
      border 1px solid #BFBFBF
      border-radius 2px
      font-size 1.6rem
    & input
      height 40px
    & textarea
      height 100px
      max-height 200px
      font-size 1.2rem
      resize vertical
</style>