<template>
  <v-btn outlined small>
    <v-icon left>mdi-ethereum</v-icon>
    {{ formatted }}
  </v-btn>
</template>

<script lang="ts">
import { ethers } from 'ethers'
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: [Number, String],
    },
  },
  computed: {
    formatted() {
      return ethers.utils.formatEther(this.value)
    },
  },
})
</script>