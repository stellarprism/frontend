<template>
  <div style="width: 100%">
    <v-dialog v-model="dialog" :persistent="loading" max-width="600px">
      <template #activator="{ on, attrs }">
        <v-btn block color="primary" v-bind="attrs" v-on="on"> BUY </v-btn>
      </template>
      <v-card>
        <v-card-title> Buy #{{ id }} </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="price"
            label="Price"
            required
            type="number"
            min="0.000000001"
            step="0.01"
            prepend-icon="mdi-ethereum"
            hide-details
            :loading="loading"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block :loading="loading" @click="click">
            BUY
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay z-index="500" :value="loading">
      <v-card loading>
        <v-card-title> Buying Token... </v-card-title>
        <v-card-actions v-if="transaction">
          <etherscan-button-transaction :transaction="transaction" />
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers, BigNumber } from 'ethers'

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    price: 0,
    loading: false,
    transaction: null as any,
  }),
  watch: {
    async dialog(val) {
      if (!val) {
        return
      }

      this.price = parseFloat(
        ethers.utils.formatEther(
          (await this.$ethereum.$marketplace.tokenIdToPlanet(this.id)).price
        )
      )
    },
  },
  methods: {
    async click() {
      const { $marketplace } = this.$ethereum

      try {
        this.loading = true

        try {
          this.transaction = await $marketplace.buy(this.id, {
            value: ethers.utils.parseEther(`${this.price}`),
          })
        } catch (error: any) {
          return this.$dialog.notify.error(
            `Deposit cancelled: ${error?.message || error}`
          )
        }

        try {
          await this.transaction?.wait()
        } catch (error: any) {
          return this.$dialog.notify.error(
            `Not deposited: ${error?.message || error}`
          )
        }

        this.dialog = false

        this.$emit('bought')

        this.$dialog.notify.success(`Bought!`)
      } finally {
        this.transaction = null
        this.loading = false
      }
    },
  },
})
</script>