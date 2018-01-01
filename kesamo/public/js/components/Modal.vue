<template lang='pug'>
transition(name='modal')
  .modal-mask
    .modal-wrapper
      .modal-container
        .modal-header
          | {{heading}}
        .modal-body
          .form-group
            .label
              label(for='title')
                | title
            .input
              input#title(v-model='result.title' maxlength='30')
          .form-group
            .label
              label(for='description')
                | description
            .input
              textarea#description(v-model='result.description')
        .modal-footer
          .modal-cancel-button
            button(@click='emitCloseEvent(false)')
              | Cancel
          .modal-ok-button
            button(@click='emitCloseEvent(true)')
              | OK
</template>

<style lang='stylus' scoped>
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
  width 300px
  margin 0 auto 0 auto
  padding 20px 30px 20px 30px
  background-color #fff
  border-radius 2px
  box-shadow 0 2px 8px rgba(0, 0, 0, .33)
  transition all .3s ease
.modal-header
  font-size 1.2rem
  margin 0
  color #538D8F
.modal-body
  margin 20px 0 20px 0
.modal-footer
  display flex
.form-group
  margin 20px 0 20px 0
  & .input
    margin 10px 0 10px 0
    & input, textarea
      border 1px solid #BFBFBF
      width 100%
      border-radius 2px
      padding 5px
</style>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      result: {title: 'title!', description: 'description!'},
    };
  },
  methods: {
    emitCloseEvent(isOK) {
      console.log("@@@emitCloseEvent");
      this.$emit('modal-closed', isOK ? this.result : null);
    },
  },
};
</script>
