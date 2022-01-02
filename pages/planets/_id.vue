<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <template v-if="name">
            <v-card-title>
              {{ name }}
              <template v-if="price">
                <v-spacer />
                <marketplace-price :value="price" />
              </template>
            </v-card-title>
            <v-card-subtitle>#{{ id }}</v-card-subtitle>
          </template>
          <v-card-title v-else>#{{ id }}</v-card-title>
          <v-card-text>
            <planet-render :token-id="id" @metadata="metadata = $event" />
          </v-card-text>
          <v-card-actions>
            <marketplace-button-interact
              :id="id"
              :mine="isMine"
              :on-sale="isOnMarketplace"
              @withdrawn="reload"
              @deposited="reload"
              @bought="reload"
            />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="description" cols="12">
        <v-card>
          <v-card-title>Description</v-card-title>
          <v-card-text>
            {{ description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: `#${(this as any).id} - Planets`,
    }
  },
  data: () => ({
    metadata: null as any | null,
    owner: null as string | null,
    price: null as string | null,
    isOnMarketplace: false,
    isMine: false,
  }),
  computed: {
    id(): number {
      return parseInt(this.$route.params.id)
    },
    name(): string | null {
      return this.metadata?.name
    },
    description(): string | null {
      return this.metadata?.description
    },
  },
  async fetch() {
    const myAddress = await this.$ethereum.getAddress()

    const isOnMarketplace = await this.$ethereum.$marketplace.isOnSale(this.id)
    const owner: string = isOnMarketplace
      ? (await this.$ethereum.$marketplace.tokenIdToPlanet(this.id)).seller
      : await this.$ethereum.$token.ownerOf(this.id)

    const price = isOnMarketplace
      ? (
          await this.$ethereum.$marketplace.tokenIdToPlanet(this.id)
        ).price.toString()
      : null

    const isMine = owner.toUpperCase() == myAddress.toUpperCase()

    this.isOnMarketplace = isOnMarketplace
    this.owner = owner
    this.price = price
    this.isMine = isMine
  },
  methods: {
    async reload() {
      try {
        await this.$fetch()
      } catch (error) {
        console.log(error)
        window.location.reload()
      }
    },
  },
})
</script>