<template>
  <v-container fluid class="mt-0">
    <v-card elevation="2">
      <v-row>
        <v-col cols="2">
          <v-flex class="pa-5">
            <v-avatar size="164">
              <v-img :src="logoSrc" />
            </v-avatar>
          </v-flex>
        </v-col>
        <v-col cols="10" class="flex-column">
          <v-card-title>{{ team.name }}</v-card-title>

          <v-card-subtitle>
            {{ team.description }}
          </v-card-subtitle>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-btn text>Share</v-btn>

        <v-btn v-if="owned" text color="indigo accent-4">
          Edit
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text @click="showMembers = !showMembers">
          Members
          <v-icon right>{{
            showMembers ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div>
          <v-list-item
            v-show="showMembers"
            v-for="member in members"
            :key="member.userid"
            class="border-list-item"
          >
            <span class="member-name">{{ member.name }}</span>
            <span class="member-email">{{ member.email }}</span>
            <v-spacer />

            <v-chip>{{ member.role }}</v-chip>
            <v-btn icon class="mx-2" @click="goTo('/profile/', member.userid)">
              <v-icon>person</v-icon>
            </v-btn>
            <v-btn icon class="mx-2">
              <v-icon>message</v-icon>
            </v-btn>
          </v-list-item>
        </div>
      </v-expand-transition>
    </v-card>

    <v-btn
      fab
      color="red accent-2 white--text"
      bottom
      right
      absolute
      x-large
      class="my-4"
      v-if="owned"
      @click="dialog = !dialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialog">
      <v-card>
        <v-stepper v-model="createTeamStepper" vertical>
          <v-stepper-header class="grey darken-3">
            <v-card-title left class="grey--text text--lighten-2">
              <v-icon left class="grey--text text--lighten-2">create</v-icon>
              Create Project
            </v-card-title>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-step :complete="createTeamStepper > 1" step="1"
              >Name of step 1</v-stepper-step
            >
            <v-stepper-content step="1">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createTeamStepper = 2">
                Continue
              </v-btn>

              <v-btn text @click="dialog = !dialog">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="createTeamStepper > 2" step="2"
              >Name of step 2</v-stepper-step
            >

            <v-stepper-content step="2">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createTeamStepper = 3">
                Continue
              </v-btn>

              <v-btn text @click="dialog = !dialog">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step step="3">Name of step 3</v-stepper-step>
            <v-stepper-content step="3">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createTeamStepper = 1">
                Continue
              </v-btn>

              <v-btn text @click="dialog = !dialog">Cancel</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
.member-name {
  font-size: 1rem;
  font-weight: 600;
}

.border-list-item {
  border: 1px solid #ccc;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
}

.member-email {
  font-size: 0.8rem;
  text-transform: uppercase;
  border-radius: 0.2rem;
  letter-spacing: 0.1rem;
  padding: 0.1rem 0.3rem;
  margin: 0.1rem 0.5rem;
  background-color: #e6e6e6;
}
</style>

<script>
/*eslint-disable no-console*/
import store from "../store/index";
import router from "../router/index";
import feathersClient from "../feathers-client";
//import router from "../router/index";
export default {
  name: "Team",
  data: () => ({
    createTeamStepper: 0,
    dialog: false,
    showMembers: false,
    team: {},
    user: {},
    members: [],
    roles: [],
    ownerId: null,
    owned: false
  }),
  computed: {
    logoSrc() {
      if (
        this.team.profilePicUrl === null ||
        this.team.profilePicUrl === undefined ||
        this.team.profilePicUrl === ""
      ) {
        return store.getters.teamLogoSrc;
      }
      return this.team.profilePicUrl;
    }
  },
  methods: {
    async getName(userid) {
      const userName = await feathersClient.service("users").find({
        query: {
          id: userid,
          $select: ["firstname", "lastname"]
        }
      });
      return userName.data[0].firstname + " " + userName.data[0].lastname;
    },
    async getEmail(userid) {
      const userName = await feathersClient.service("users").find({
        query: {
          id: userid,
          $select: ["email"]
        }
      });
      return userName.data[0].email;
    },

    goTo(link, id) {
      router.push(link + id);
    },
    async fetchData() {
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
          if (members[i].roleid === this.ownerId) {
            if (members[i].userid === me.id) {
              this.owned = true;
            }
          }
        }
      }
      for (let i = 0; i < members.length; i++) {
        members[i].name = await this.getName(members[i].userid);
        members[i].email = await this.getEmail(members[i].userid);
      }
      this.team = team;
      this.user = me;
      this.members = members;
      this.roles = roles;
    }
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    $route: "fetchData"
  }
};
</script>
