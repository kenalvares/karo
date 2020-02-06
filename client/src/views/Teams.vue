<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters v-if="!pendingData">
      <v-col cols="12">
        <CreateTeamDialog :roles="roles" @teamCreated="fetchData" />
        <v-btn-toggle
          v-model="teamFilter"
          tile
          :color="filterColor"
          group
          mandatory
        >
          <v-btn value="all" @click="filterTeams('all')">
            All
          </v-btn>
          <v-btn value="owned" @click="filterTeams('owned')">
            Owned
          </v-btn>
          <v-btn value="fav" @click="filterTeams('fav')">
            Fav
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="!pendingData">
      <v-col v-for="team in selectedTeams" :key="team.id" cols="12" sm="4">
        <TeamCardSmall :team="team" :userid="userid" />
      </v-col>
      <EmptyCard
        :toShow="emptyTeamArray"
        msg="
          It looks like there's nothing here right now. You can click the button
          above to add a new team."
      />
    </v-row>
    <v-row v-if="pendingData" class="full-height">
      <v-col cols="12" align="center" class="flex-vertical">
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
  </v-container>
</template>

<style lang="scss" scoped>
.full-height {
  height: 65vh;
}
.flex-vertical {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
<script>
/*eslint-disable no-console*/
import TeamCardSmall from "@/components/cards/TeamCardSmall";
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
import EmptyCard from "@/components/cards/EmptyCard";
import feathersClient from "../feathers-client";
import store from "../store/index";

export default {
  name: "teams",
  data: () => ({
    teamFilter: "all",
    filterColor: "purple",
    teams: [],
    roles: [],
    userid: null,
    pendingData: true,
    pendingMsg: "Pulling out the magnifying glass...",
    failed: false
  }),
  components: {
    TeamCardSmall,
    CreateTeamDialog,
    EmptyCard
  },
  computed: {
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
    emptyTeamArray() {
      if (this.selectedTeams.length < 1) {
        return true;
      }
      return false;
    }
  },
  async created() {
    await this.fetchData();
    console.log(this.teams);
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    async fetchData() {
      try {
        await store.dispatch("login");
        const user = store.getters.getUserData;
        this.pendingMsg = "Searching for your teams...";
        if (user === null) {
          this.pendingMsg = "You aren't logged in";
          this.failed = true;
        } else {
          this.userid = user.id;
          const memberInfo = await this.findMemberInfo(this.userid);
          const teamIds = this.getTeamIds(memberInfo);
          const teamDetails = await this.getTeamData(teamIds);
          const ownerRoleId = await this.getOwnerRole();
          const teamsWithOwnership = this.checkOwnership(
            memberInfo,
            teamDetails,
            ownerRoleId
          );
          const teamData = this.findFavTeams(memberInfo, teamsWithOwnership);
          this.setTeams(teamData);
          this.roles = await this.pullRoleData();
          this.pendingData = false;
        }
      } catch (err) {
        if (store.getters.isUserLoggedIn) {
          this.pendingMsg = "Try refreshing the page";
          this.failed = true;
        } else {
          this.pendingMsg = "You aren't logged in";
          this.failed = true;
        }
      }
    },
    async pullRoleData() {
      const rawData = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return [...rawData.data];
    },
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
    async getOwnerRole() {
      const rawData = await feathersClient.service("roles").find({
        query: {
          role: "Owner"
        }
      });
      return rawData.data[0].id;
    },
    getTeamIds(memberInfo) {
      let arr = [];
      for (let i = 0; i < memberInfo.length; i++) {
        arr.push(memberInfo[i].teamid);
      }
      return arr;
    },
    getRoleIds(memberInfo) {
      let arr = [];
      for (let i = 0; i < memberInfo.length; i++) {
        arr.push(memberInfo[i].roleid);
      }
      return arr;
    },
    async findMemberInfo(val) {
      const rawData = await feathersClient.service("members").find({
        query: {
          userid: val
        }
      });
      return [...rawData.data];
    },
    async getTeamData(arr) {
      const gotTeams = await feathersClient.service("teams").find({
        query: {
          id: {
            $in: arr
          }
        }
      });
      return gotTeams;
    },
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
  }
};
</script>
