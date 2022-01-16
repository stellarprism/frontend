<template>
  <v-card>
    <template v-if="name">
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle v-if="owner">
        Owner:
        <a :href="toEtherscan" target="_blank" class="text-decoration-none">
          {{ owner }}
        </a>
      </v-card-subtitle>
    </template>
    <v-card-title v-else>#{{ id }}</v-card-title>
    <v-divider />
    <v-card-text>
      <planet-render :token-id="id" @metadata="metadata = $event" />
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <marketplace-button-show :id="id" />
    </v-card-actions>
  </v-card>
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
  data: () => ({
    metadata: null as any | null,
    owner: null as string | null,
  }),
  async fetch() {
    this.owner = await this.$ethereum.$token.ownerOf(this.id)
  },
  computed: {
    name(): string | null {
      return this.metadata?.name
    },
    description(): string | null {
      return this.metadata?.description
    },
    toEtherscan(): string {
      return `https://etherscan.io/address/${this.owner}`
    },
  },
})
</script>
