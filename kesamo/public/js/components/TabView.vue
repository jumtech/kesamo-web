<template lang='pug'>
.container
  .tab-item(v-bind:class='{ selected: selectedTab === "routine" }' @click='select("routine")')
    .tab-link
      router-link(to='routine')
        | □
  .tab-item(v-bind:class='{ selected: selectedTab === "routines" }' @click='select("routines")')
    .tab-link
      router-link(to='routines')
        | ≡
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
  & > .tab-link > a
    font-size 4.8rem
  &.selected
    color #538D8F
    border-bottom solid 5px #538D8F
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
