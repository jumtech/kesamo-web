<template lang='pug'>
.container
  .tab-item(v-bind:class='{ selected: selectedTab === "routine" }' @click='select("routine")')
    router-link.tab-link(to='routine')
      .tab-image.square
  .tab-item(v-bind:class='{ selected: selectedTab === "routines" }' @click='select("routines")')
    router-link.tab-link(to='routines')
      .tab-image.border
</template>

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

<style lang='stylus' scoped>
.container
  display flex
  width 100%
  height 60px
.tab-item
  flex-grow 1
  text-align center
  display flex
  justify-content center
  align-items center
  color #BFBFBF
  border-bottom solid 3px #BFBFBF
  & .tab-link
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
  & .tab-image
    width 21px
    height 36px
    &.square
      border solid 3px #BFBFBF
    &.border
      background-image: linear-gradient(#FFFFFF 50%, #BFBFBF 50%, #BFBFBF);
      background-size: 21px 6px;
  &.selected
    color #538D8F
    border-bottom solid 3px #538D8F
    & .tab-image.square
      border solid 3px #538D8F
    & .tab-image.border
      background-image: linear-gradient(#FFFFFF 50%, #538D8F 50%, #538D8F);
</style>
