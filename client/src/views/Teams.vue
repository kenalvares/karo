<template>
  <v-container class="grey lighten-5">
    <!--
      This row holds the controls to create a new team or filter through existing teams.
      It will only display if client is not waiting for more data from server.
    -->
    <v-row no-gutters v-if="!loader.pendingData">
      <v-col cols="12">
        <!-- Opens team creation dialog -->
        <CreateTeamDialog :roles="roles" @teamCreated="fetchData" />
        <!-- Button group to filter through teams -->
        <v-btn-toggle
          v-model="teamFilter"
          tile
          :color="filterColor"
          group
          mandatory
        >
          <!-- View all teams -->
          <v-btn value="all" @click="filterTeams('all')">
            All
          </v-btn>
          <!-- View only owned teams -->
          <v-btn value="owned" @click="filterTeams('owned')">
            Owned
          </v-btn>
          <!-- View only favourite teams-->
          <v-btn value="fav" @click="filterTeams('fav')">
            Fav
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <!--
      This row will show all teams that user is a part of.
      It will only display if client is not waiting for more data from server.
    -->
    <v-row v-if="!loader.pendingData">
      <!-- Display a single team from list of teams -->
      <v-col v-for="team in selectedTeams" :key="team.id" cols="12" sm="4">
        <TeamCardSmall :team="team" :userid="userid" />
      </v-col>
      <!-- If user has no teams display notice -->
      <EmptyCard
        :toShow="emptyTeamArray"
        msg="
          It looks like there's nothing here right now. You can click the button
          above to add a new team."
      />
    </v-row>
    <!--
      This row contains the loader.
      It is only rendered while client is awaiting data from server
      -->
    <LoadingData :loader="loader" />
  </v-container>
</template>

<script>
/*eslint-disable no-console*/
import TeamCardSmall from "@/components/cards/TeamCardSmall";
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
import LoadingData from "@/components/loaders/LoadingData";
import EmptyCard from "@/components/cards/EmptyCard";
import feathersClient from "../feathers-client";
import store from "../store/index";

