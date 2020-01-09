<template>
  <v-container fluid class="mt-0">
    <v-card elevation="2">
      <v-card-title>{{ team.name }}</v-card-title>

      <v-card-subtitle>
        {{ team.descrption }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn text>Share</v-btn>

        <v-btn v-if="team.owned" text color="indigo accent-4">
          Edit
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            I'm a thing. But, like most politicians, he promised more than he
            could deliver. You won't have time for sleeping, soldier, not with
            all the bed making you'll be doing. Then we'll go with that data
            file! Hey, you add a one and two zeros to that or we walk! You're
            going to do his laundry? I've got to find a way to escape.
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
/*eslint-disable no-console*/
import store from "../store/index";
import feathersClient from "../feathers-client";
//import router from "../router/index";
export default {
  name: "Team",
  data: () => ({
    show: false,
    team: {},
    user: {},
    members: [],
    roles: [],
    ownerId: null
  }),
  async created() {
    await store.dispatch("login");
    const me = store.getters.getUserData;
    const rawTeam = await feathersClient.service("teams").find({
      query: {
        id: this.$router.history.current.params.id
      }
    });
    const team = rawTeam.data[0];
    const rawMembers = await feathersClient.service("members").find({
      query: {
        $select: ["userid", "roleid", "fav"],
        teamid: team.id
      }
    });
    const members = rawMembers.data;
    const rawRoles = await feathersClient.service("roles").find({
      query: {
        $select: ["id", "role"]
      }
    });
    const roles = rawRoles.data;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role === "Owner") {
        this.ownerId = roles[i].id;
      }
    }
    for (let i = 0; i < members.length; i++) {
      for (let j = 0; j < roles.length; j++) {
        if (members[i].roleid === roles[j].id) {
          members[i].role = roles[j].role;
          delete members[i].roleid;
        }
      }
    }
    console.log(members);
    this.team = team;
    this.user = me;
    this.members = members;
    this.roles = roles;
  }
};
</script>
