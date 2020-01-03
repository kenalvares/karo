<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateProjectDialog />
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
          <v-btn value="fav" @click="filterProjects('fav')">
            Fav
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
<<<<<<< HEAD

      <v-col fluid>
        <v-card
          outlined
          class="emptyCard mx-auto"
          max-width="344"
          v-if="emptyProjectArray"
        >
          <v-card-text>
            <div small>Oops...</div>
            <p class="display-1 text--primary">
              Nothing to See
            </p>
            <div class="text--primary">
              It looks like there aren't any projects here, right now. You can
              click the button above to add a new one.
            </div>
          </v-card-text>
=======
      <v-col
        ><v-card
          outlined
          color="cyan darken-1"
          cols="12"
          sm="4"
          light
          v-if="emptyProjectArray"
        >
          <v-card-title class="headline">Nothing to See!</v-card-title>
          <v-card-subtitle
            >There don't seem to be any projects here. You can click the button
            below to add a new one now!</v-card-subtitle
          >
          <v-card-actions>
            <v-btn text>Add Project</v-btn>
          </v-card-actions>
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<<<<<<< HEAD
<style lang="scss" scoped>
.emptyCard {
  background-color: #fafafa;
}
</style>

=======
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
<script>
import ProjectCard from "@/components/cards/ProjectCard";
import CreateProjectDialog from "@/components/sheets/CreateProjectDialog";
export default {
  name: "projects",
  data: () => ({
    projectFilter: "all",
    filterColor: "purple",
    projects: [
      {
        id: "1",
        title: "Cure Cancer",
        team: "MedHeads",
        description:
          "Team of medical professionals working on potential cures for cancer",
        backgroundUrl: "https://picsum.photos/1080/600?random=1",
        avatar: "https://picsum.photos/300/300?random=6",
        status: "ongoing",
        fav: true
      },
      {
        id: "2",
        title: "Legalize Iguanas",
        team: "Youth4You",
        description:
          "Law college students fighting for the rights of iguanas everywhere",
        backgroundUrl: "https://picsum.photos/1080/600?random=2",
        avatar: "https://picsum.photos/300/300?random=7",
        status: "completed",
        fav: false
      },
      {
        id: "3",
        title: "Make a Block Buster",
        team: "20th Century Wolf",
        description:
          "Writing, directing and producing a high-budget, block-buster movie",
        backgroundUrl: "https://picsum.photos/1080/600?random=3",
        avatar: "https://picsum.photos/300/300?random=8",
        status: "onhold",
        fav: true
      },
      {
        id: "4",
        title: "Bust a Block Maker",
        team: "Goa Police",
        description: "Planning raids on all the undergroud block makers in Goa",
        backgroundUrl: "https://picsum.photos/1080/600?random=4",
        avatar: "https://picsum.photos/300/300?random=9",
        status: "completed",
        fav: false
      },
      {
        id: "5",
        title: "TY Project",
        team: "Group #5",
        description: "Developing an app to make project management easier",
        backgroundUrl: "https://picsum.photos/1080/600?random=5",
        avatar: "https://picsum.photos/300/300?random=10",
        status: "ongoing",
        fav: false
      }
    ]
  }),
  components: {
    ProjectCard,
    CreateProjectDialog
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
  methods: {
    filterProjects(type) {
      if (type === "all") {
        this.filterColor = "purple";
      } else if (type === "fav") {
        this.filterColor = "yellow";
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
