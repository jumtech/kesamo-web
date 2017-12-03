<template lang="pug">
.message
  | {{message}}
</template>
<script>
export default {
  data () {
    return {
      message: 'hello vue-loader'
    };
  }
};
</script>
<style lang="stylus" scoped>
.message {
  color: red;
}
</style>