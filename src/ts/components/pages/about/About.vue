<template lang="pug">
.about
  h1 About
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'About',
})
</script>

<style lang="scss" scoped>
@import './src/scss/common';

.about {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}
</style>
