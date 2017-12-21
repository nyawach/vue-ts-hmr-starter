<template lang="pug">
.index
  h1 Hello, {{ name }}!
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Index',

  computed: {
    ...mapState('user', ['name']),
  },
})
</script>

<style lang="scss" scoped>
@import './src/scss/common';

.index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}
</style>
