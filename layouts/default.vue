<template>
  <v-app dark>
    <v-system-bar v-if="!canSign" app color="error" class="justify-center" height="48">
      <div>
      You are not connected with MetaMask. <br />
      You will not be able to buy/sell planets.
      </div>
      <v-btn color="primary" small class="ml-4" to="/errors/ethereum">
        Help me install it!
      </v-btn>
    </v-system-bar>
    <v-navigation-drawer v-model="drawer" fixed app clipped>
      <v-img
        :src="require('~/assets/logo.png')"
        contain
        class="ma-4"
        height="96"
      />
      <v-divider />
      <v-list>
        <v-list-item v-for="page in pages" :key="page.to" :to="page.to" router>
          <v-list-item-action>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="page.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title> Stellar Prism </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: ['ethereum'],
  computed: {
    canSign() {
      return !!this.$ethereum.signer
    },
  },
  data: () => ({
    drawer: true,
    pages: [
      {
        icon: 'mdi-star-shooting',
        title: 'Universe',
        to: '/',
      },
      {
        icon: 'mdi-earth',
        title: 'Planets',
        to: '/planets',
      },
      {
        icon: 'mdi-shopping',
        title: 'Star Exchange',
        to: '/marketplace',
      },
      {
        icon: 'mdi-account',
        title: 'Account',
        to: '/account',
      },
      {
        icon: 'mdi-information',
        title: 'About',
        to: '/about',
      },
    ],
  }),
}
</script>
