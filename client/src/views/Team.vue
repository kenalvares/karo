<template>
  <v-container>
    <!-- Dialog box to create a new project -->
    <CreateProject
      :team="team"
      :user="user"
      :status="status"
      :showDialog="createProject"
      @closeProjectCreation="close()"
    />
    <v-row class="mt-0">
      <!-- If data is pending from server -->
      <LoadingData :loader="loadingData" />
      <!-- Show details of this team if no data is pending -->
      <TeamDetailsCard
        v-if="!loadingData.pendingData"
        :initlogoSrc="logoSrc"
        :initteam="team"
        :initowned="owned"
        :initmembers="members"
        :initprojects="projects"
        @teamUpdated="fetchData(true)"
      />
      <!-- Button to create a new project -->
      <v-btn
        fab
        bottom
        right
        fixed
        class="my-4 red"
        v-if="owned"
        @click="open()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="!loadingData.pendingData">
      <v-col cols="12">
        <!-- Create a new Project -->
        <CreateProject :user="user" />
        <!-- Filter through projects -->
        <v-btn-toggle
          v-model="projectFilter"
          color="primary lighten-1"
          group
          class="filters"
          mandatory
        >
          <!-- View All -->
          <v-btn value="all">
            All
          </v-btn>
          <!-- View Completed -->
          <v-btn value="completed">
            Completed
          </v-btn>
          <!-- View Ongoing -->
          <v-btn value="ongoing">
            Ongoing
          </v-btn>
          <!-- View Onhold -->
          <v-btn value="onhold">
            Onhold
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
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
      <!-- If user doesn't have any projects -->
      <EmptyCard
        :toShow="emptyProjectArray"
        msg="
          It looks like there's nothing here right now. Hit the big red button on the bottom right of the screen to start a new project."
      />
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.filters {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

<script>
/*eslint-disable no-console*/
import store from "../store/index";
import feathersClient from "../feathers-client";
import TeamDetailsCard from "@/components/cards/TeamDetailsCard";
import LoadingData from "@/components/loaders/LoadingData";
import ProjectCard from "@/components/cards/ProjectCard";
import CreateProject from "@/components/dialogs/CreateProject";
import EmptyCard from "@/components/cards/EmptyCard";

export default {
  name: "Team",
  components: {
    TeamDetailsCard,
    LoadingData,
    ProjectCard,
    CreateProject,
    EmptyCard
  },
  data: () => ({
    createProject: false, // Does user want to create a project or not?
    projectFilter: "all",
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
    members: [
      /*
        userid: String,
        name: String,
        email: String,
        role: String,
        fav: Boolean
      */
    ],
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
    owned: false, // Is the team owned by this user?
    loadingData: {
      pendingData: true,
      pendingMsg: "Getting Team Data...",
      failed: false
    } // Loader component
  }),
  async created() {
    store.commit("setPageTitle", "Karo");
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
    },
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
    // If user has no projects
    emptyProjectArray() {
      if (this.selectedProjects.length < 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
    // Close project creation dialog
    async close() {
      await this.fetchData();
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
          $select: ["id", "userid", "roleid", "fav"],
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
    // Returns info of projects owned by a team
    async getProjects() {
      let rawProjects = await feathersClient.service("projects").find({
        query: {
          teamid: this.team.id,
          $select: ["id", "name", "vision", "status", "background"]
        }
      });
      return rawProjects.data;
    },
    // Initial data fetch
    async fetchData() {
      try {
        // This user's info
        const me = store.getters.getUserData;
        // This team's data
        const team = await this.getTeamData();
        this.loadingData.pendingData = true;
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

        await this.projectFunctions(me, roles, status);
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
    },
    async projectFunctions(me, roles, status) {
      try {
        const rawProjects = await this.getProjects();
        // Statuses in DB
        let projects = [];
        // Add each project as an object to the projects array
        for (let j = 0; j < rawProjects.length; j++) {
          let obj = {};
          obj.id = rawProjects[j].id;
          obj.title = rawProjects[j].name;
          obj.description = rawProjects[j].vision;
          obj.backgroundUrl = rawProjects[j].background;
          for (let k = 0; k < status.length; k++) {
            if (status[k].id === rawProjects[j].status) {
              obj.status = status[k].status;
            }
          }
          projects.push(obj);
        }
        // Store server data tmeporarily
        this.projects = projects;
        this.roles = roles;
        this.user = me;
      } catch (err) {
        console.log("Error in Getting Projects - Team.vue", err);
      }
    }
  },
  // Fetch data again if route chanages
  watch: {
    $route: "fetchData"
  }
};
</script>
