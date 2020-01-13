<template>
  <v-container fluid class="mt-0">
    <v-row v-if="pendingData" class="fill-height flex-column-center">
      <v-col cols="12" align="center" class="flex-column-center">
        <v-progress-circular
          :size="100"
          :width="5"
          color="primary"
          indeterminate
          class="mb-5"
          v-if="!failed"
        ></v-progress-circular
        ><v-progress-circular
          :size="100"
          :width="5"
          color="grey"
          class="mb-5"
          v-if="failed"
        >
          <v-icon color="grey">close</v-icon></v-progress-circular
        >
        <span>{{ pendingMsg }}</span>
      </v-col>
    </v-row>
    <TeamDetailsCard
      v-if="!pendingData"
      :logoSrc="logoSrc"
      :team="team"
      :owned="owned"
      :members="members"
    />
    <v-btn
      fab
      color="red accent-2 white--text"
      bottom
      right
      absolute
      x-large
      class="my-4"
      v-if="owned"
      @click="closeProjectCreation()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialog">
      <v-card>
        <v-stepper v-model="createProjectStepper" vertical>
          <v-stepper-header class="grey darken-3">
            <v-card-title left class="grey--text text--lighten-2">
              <v-icon left class="grey--text text--lighten-2">create</v-icon>
              Create Project
            </v-card-title>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-step :complete="createProjectStepper > 1" step="1"
              >Name Your Project</v-stepper-step
            >
            <v-stepper-content step="1">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createProjectStepper = 2">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="createProjectStepper > 2" step="2"
              >Define Your Vision</v-stepper-step
            >

            <v-stepper-content step="2">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createProjectStepper = 3">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="createProjectStepper > 3" step="3"
              >Select a Team</v-stepper-step
            >
            <v-stepper-content step="3">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createProjectStepper = 4">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()"
                >Cancel</v-btn
              > </v-stepper-content
            ><v-stepper-step step="4" :complete="createProjectStepper > 4"
              >Create the Product Backlog</v-stepper-step
            >
            <v-stepper-content step="4">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createProjectStepper = 5">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()"
                >Cancel</v-btn
              > </v-stepper-content
            ><v-stepper-step step="5">Set Duration</v-stepper-step>
            <v-stepper-content step="4">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="createProject">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
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
.flex-column-center {
  display: flex;
  justify-content: center;
  align-items: center;
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
import feathersClient from "../feathers-client";
import TeamDetailsCard from "@/components/cards/TeamDetailsCard";

//import router from "../router/index";
export default {
  name: "Team",
  data: () => ({
    createProjectStepper: 0,
    dialog: false,
    team: {},
    user: {},
    members: [],
    roles: [],
    owned: false,
    pendingData: true,
    pendingMsg: "Getting Team Data...",
    failed: false
  }),
  components: {
    TeamDetailsCard
  },
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
    closeProjectCreation() {
      this.dialog = !this.dialog;
    },
    createProject() {
      console.log("Project Created!");
    },
    async getMemberData(userid) {
      const user = await feathersClient.service("users").find({
        query: {
          id: userid,
          $select: ["firstname", "lastname", "email"]
        }
      });
      let memberData = {};
      memberData.name = user.data[0].firstname + " " + user.data[0].lastname;
      memberData.email = user.data[0].email;
      return memberData;
    },
    async fetchData() {
      try {
        await store.dispatch("login");
        const me = store.getters.getUserData;
        const rawTeam = await feathersClient.service("teams").find({
          query: {
            id: this.$router.history.current.params.id
          }
        });
        const team = rawTeam.data[0];
        this.pendingMsg = `Team "${team.name}" is loading..."`;
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
        let ownerId;
        const roles = rawRoles.data;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].role === "Owner") {
            ownerId = roles[i].id;
          }
        }
        for (let i = 0; i < members.length; i++) {
          for (let j = 0; j < roles.length; j++) {
            if (members[i].roleid === roles[j].id) {
              members[i].role = roles[j].role;
              delete members[i].roleid;
            }
            if (members[i].roleid === ownerId) {
              if (members[i].userid === me.id) {
                this.owned = true;
              }
            }
          }
        }
        for (let i = 0; i < members.length; i++) {
          const memberData = await this.getMemberData(members[i].userid);
          members[i].name = memberData.name;
          members[i].email = memberData.email;
        }
        this.team = team;
        this.user = me;
        this.members = members;
        this.roles = roles;
        this.pendingData = false;
      } catch (err) {
        if (err.code === 401) {
          this.pendingMsg = "You aren't logged in";
          this.failed = true;
        } else {
          this.pendingMsg = "Try refreshing the page";
          this.failed = true;
        }
      }
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
