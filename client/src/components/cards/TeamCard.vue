<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="logoSrc"/>
        </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ team.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text> {{ shortDesc }} </v-card-text>

    <v-card-actions>
      <v-btn text color="indigo accent-4" :to="'team/' + team.id">
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
/*eslint-disable no-console*/
import feathersClient from "../../feathers-client";
import store from "../../store/index";

export default {
  name: "TeamCard",
  props: {
    team: Object,
    userid: String
  },
  computed: {
    checkFav() {
      if (this.team.fav === true) {
        return "yellow";
      }
      return "grey";
    },
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
    shortDesc() {
      if (this.team != {}) {
        return this.team.description.substr(0, 130).concat("...");
      }
      return "";
    }
  },
  methods: {
    async favouriteThisTeam() {
      const rawData = await feathersClient.service("members").find({
        query: {
          teamid: this.team.id,
          userid: this.userid
        }
      });
      const memberId = Number.parseInt(rawData.data[0].id);
      await feathersClient.service("members").patch(memberId, {
        fav: !this.team.fav
      });
      this.team.fav = !this.team.fav;
    }
  }
};
</script>
