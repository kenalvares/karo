<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateTeamDialog />
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
    <v-row>
      <v-col v-for="team in selectedTeams" :key="team.id" cols="12" sm="4">
        <TeamCard :team="team" />
      </v-col>
      <EmptyCard
        :toShow="emptyTeamArray"
        msg="
          It looks like there's nothing here right now. You can click the button
          above to add a new team."
      />
    </v-row>
  </v-container>
</template>

<script>
import TeamCard from "@/components/cards/TeamCard";
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
import EmptyCard from "@/components/cards/EmptyCard";
import feathersClient from "../feathers-client";

export default {
  name: "teams",
  data: () => ({
    teamFilter: "all",
    filterColor: "purple",
    teams: []
  }),
  components: {
    TeamCard,
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
    const rawAuthData = await this.authenticateUser();
    const user = rawAuthData.user;
    const rawMemberInfo = await this.findMemberInfo(user.id);
    const memberInfo = rawMemberInfo.data;
    const teamIds = this.getTeamIds(memberInfo);
    let teamData = await this.getTeamData(teamIds);
    let roleData = await this.getRoleData();
    const ownerRoleId = roleData.data[0].id;
    teamData = this.checkOwnership(memberInfo, teamData, ownerRoleId);

    teamData = this.markFavourites(memberInfo, teamData);
    this.setTeams(teamData);
  },
  methods: {
    markFavourites(rawArr, teamArr) {
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
            break;
          } else {
            teamArr.data[j].fav = false;
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
            break;
          } else {
            teamArr.data[j].owned = false;
          }
        }
      }
      return teamArr;
    },
    async getRoleData() {
      return await feathersClient.service("roles").find({
        query: {
          role: "Owner"
        }
      });
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
      return await feathersClient.service("members").find({
        query: {
          userid: val
        }
      });
    },
    async authenticateUser() {
      try {
        return await feathersClient.reAuthenticate();
      } catch (err) {
        /*eslint-disable no-console*/
        console.log(err);
        /*eslint-enable no-console*/
      }
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
      for (let i = 0; i < teamData.length; i++) {
        this.teams.push({
          id: i,
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
