<template>
  <v-card outlined>
    <v-card-title>#{{ id }}</v-card-title>
    <v-divider />
    <planet-render :token-id="id" />
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
})
</script>