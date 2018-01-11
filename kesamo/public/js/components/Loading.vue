<template lang='pug'>
.spinner
  .rect1
  .rect2
  .rect3
  .rect4
  .rect5
  .rect6
  .rect7
  .rect8
  .rect9
  .rect10
</template>

<script>
export default {
  data() {
    return {}
  },
};
</script>

<style lang='stylus' scoped>
.spinner
  margin 100px auto
  width 50px
  height 80px
  text-align center
  font-size 10px

.spinner > div
  background-color #538D8F
  width 50px
  height 8px
  animation sk-stretchdelay 1.2s infinite ease-in-out
.spinner .rect1
  animation-delay -1.4s
.spinner .rect2
  animation-delay -1.3s
.spinner .rect3
  animation-delay -1.2s
.spinner .rect4
  animation-delay -1.1s
.spinner .rect5
  animation-delay -1.0s
.spinner .rect6
  animation-delay -0.9s
.spinner .rect7
  animation-delay -0.8s
.spinner .rect8
  animation-delay -0.7s
.spinner .rect9
  animation-delay -0.6s
.spinner .rect10
  animation-delay -0.5s

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform scaleY(0.4)
  }  20% {
    transform scaleY(1.0)
  }
}
</style>