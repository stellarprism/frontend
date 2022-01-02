<template>
  <v-card>
    <template v-if="name">
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle>#{{ id }}</v-card-subtitle>
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
  }),
  computed: {
    name(): string | null {
      return this.metadata?.name
    },
    description(): string | null {
      return this.metadata?.description
    },
  },
})
</script>