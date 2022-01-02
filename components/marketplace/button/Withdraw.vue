<template>
  <div style="width: 100%">
    <v-dialog v-model="dialog" :persistent="loading" max-width="600px">
      <template #activator="{ on, attrs }">
        <v-btn block color="primary" v-bind="attrs" v-on="on"> WITHDRAW </v-btn>
      </template>
      <v-card>
        <v-card-title> Withdraw #{{ id }} </v-card-title>
        <v-card-actions>
          <v-btn color="primary" block :loading="loading" @click="click">
            WITHDRAW
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay z-index="500" :value="loading">
      <v-card loading>
        <v-card-title> Withdrawing Token... </v-card-title>
        <v-card-actions v-if="transaction">
          <etherscan-button-transaction :transaction="transaction" />
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
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
    dialog: false,
    loading: false,
    transaction: null as any,
  }),
  methods: {
    async click() {
      const { $marketplace } = this.$ethereum

      try {
        this.loading = true

        try {
          this.transaction = await $marketplace.withdraw(this.id)
        } catch (error: any) {
          return this.$dialog.notify.error(
            `Withdraw cancelled: ${error?.message || error}`
          )
        }

        try {
          await this.transaction?.wait()
        } catch (error: any) {
          return this.$dialog.notify.error(
            `Not Withdrawn: ${error?.message || error}`
          )
        }

        this.dialog = false

        this.$emit('withdrawn')

        this.$dialog.notify.success(`Withdrawn!`)
      } finally {
        this.transaction = null
        this.loading = false
      }
    },
  },
})
</script>