export default {
  name: "teams",
  components: {
    LoadingData,
    TeamCardSmall,
    CreateTeamDialog,
    EmptyCard
  },
  data: () => ({
    teamFilter: "all", // Selected filter
    filterColor: "purple", // Filter icon color
    teams: [
      /*
        id: String,
        avatar: String,
        name: String,
        description: String,
        owned: Boolean,
        fav: Boolean
      */
    ], // Array of all teams user belongs to
    roles: [
      /*
        id: String,
        role: String,
      */
    ], // Array of all possible roles
    userid: null, // ID of this user
    loader: {
      pendingData: true,
      pendingMsg: "Pulling out the magnifying glass...",
      failed: false
    } // Loader object
  }),
  async created() {
    // Fetch all data needed for this page
    await this.fetchData();
  },
  computed: {
    // Uses array filter method to return array of filtered teams from team list
    selectedTeams() {
      if (this.teamFilter === "fav") {
        return this.teams.filter(function(team) {
          return team.fav;
        });
      } else if (this.teamFilter === "owned") {
        return this.teams.filter(function(team) {
          return team.owned;
        });
      } else {
        return this.teams;
      }
    },
    // Returns true if user isnt part of any teams
    emptyTeamArray() {
      if (this.selectedTeams.length < 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
    // Initial function to get all data
    async fetchData() {
      try {
        // This user's data
        const user = store.getters.getUserData;
        this.loader.pendingMsg = "Searching for your teams...";
        // If user has not been logged in
        if (user === null) {
          this.loader.pendingMsg = "You aren't logged in";
          this.loader.failed = true;
        } else {
          // User logged in
          // This user's id
          this.userid = user.id;
          // User's membership info of all teams they belong to
          const memberInfo = await this.findMemberInfo(this.userid);
          // ID's of teams user belongs
          const teamIds = this.getTeamIds(memberInfo);
          // Details of the teams user belongs to
          const teamDetails = await this.getTeamData(teamIds);
          // ID of the role 'owner'
          const ownerRoleId = await this.getOwnerRole();
          // Mark teams that user is the owner of
          const teamsWithOwnership = this.checkOwnership(
            memberInfo,
            teamDetails,
            ownerRoleId
          );
          // Complete list of teams user belongs to with favourite teams marked
          const teamData = this.findFavTeams(memberInfo, teamsWithOwnership);
          // Set teams array
          this.setTeams(teamData);
          // All roles in db
          this.roles = await this.pullRoleData();
          // Remove Loader
          this.loader.pendingData = false;
        }
      } catch (err) {
        if (store.getters.isUserLoggedIn) {
          console.log(err);
          this.loader.pendingMsg = "Try refreshing the page";
          this.loader.failed = true;
        } else {
          this.loader.pendingMsg = "You aren't logged in";
          this.loader.failed = true;
        }
      }
    },
    // Return ID's and Names of roles in DB
    async pullRoleData() {
      const rawData = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return [...rawData.data];
    },
    // Takes Membership Information of this user and array of Teams with ownership info that this user is a part of.
    // Returns array of teams with favourites marked
    findFavTeams(rawArr, teamArr) {
      let teamIds = [];
      for (let i = 0; i < rawArr.length; i++) {
        if (rawArr[i].fav) {
          teamIds.push(rawArr[i].teamid);
        }
      }
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = 0; j < teamArr.data.length; j++) {
          if (teamArr.data[j].id === teamIds[i]) {
            teamArr.data[j].fav = true;
          }
        }
      }
      return teamArr;
    },
    // Takes Membership info of this user, Details of teams user is part of and ID of role 'owner'
    checkOwnership(rawArr, teamArr, owner) {
      let teamIds = [];
      for (let i = 0; i < rawArr.length; i++) {
        if (rawArr[i].roleid === owner) {
          teamIds.push(rawArr[i].teamid);
        }
      }
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = 0; j < teamArr.data.length; j++) {
          if (teamArr.data[j].id === teamIds[i]) {
            teamArr.data[j].owned = true;
          }
        }
      }
      return teamArr;
    },
    // Gets ID of role 'owner'
    async getOwnerRole() {
      const rawData = await feathersClient.service("roles").find({
        query: {
          role: "Owner"
        }
      });
      return rawData.data[0].id;
    },
    // Takes membership info of user and returns list of IDs of teams user belongs to
    getTeamIds(memberInfo) {
      let arr = [];
      for (let i = 0; i < memberInfo.length; i++) {
        arr.push(memberInfo[i].teamid);
      }
      return arr;
    },
    // Takes membership info of user and returns list of IDs of respective roles of user in each team
    getRoleIds(memberInfo) {
      let arr = [];
      for (let i = 0; i < memberInfo.length; i++) {
        arr.push(memberInfo[i].roleid);
      }
      return arr;
    },
    // Takes ID of this user and returns membership info
    async findMemberInfo(val) {
      const rawData = await feathersClient.service("members").find({
        query: {
          userid: val
        }
      });
      return [...rawData.data];
    },
    // Gets info of teams based on IDs
    async getTeamData(arr) {
      const teamArr = await feathersClient.service("teams").find({
        query: {
          id: {
            $in: arr
          }
        }
      });
      return teamArr;
    },
    // Set teams in frontend to data received from backend
    setTeams(arrSet) {
      let teamData = arrSet.data;
      this.teams = [];
      for (let i = 0; i < teamData.length; i++) {
        this.teams.push({
          id: teamData[i].id,
          name: teamData[i].name,
          description: teamData[i].description,
          owned: teamData[i].owned,
          fav: teamData[i].fav,
          avatar: teamData[i].profilePicUrl
        });
      }
    },
    // Set color of filter icon based on type
    filterTeams(type) {
      if (type === "all") {
        this.filterColor = "purple";
      } else if (type === "fav") {
        this.filterColor = "yellow";
      } else if (type === "owned") {
        this.filterColor = "success";
      } else {
        this.filterColor = "grey";
      }
      this.filterColor.concat(" accent-4");
    }
  },
  // Fetch Data again if route changes
  watch: {
    $route: "fetchData"
  }
};
</script>
