<template>
  <v-card outlined>
    <v-card-title>
      {{ title }}
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
    <planet-render :token-id="token.id" @metadata="metadata = $event" />
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
      type: Object as Vue.PropType<any>,
      required: true,
    },
  },
  data: () => ({
    metadata: null as any | null,
  }),
  computed: {
    title(): string {
      const id = `#${this.token.id}`

      if (this.metadata?.name) {
        return `${this.metadata.name} (${id})`
      }

      return id
    },
    toShow(): string {
      const { id } = this.token

      return `/planets/${id}`
    },
    toEtherscan(): string {
      return `https://etherscan.io/address/${(this.token as any).seller}`
    },
  },
})
</script>
