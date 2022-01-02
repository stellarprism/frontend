<template>
  <v-btn block color="primary" :href="href" target="_blank"> etherscan </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    transaction: {
      type: Object,
    },
  },
  computed: {
    hash(): string {
      return this.transaction?.hash
    },
    href(): string {
      return `https://ropsten.etherscan.io/tx/${this.hash}`
    },
  },
})
</script>