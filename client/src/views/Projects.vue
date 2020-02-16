<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Create a new Project -->
        <CreateProject :user="user" />
        <!-- Filter through projects -->
        <v-btn-toggle
          v-model="projectFilter"
          color="primary lighten-1"
          group
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
        sm="4"
      >
        <!-- Single Project -->
        <ProjectCard :project="project" />
      </v-col>
      <!-- If user doesn't have any projects -->
      <EmptyCard
        :toShow="emptyProjectArray"
        msg="
          It looks like there's nothing here right now. You can click the button
          above to add a new project."
      />
    </v-row>
  </v-container>
</template>

<script>
import ProjectCard from "@/components/cards/ProjectCard";
import CreateProject from "@/components/dialogs/CreateProject";
import EmptyCard from "@/components/cards/EmptyCard";
import feathersClient from "@/feathers-client";
import store from "@/store/index.js";
/*eslint-disable no-console*/

export default {
  name: "projects",
  components: {
    ProjectCard,
    CreateProject,
    EmptyCard
  },
  data: () => ({
    // Selected filter
    projectFilter: "all",
    // This user
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
    // Initial data fetch
    await this.fetchData();
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
    // If user has no projects
    emptyProjectArray() {
      if (this.selectedProjects.length < 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
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
    },
    // Initial data fetch
    async fetchData() {
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
    }
  }
};
</script>
