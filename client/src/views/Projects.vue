<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateProject :user="user" />
        <v-btn-toggle
          v-model="projectFilter"
          tile
          :color="filterColor"
          group
          mandatory
        >
          <v-btn value="all" @click="filterProjects('all')">
            All
          </v-btn>
          <v-btn value="completed" @click="filterProjects('completed')">
            Completed
          </v-btn>
          <v-btn value="ongoing" @click="filterProjects('ongoing')">
            Ongoing
          </v-btn>
          <v-btn value="onhold" @click="filterProjects('onhold')">
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
        <ProjectCard :project="project" />
      </v-col>
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
  data: () => ({
    projectFilter: "all",
    filterColor: "purple",
    user: {},
    projects: [],
    roles: [],
    status: []
  }),
  components: {
    ProjectCard,
    CreateProject,
    EmptyCard
  },
  computed: {
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
    emptyProjectArray() {
      if (this.selectedProjects.length < 1) {
        return true;
      }
      return false;
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        await store.dispatch("login");
        const me = store.getters.getUserData;
        const rawRoles = await feathersClient.service("roles").find({
          query: {
            $select: ["id", "role"]
          }
        });
        const roles = [...rawRoles.data];
        const rawTeams = await feathersClient.service("members").find({
          query: {
            userid: me.id,
            $select: ["teamid", "roleid"]
          }
        });
        const teams = [...rawTeams.data];
        for (let i = 0; i < teams.length; i++) {
          let teamInfo = await feathersClient.service("teams").find({
            query: {
              id: teams[i].teamid,
              $select: ["name", "profilePicUrl"]
            }
          });
          teams[i].name = teamInfo.data[i].name;
          teams[i].avatar = teamInfo.data[i].profilePicUrl;
          let rawProjects = await feathersClient.service("projects").find({
            query: {
              teamid: teams[i].teamid,
              $select: ["id", "name", "vision", "status", "background"]
            }
          });
          teams[i].projects = rawProjects.data;
        }
        const rawStatus = await feathersClient.service("project-status").find({
          query: {
            $select: ["id", "status"]
          }
        });
        const status = [...rawStatus.data];
        let projects = [];
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
        this.projects = projects;
        this.roles = roles;
        this.user = me;
      } catch (err) {
        console.log("Error in Projects.vue", err);
      }
    },
    filterProjects(type) {
      if (type === "all") {
        this.filterColor = "purple";
      } else if (type === "completed") {
        this.filterColor = "success";
      } else if (type === "ongoing") {
        this.filterColor = "red";
      } else if (type === "onhold") {
        this.filterColor = "indigo";
      } else {
        this.filterColor = "grey";
      }
      this.filterColor.concat(" accent-4");
    }
  }
};
</script>
