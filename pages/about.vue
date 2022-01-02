<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <about-project />
      </v-col>
      <v-col cols="12">
        <about-team :members="teamMembers" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head() {
    return {
      title: 'About',
    }
  },
  data: () => ({
    teamMembers: [
      {
        name: 'Florian YUSUF-ALI',
        avatar: 'https://avatars.githubusercontent.com/u/58237375?v=4',
        github: 'https://github.com/fyusuf-a',
      },
      {
        name: 'Eric DJAVID',
        avatar: 'https://avatars.githubusercontent.com/u/47226919?v=4',
        github: 'https://github.com/ericdjavid',
      },
      {
        name: 'Enzo CACERES',
        avatar: 'https://avatars.githubusercontent.com/u/7386242?v=4',
        github: 'https://github.com/Caceresenzo',
      },
    ],
  }),
})
</script>