<!-- Team Card Small-->
<!-- Displays short team data in card -->
<template>
  <v-card max-width="344" class="mx-auto py-1 px-0">
    <v-list-item>
      <!-- Team Logo -->
      <v-list-item-avatar>
        <v-img :src="logoSrc" />
      </v-list-item-avatar>
      <v-list-item-content>
        <!-- Team Name -->
        <v-list-item-title class="headline">{{ team.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <!-- Team Description -->
    <v-card-text> {{ shortDesc }} </v-card-text>

    <v-card-actions>
      <!-- Go To Team Page -->
      <v-btn text color="grey lighten-5" :to="'team/' + team.id">
        View
      </v-btn>
      <v-spacer />
      <!-- Favourite a team -->
      <v-btn :color="checkFav" @click="favouriteThisTeam(team.id)" icon>
        <v-icon>star</v-icon>
      </v-btn>
      <!-- Add Team Member -->
      <v-btn v-if="team.owned" icon color="grey">
        <v-icon>person_add</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/*eslint-disable no-console*/
import feathersClient from "../../feathers-client";
import store from "../../store/index";

export default {
  name: "TeamCardSmall",
  props: {
    team: Object,
    /*
        id: String,
        avatar: String,
        name: String,
        description: String,
        owned: Boolean,
        fav: Boolean
      */
    userid: String
  },
  computed: {
    // Check if project is fav and return fav icon color
    checkFav() {
      if (this.team.fav === true) {
        return "yellow";
      }
      return "grey";
    },
    // Return placeholder if no team profilePicUrl, or set team logo
    logoSrc() {
      if (
        this.team.profilePicUrl === null ||
        this.team.profilePicUrl === undefined ||
        this.team.profilePicUrl === ""
      ) {
        return store.getters.teamLogoSrc;
      }
      return this.team.profilePicUrl;
    },
    // Shorten team description to 130 characters
    shortDesc() {
      if (this.team != {}) {
        return this.team.description.substr(0, 130).concat("...");
      }
      return "";
    }
  },
  methods: {
    // Mark team as favourite
    async favouriteThisTeam() {
      const raw = await feathersClient.service("members").find({
        query: {
          teamid: this.team.id,
          userid: this.userid
        }
      });
      const memberId = Number.parseInt(raw.data[0].id);
      await feathersClient.service("members").patch(memberId, {
        fav: !this.team.fav
      });
      this.team.fav = !this.team.fav;
    }
  }
};
</script>
