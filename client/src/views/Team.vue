<template>
  <v-container fluid class="mt-0">
    <!-- If data is pending from server -->
    <LoadingData :loader="loadingData" />
    <!-- Show details of this team if no data is pending -->
    <TeamDetailsCard
      v-if="!loadingData.pendingData"
      :logoSrc="logoSrc"
      :team="team"
      :owned="owned"
      :members="members"
    />
    <!-- Button to create a new project -->
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
    <!-- Dialog box to create a new project -->
    <CreateProject
      :team="team"
      :user="user"
      :status="status"
      :showDialog="createProject"
      @closeProjectCreation="close()"
    />
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
  components: {
    TeamDetailsCard,
    LoadingData,
    CreateProject
  },
  data: () => ({
    createProject: false, // Does user want to create a project or not?
    team: {
      /*
        id: String,
        profilePicUrl: String,
        name: String,
        description: String,
        createdAt: String,
        updatedAt: String
      */
    },
    user: {
      /*
        id: String,
        avatar: String,
        firstname: String,
        lastname: String,
        email: String,
        tagline: String
      */
    },
    status: [
      /*
        id: String,
        status: String
      */
    ],
    roles: [
      /*
        id: String,
        status: String
      */
    ],
    owned: false, // Is the team owned by this user?
    loadingData: {
      pendingData: true,
      pendingMsg: "Getting Team Data...",
      failed: false
    } // Loader component
  }),
  async created() {
    // Initial data pull
    await this.fetchData();
    // Store current team in vuex
    store.dispatch({
      type: "setTeamData",
      team: this.team
    });
  },
  computed: {
    // Return placeholder if team doesnt have profilePicUrl, or return team logo URL
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
    // Close project creation dialog
    close() {
      this.createProject = false;
    },
    // Open project creation dialog
    open() {
      this.createProject = true;
    },
    // Returns names and emails of members of this team
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
    // Returns IDs and names of statuses in DB
    async getStatus() {
      const raw = await feathersClient.service("project-status").find({
        query: {
          $select: ["id", "status"]
        }
      });
      const status = raw.data;
      return status;
    },
    // Returns data of current team using team ID in url
    async getTeamData() {
      const rawTeam = await feathersClient.service("teams").find({
        query: {
          id: this.$router.history.current.params.id
        }
      });
      return rawTeam.data[0];
    },
    // Returns IDs, roles and favourites of members of this team
    async getMembers(val) {
      const rawMembers = await feathersClient.service("members").find({
        query: {
          $select: ["userid", "roleid", "fav"],
          teamid: val
        }
      });
      return rawMembers.data;
    },
    // Return roles
    async getRoles() {
      const rawRoles = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return rawRoles.data;
    },
    // Initial data fetch
    async fetchData() {
      try {
        // This user's info
        const me = store.getters.getUserData;
        // This team's data
        const team = await this.getTeamData();
        this.loadingData.pendingMsg = `Team "${team.name}" is loading..."`;
        // IDs, Roles and Favs of members of this team
        const members = await this.getMembers(team.id);
        let ownerId;
        // IDs and names of roles in DB
        const roles = await this.getRoles();
        // Get ID of role 'owner'
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].role === "Owner") {
            ownerId = roles[i].id;
          }
        }
        // Change role IDs to names and if this user is owner, then set team owned to true
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
        // Get names and emails of every member
        for (let i = 0; i < members.length; i++) {
          const memberData = await this.getMemberData(members[i].userid);
          members[i].name = memberData.name;
          members[i].email = memberData.email;
        }
        // Get statuses in DB
        let status = await this.getStatus();
        // Temporarily store all fetched data
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
          this.loadingData.pendingMsg =
            "Server timed out. Try refreshing the page";
          this.loadingData.failed = true;
        } else {
          console.log(err);
          this.loadingData.pendingMsg = "Try refreshing the page";
          this.loadingData.failed = true;
        }
      }
    }
  },
  // Fetch data again if route chanages
  watch: {
    $route: "fetchData"
  }
};
</script>
