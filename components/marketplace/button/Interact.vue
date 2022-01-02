<template>
  <marketplace-button-withdraw
    v-if="mine && onSale"
    :id="id"
    @withdrawn="$emit('withdrawn')"
  />
  <marketplace-button-sell
    v-else-if="mine"
    :id="id"
    @deposited="$emit('deposited')"
  />
  <marketplace-button-buy
    v-else-if="onSale"
    :id="id"
    @bought="$emit('bought')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
    mine: {
      type: Boolean,
    },
    onSale: {
      type: Boolean,
    },
  },
})
</script>