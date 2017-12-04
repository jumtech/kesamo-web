<template lang="pug">
.container
  h1.message
    | {{message}}
</template>

<style lang="stylus" scoped>
.message {
  color: red;
}
</style>

<script>
export default {
  data () {
    return {
      message: 'Hello RoutineDetailView'
    };
  }
};
</script>
