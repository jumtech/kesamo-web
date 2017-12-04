<template lang="pug">
.container
  tab-view
  router-view.content
</template>

<style lang="stylus" scoped>
.content
  height calc(100vh - 150px)
</style>

<script>
import TabView from './TabView.vue';
export default {
  components: {
    TabView
  }
};
</script>
