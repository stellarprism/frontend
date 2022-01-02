<template>
  <v-btn block color="primary" :to="toShow">SHOW</v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    toShow(): string {
      return `/planets/${this.id}`
    },
  },
})
</script>