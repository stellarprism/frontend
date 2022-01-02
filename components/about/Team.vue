<template>
  <v-card>
    <v-card-title>Team</v-card-title>
    <v-list>
      <v-list-item v-for="(member, index) in members" :key="index">
        <v-list-item-avatar>
          <v-avatar>
            <v-img :src="member.avatar" />
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ member.name }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn icon :href="member.github" target="_blank">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    members: {
      type: Array,
      required: true,
    },
  },
})
</script>