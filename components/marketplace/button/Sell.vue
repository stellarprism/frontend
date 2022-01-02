<template>
  <div style="width: 100%">
    <v-dialog v-model="dialog" :persistent="loading" max-width="600px">
      <template #activator="{ on, attrs }">
        <v-btn block color="primary" v-bind="attrs" v-on="on"> SELL </v-btn>
      </template>
      <v-card>
        <v-card-title> Deposit #{{ id }} </v-card-title>
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
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block :loading="loading" @click="click">
            DEPOSIT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay z-index="500" :value="loading">
      <v-card loading>
        <v-card-title v-if="isApproving">
          Approving Token Transfer...
        </v-card-title>
        <v-card-title v-else> Depositing Token... </v-card-title>
        <v-card-actions v-if="transaction">
          <etherscan-button-transaction :transaction="transaction" />
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    price: 0.01,
    loading: false,
    isApproving: false,
    transaction: null as any,
  }),
  methods: {
    async click() {
      const { $marketplace, $token } = this.$ethereum

      try {
        this.loading = true

        if ((await $token.getApproved(this.id)) != $marketplace.address) {
          this.isApproving = true

          try {
            this.transaction = await this.$ethereum.$token.approve(
              $marketplace.address,
              this.id
            )

            console.log(this.transaction)
          } catch (error: any) {
            this.isApproving = false
            return this.$dialog.notify.error(
              `Approving cancelled: ${error?.message || error}`
            )
          }

          try {
            await this.transaction?.wait()
          } catch (error: any) {
            return this.$dialog.notify.error(
              `Not approved: ${error?.message || error}`
            )
          } finally {
            this.isApproving = false
          }
        }

        const price = ethers.utils.parseEther(`${this.price}`)

        try {
          this.transaction = await $marketplace.deposit(this.id, price)
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

        this.$emit('deposited')

        this.$dialog.notify.success(`Deposited!`)
      } finally {
        this.transaction = null
        this.loading = false
      }
    },
  },
})
</script>