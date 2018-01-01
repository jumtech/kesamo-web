<template lang='pug'>
transition(name='modal')
  .modal-mask
    .modal-wrapper
      .modal-container
        .modal-header
          slot(name='header')
            | default header
        .modal-body
          label
            p: | title
            input(v-model='result.title')
          label
            p: | description
            input(v-model='result.description')
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
  mergin 0 auto 0 auto
  padding 20px 30px 20px 30px
  background-color #fff
  border-radius 2px
  box-shadow 0 2px 8px rgba(0, 0, 0, .33)
  transition all .3s ease
.modal-header h3
  margin-top 0
  color #42b983
.modal-body
  margin 20px 0
.modal-footer
  display flex
</style>

<script>
export default {
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
