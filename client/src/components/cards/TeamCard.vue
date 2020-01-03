<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="team.avatar"></v-img
      ></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ team.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      {{ team.description }}
    </v-card-text>

    <v-card-actions>
      <v-btn text color="indigo accent-4">
        View
      </v-btn>
      <v-btn v-if="team.owned" text color="indigo accent-4">
        Edit
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :color="checkFav" @click="favouriteThisTeam(team.id)" icon>
        <v-icon>star</v-icon>
      </v-btn>
      <v-btn v-if="team.owned" icon>
        <v-icon>person_add</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TeamCard",
  props: {
    team: Object
  },
  computed: {
    checkFav() {
      if (this.team.fav === true) {
        return "yellow";
      }
      return "grey";
    }
  },
  methods: {
    favouriteThisTeam() {
      this.team.fav = !this.team.fav;
    }
  }
};
</script>
