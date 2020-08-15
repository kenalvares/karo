<template>
  <v-container>
    <!--
      This row will show all teams that user is a part of.
      It will only display if client is not waiting for more data from server.
    -->
    <section v-if="!loader.pendingData">
      <v-toolbar>Your Teams</v-toolbar>
      <v-row>
        <!-- Display a single team from list of teams -->
        <v-col
          v-for="team in selectedTeams"
          :key="team.id"
          cols="12"
          sm="6"
          md="4"
        >
          <TeamCardSmall :team="team" :userid="userid" />
        </v-col>
        <!-- If user has no teams display notice -->
        <EmptyCard
          :toShow="emptyTeamArray"
          msg="
            It looks like there's nothing here right now. You can create a team on the Teams Page"
        />
      </v-row>
    </section>
    <section v-if="!loader.pendingData">
      <v-toolbar>Your Projects</v-toolbar>
      <v-row>
        <!-- Display a single team from list of teams -->
        <v-col
          v-for="project in selectedProjects"
          :key="project.title"
          cols="12"
          sm="6"
          md="4"
        >
          <!-- Single Project -->
          <ProjectCard :project="project" />
        </v-col>
        <!-- If user has no teams display notice -->
        <EmptyCard
          :toShow="emptyTeamArray"
          msg="
            It looks like there's nothing here right now. You can create a team on the Teams Page"
        />
      </v-row>
    </section>
    <!--
      This row contains the loader.
      It is only rendered while client is awaiting data from server
      -->
    <LoadingData :loader="loader" />
  </v-container>
</template>

<script>
// @ is an alias to /src
/*eslint-disable no-console*/
import LoadingData from "@/components/loaders/LoadingData";
import TeamCardSmall from "@/components/cards/TeamCardSmall";
import EmptyCard from "@/components/cards/EmptyCard";
import ProjectCard from "@/components/cards/ProjectCard";
import feathersClient from "../feathers-client";
import store from "../store/index";

export default {
  name: "Dashboard",
  components: {
    LoadingData,
    TeamCardSmall,
    EmptyCard,
    ProjectCard
  },
  computed: {
    // Return array of projects based on selected filters
    selectedProjects() {
      if (this.projectFilter === "fav") {
        return this.projects.filter(function(project) {
          return project.fav;
        });
      } else if (this.projectFilter === "completed") {
        return this.projects.filter(function(project) {
          if (project.status === "completed") {
            return true;
          }
        });
      } else if (this.projectFilter === "ongoing") {
        return this.projects.filter(function(project) {
          if (project.status === "ongoing") {
            return true;
          }
        });
      } else if (this.projectFilter === "onhold") {
        return this.projects.filter(function(project) {
          if (project.status === "onhold") {
            return true;
          }
        });
      } else {
        return this.projects;
      }
    },
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
    },
    // If user has no projects
    emptyProjectArray() {
      if (this.selectedProjects.length < 1) {
        return true;
      }
      return false;
    }
  },
  data: () => ({
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
    teamRoles: [
      /*
        id: String,
        role: String,
      */
    ], // Array of all possible teamRoles
    userid: null, // ID of this user
    loader: {
      pendingData: true,
      pendingMsg: "Pulling out the magnifying glass...",
      failed: false
    }, // Loader object
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
    // Array of projects user is working on
    projects: [
      /*
        id: String,
        title: String,
        description: String,
        backgroundUrl: String,
        status: String,
        team: String,
        avatar: String
      */
    ],
    // Array of roles in DB
    roles: [],
    // Array of statuses in DB
    status: []
  }),
  async created() {
    store.commit("setPageTitle", "Dashboard");
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // This user's data
        const user = store.getters.getUserData;
        this.loader.pendingMsg = "Searching for your teams...";
        console.log(user);
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
          // All teamRoles in db
          this.teamRoles = await this.pullRoleData();
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
      this.projects = [];
      this.roles = [];
      try {
        // This user's data
        const me = store.getters.getUserData;
        // IDs and names of roles
        const roles = await this.getRoles();
        // IDs of teams user is part of and ID of role of user in that team
        const teams = await this.getTeamsAndRoles(me.id);
        for (let i = 0; i < teams.length; i++) {
          // Get team name and logo
          const teamInfo = await this.getTeamNameAndLogo(teams[i].teamid);
          teams[i].name = teamInfo.name;
          teams[i].avatar = teamInfo.profilePicUrl;
          // Get this team's projects
          teams[i].projects = await this.getProjects(teams[i].teamid);
        }
        // Statuses in DB
        const status = await this.getStatus();
        let projects = [];
        // Add each project as an object to the projects array
        for (let i = 0; i < teams.length; i++) {
          for (let j = 0; j < teams[i].projects.length; j++) {
            let obj = {};
            obj.id = teams[i].projects[j].id;
            obj.title = teams[i].projects[j].name;
            obj.team = teams[i].name;
            obj.description = teams[i].projects[j].vision;
            obj.backgroundUrl = teams[i].projects[j].background;
            obj.avatar = teams[i].avatar;
            for (let k = 0; k < status.length; k++) {
              if (status[k].id === teams[i].projects[j].status) {
                obj.status = status[k].status;
              }
            }
            projects.push(obj);
          }
        }
        // Store server data tmeporarily
        this.projects = projects;
        this.roles = roles;
        this.user = me;
      } catch (err) {
        console.log("Error in Projects.vue", err);
      }
    },

    // Return ID's and Names of teamRoles in DB
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
    // Takes membership info of user and returns list of IDs of respective teamRoles of user in each team
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
          userid: val,
          $sort: { updatedAt: -1 }
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
          },
          $sort: { updatedAt: -1 }
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

    // Returns IDs and names of roles in DB
    async getRoles() {
      const rawRoles = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return [...rawRoles.data];
    },
    // Returns IDs of teams and IDs of roles of user in those teams
    async getTeamsAndRoles(val) {
      const rawTeams = await feathersClient.service("members").find({
        query: {
          userid: val,
          $select: ["teamid", "roleid"]
        }
      });
      return [...rawTeams.data];
    },
    // Returns name and profile picture of teams
    async getTeamNameAndLogo(val) {
      let teamInfo = await feathersClient.service("teams").find({
        query: {
          id: val,
          $select: ["name", "profilePicUrl"]
        }
      });
      return teamInfo.data[0];
    },
    // Returns info of projects owned by a team
    async getProjects(val) {
      let rawProjects = await feathersClient.service("projects").find({
        query: {
          teamid: val,
          $select: ["id", "name", "vision", "status", "background"]
        }
      });
      return rawProjects.data;
    },
    // Returns statuses in DB
    async getStatus() {
      const rawStatus = await feathersClient.service("project-status").find({
        query: {
          $select: ["id", "status"]
        }
      });
      return [...rawStatus.data];
    }
  }
};
</script>
