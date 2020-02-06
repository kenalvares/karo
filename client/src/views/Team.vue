<template>
  <v-container fluid class="mt-0">
    <LoadingData :loader="loadingData" />
    <TeamDetailsCard
      v-if="!loadingData.pendingData"
      :logoSrc="logoSrc"
      :team="team"
      :owned="owned"
      :members="members"
    />
    <CreateProject
      :team="team"
      :user="user"
      :status="status"
      :showDialog="createProject"
      @closeProjectCreation="close()"
    />
    <v-btn
      fab
      color="red accent-2 white--text"
      bottom
      right
      absolute
      large
      class="my-4"
      v-if="owned"
      @click="open()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
/*eslint-disable no-console*/
import store from "../store/index";
import feathersClient from "../feathers-client";
import TeamDetailsCard from "@/components/cards/TeamDetailsCard";
import LoadingData from "@/components/loaders/LoadingData";
import CreateProject from "@/components/dialogs/CreateProject";

export default {
  name: "Team",
  data: () => ({
    createProject: false,
    team: {},
    user: {},
    status: [],
    roles: [],
    owned: false,
    loadingData: {
      pendingData: true,
      pendingMsg: "Getting Team Data...",
      failed: false
    }
  }),
  components: {
    TeamDetailsCard,
    LoadingData,
    CreateProject
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
    close() {
      this.createProject = false;
    },
    open() {
      this.createProject = true;
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
    async getStatus() {
      const raw = await feathersClient.service("project-status").find({
        query: {
          $select: ["id", "status"]
        }
      });
      const status = raw.data;
      return status;
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
        this.loadingData.pendingMsg = `Team "${team.name}" is loading..."`;
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
        let status = await this.getStatus();
        this.team = team;
        this.user = me;
        this.members = members;
        this.roles = roles;
        this.status = status;
        this.loadingData.pendingData = false;
      } catch (err) {
        if (err.code === 401) {
          this.loadingData.pendingMsg = "You aren't logged in";
          this.loadingData.failed = true;
        } else if (err.code === 408) {
          this.loadingData.pendingMsg = "You aren't logged in";
          this.loadingData.failed = true;
        } else {
          console.log(err);
          this.loadingData.pendingMsg = "Try refreshing the page";
          this.loadingData.failed = true;
        }
      }
    }
  },
  async created() {
    await this.fetchData();
    store.dispatch({
      type: "setTeamData",
      team: this.team
    });
  },
  watch: {
    $route: "fetchData"
  }
};
</script>
