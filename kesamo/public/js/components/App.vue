<template lang="pug">
.container
  tab-view
  router-view
</template>

<style lang="stylus" scoped>
</style>

<script>
import TabView from './TabView.vue';
export default {
  components: {
    TabView
  }
};
</script>
