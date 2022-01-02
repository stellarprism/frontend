<template>
  <v-main>
    <v-container>
      <v-card-title> To fully enjoy the experience, you need to: </v-card-title>
      <v-card-subtitle>
        Install <a href="https://metamask.io/" target="_blank">MetaMask</a> for
        your browser of choice. <br />
        Metamask is a plugin to interact with the blockchain. <br />
        You then need to select the Ropsten test network.
      </v-card-subtitle>
      <v-list three-line>
        <v-list-item v-for="(step, index) in steps" :key="index">
          <v-list-item-avatar>
            <v-icon x-large> mdi-numeric-{{ index + 1 }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ step.text }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-img
                :src="require(`assets/tutorial/ethereum/${step.image}.png`)"
                :height="step.height"
                :width="step.width"
                contain
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon x-large> mdi-numeric-{{ steps.length + 1 }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              You are all set! Click on the button below.
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-btn block large color="primary" @click="toMainPage">
                go the main page
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'

interface Step {
  text: string
  image: string
  height?: number | string
  width?: number | string
}

export default Vue.extend({
  layout: 'empty',
  data: () => ({
    steps: [
      {
        text: 'In MetaMask, click on "Ethereum Mainnet"',
        image: 'network',
        width: 600,
      },
      {
        text: 'Click on "Show/hide test networks"',
        image: 'show-hide',
        width: 600,
      },
      {
        text: 'Switch the slider to ON',
        image: 'show-test',
        width: 600,
      },
      {
        text: 'Click on "Ropsten Test Network"',
        image: 'ropsten',
        width: 600,
      },
    ] as Array<Step>,
  }),
  methods: {
    toMainPage() {
      window.location.href = '/'
    },
  },
  mounted() {
    if (this.$ethereum.connected) {
      this.$dialog.confirm({
        title: 'Already connected!',
        text: 'You are already connected to a valid network, do you want to be redirected to the main page?',
        actions: [
          {
            key: false,
            text: 'continue reading it anyway',
            handler() {},
          },
          {
            key: true,
            text: 'yes',
            color: 'primary',
            handler: () => {
              this.toMainPage()
            },
          },
        ],
      })
    }
  },
})
</script>
