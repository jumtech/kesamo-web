<template lang='pug'>
.container
  .tab-item(v-bind:class='{ selected: selectedTab === "routine" }' @click='select("routine")')
    router-link.tab-link(to='routine')
      .tab-image.square
  .tab-item(v-bind:class='{ selected: selectedTab === "routines" }' @click='select("routines")')
    router-link.tab-link(to='routines')
      .tab-image.border
</template>

<style lang='stylus' scoped>
.container
  display flex
  width 100%
  height 60px
  padding 2px 0 2px 0
.tab-item
  flex-grow 1
  text-align center
  display flex
  justify-content center
  align-items center
  color #BFBFBF
  border-bottom solid 2px #BFBFBF
  &.selected
    color #538D8F
    border-bottom solid 5px #538D8F
  & .tab-link
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
  & .tab-image
    width 21px
    height 36px
    box-sizing border-box
    &.square
      border solid 3px #538D8F
    &.border
      background-image: linear-gradient(#FFFFFF 50%, #538D8F 50%, #538D8F);
      background-size: 21px 6px;

</style>

<script>
export default {
  data() {
    return {
      selectedTab: null
    };
  },
  created() {
    this.select(this.$route.path.slice(1));
  },
  methods: {
    select(tabName) {
      this.selectedTab = tabName;
    },
  },
};
</script>
