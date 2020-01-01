<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateProjectDialog />
        <v-btn-toggle
          v-model="projectFilter"
          tile
          color="deep-purple accent-3"
          group
        >
          <v-btn value="all">
            All
          </v-btn>
          <v-btn value="recent">
            Recent
          </v-btn>
          <v-btn value="favourites">
            Favourites
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="project in projects" :key="project.id" cols="12" sm="4">
        <ProjectCard :project="project" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProjectCard from "@/components/cards/ProjectCard";
import CreateProjectDialog from "@/components/sheets/CreateProjectDialog";
export default {
  name: "projects",
  data: () => ({
    projectFilter: null,
    projects: [
      {
        id: "1",
        title: "Cure Cancer",
        team: "MedHeads",
        description:
          "Team of medical professionals working on potential cures for cancer",
        backgroundUrl: "https://picsum.photos/1080/600?random=1",
        avatar: "https://picsum.photos/300/300?random=6"
      },
      {
        id: "2",
        title: "Legalize Iguanas",
        team: "Youth4You",
        description:
          "Law college students fighting for the rights of iguanas everywhere",
        backgroundUrl: "https://picsum.photos/1080/600?random=2",
        avatar: "https://picsum.photos/300/300?random=7"
      },
      {
        id: "3",
        title: "Make a Block Buster",
        team: "20th Century Wolf",
        description:
          "Writing, directing and producing a high-budget, block-buster movie",
        backgroundUrl: "https://picsum.photos/1080/600?random=3",
        avatar: "https://picsum.photos/300/300?random=8"
      },
      {
        id: "4",
        title: "Bust a Block Maker",
        team: "Goa Police",
        description: "Planning raids on all the undergroud block makers in Goa",
        backgroundUrl: "https://picsum.photos/1080/600?random=4",
        avatar: "https://picsum.photos/300/300?random=9"
      },
      {
        id: "5",
        title: "TY Project",
        team: "Group #5",
        description: "Developing an app to make project management easier",
        backgroundUrl: "https://picsum.photos/1080/600?random=5",
        avatar: "https://picsum.photos/300/300?random=10"
      }
    ]
  }),
  components: {
    ProjectCard,
    CreateProjectDialog
  }
};
</script>
