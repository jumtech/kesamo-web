<template lang="pug">
.container
  h1.message
    | {{message}}
</template>

<style lang="stylus" scoped>
.message {
  color: blue;
}
</style>

<script>
export default {
  data () {
    return {
      message: 'Hello RoutineListView'
    };
  }
};
</script>
