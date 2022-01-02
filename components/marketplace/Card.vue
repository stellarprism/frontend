<template>
  <v-card outlined>
    <v-card-title>
      #{{ token.id }}
      <v-spacer />
      <marketplace-price :value="token.price" />
    </v-card-title>
    <v-card-subtitle>
      Seller:
      <a :href="toEtherscan" target="_blank" class="text-decoration-none">
        {{ token.seller }}
      </a>
    </v-card-subtitle>
    <v-divider />
    <planet-render :token-id="token.id" />
    <v-divider />
    <v-card-actions>
      <marketplace-button-show :id="token.id" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  computed: {
    toShow() {
      const { id } = this.token

      return `/planets/${id}`
    },
    toEtherscan() {
      return `https://etherscan.io/address/${(this.token as any).seller}`
    },
  },
})
</script>