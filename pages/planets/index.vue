<template>
  <v-container>
    <v-row v-if="$fetchState.pending" align="center" justify="center">
      <v-progress-circular indeterminate size="128" />
    </v-row>
    <v-row v-else-if="!items.length">
      <v-col>
        <v-alert prominent type="info">
          There isn't any planet available.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="x in pageItems" :key="x" cols="12" sm="4">
        <planet-card :id="x" />
      </v-col>

      <v-col cols="12">
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const PAGE_SIZE = 6

export default Vue.extend({
  head() {
    return {
      title: 'Planets',
    }
  },
  data: () => ({
    items: [] as Array<number>,
    page: 1,
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.items.length / PAGE_SIZE)
    },
    pageItems() {
      return this.items.slice(
        PAGE_SIZE * (this.page - 1),
        PAGE_SIZE * this.page
      )
    },
  },
  watch: {
    page(val) {
      this.$router.push({
        query: {
          page: val,
        },
      })
    },
    '$route.query.page': {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }

        const parsed = parseInt(val)

        if (parsed != this.page) {
          this.page = parsed
        }
      },
    },
  },
  async fetch() {
    this.items = Array.from(
      { length: (await this.$ethereum.$token.totalSupply()).toNumber() },
      (_, index) => index
    )
  },
})
</script>