<template>
  <v-container>
    <v-row v-if="$fetchState.pending" align="center" justify="center">
      <v-progress-circular indeterminate size="128" />
    </v-row>
    <v-row v-else-if="!tokens.length">
      <v-col>
        <v-alert prominent type="info"> The marketplace is empty. </v-alert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="token in tokens" :key="token.id" cols="12" sm="4">
        <marketplace-card :token="token" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { BigNumber, ethers } from 'ethers'
import Vue from 'vue'

interface TokenInfo {
  id: number
  seller: string
  price: string
}

export default Vue.extend({
  head() {
    return {
      title: 'Marketplace',
    }
  },
  data: () => ({
    tokens: [] as Array<TokenInfo>,
  }),
  async fetch() {
    await this.$ethereum.getAddress()

    const address = this.$ethereum.$marketplace.address
    const onSaleCount = await this.$ethereum.$token.balanceOf(address)

    const tokens = []
    for (let index = 0; index < onSaleCount; index++) {
      const id = await this.$ethereum.$token.tokenOfOwnerByIndex(address, index)
      const info = await this.$ethereum.$marketplace.tokenIdToPlanet(id)

      tokens.push({
        id: id.toNumber(),
        seller: info.seller as string,
        price: info.price.toString(),
      })
    }

    this.tokens = tokens
  },
  methods: {
    onDeposit(seller: string, tokenId: BigNumber, price: BigNumber) {
      this.tokens.unshift({
        id: tokenId.toNumber(),
        seller: seller,
        price: price.toString(),
      })
    },
    onWithdraw(_seller: string, tokenId: BigNumber) {
      this.removeById(tokenId)
    },
    onBuy(
      _buyer: string,
      _seller: string,
      tokenId: BigNumber,
      _price: BigNumber
    ) {
      this.removeById(tokenId)
    },
    removeById(tokenId: BigNumber) {
      const id = tokenId.toNumber()

      const index = this.tokens.findIndex((x) => x.id == id)
      if (index != -1) {
        this.tokens.splice(index, 1)
      }
    },
  },
  created() {
    const { $marketplace } = this.$ethereum

    $marketplace.on('Deposit', this.onDeposit)
    $marketplace.on('Withdraw', this.onWithdraw)
    $marketplace.on('Buy', this.onBuy)
  },
  destroyed() {
    const { $marketplace } = this.$ethereum

    $marketplace.off('Deposit', this.onDeposit)
    $marketplace.off('Withdraw', this.onWithdraw)
    $marketplace.off('Buy', this.onBuy)
  },
})
</script>
