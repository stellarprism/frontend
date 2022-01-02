<template>
  <v-container>
    <v-row v-if="$fetchState.pending" align="center" justify="center">
      <v-progress-circular indeterminate size="128" />
    </v-row>
    <v-row v-else-if="!ids.length">
      <v-col>
        <v-alert prominent type="info"> You don't own any planet. </v-alert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="id in ids" :key="id" cols="12" sm="4">
        <planet-card :id="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Account',
    }
  },
  data: () => ({
    ids: [] as Array<number>,
    address: null as string | null,
    balance: 0,
  }),
  async fetch() {
    this.address = await this.$ethereum.getAddress()

    const balance = await this.$ethereum.$token.balanceOf(this.address)

    const ids = []
    for (let index = 0; index < balance; index++) {
      ids.push(
        (
          await this.$ethereum.$token.tokenOfOwnerByIndex(this.address, index)
        ).toNumber()
      )
    }

    this.ids = ids
  },
})
</script>