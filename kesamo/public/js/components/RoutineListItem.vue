<template lang="pug">
li.list-item(:class='{selected: selectedIndex === i, dragged: draggingIndex === i}' :id='i')
  template(v-if='editingIndex === i')
    .list-item-content-main
      p.title
        input(:id='"input" + i' v-model='title' @blur='$emit("save-quick-edit-result", i, title)')
    .icon.delete(@click='$emit("delete-routine", i)')
      i.fa.fa-trash(aria-hidden='true')
  template(v-else)
    .icon.drag(@click='$emit("enable-drag", i)')
      i.fa.fa-bars(aria-hidden='true')
    .list-item-content
      .list-item-content-main(@touchstart='$emit("start-edit-if-double-tapped", i, $event)')
        p.title: | {{routine_.title}}
        .week-rects(v-if='routine_.isForOnlySomeDays')
          .rect(v-for='n in [1,2,3,4,5,6,0]' :class='{on: routine_.daysOfTheWeek && routine_.daysOfTheWeek.includes(n)}')
      .icon.edit(@click='$emit("show-edit-modal", i)')
        i.fa.fa-pencil(aria-hidden='true')
</template>

<script>
export default {
  props: [ 'routine_', 'i', 'selectedIndex', 'editingIndex', 'draggingIndex'],
  data() {
    return {
      title: '',
    };
  },
  created() {
    this.title = this.routine_.title;
  },
};
</script>

<style lang="stylus" scoped>
$icon-raw-width = 20px
$icon-side-padding = 20px
.list-item
  display flex
  align-items center
  border solid 1px #BFBFBF
  background-color #FFFFFF
  &-content
    display flex
    align-items center
    width 'calc(100vw - (%s + %s * 2))' % ($icon-raw-width $icon-side-padding)
    &-main
      padding 20px 10px 20px 20px
      flex-grow 1
      & .title
        font-size 1.6rem
        word-break break-all
        & input
          width 100%
          font-size 1.6rem
      & .week-rects
        height 10px
        margin-top 5px
        display flex
        & .rect
          width 10px
          height 10px
          margin-right 10px
          background-color #EBF7DA
          &.on
            background-color #538D8F
  & .icon
    width 'calc(%s + %s * 2)' % ($icon-raw-width $icon-side-padding)
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
</style>
