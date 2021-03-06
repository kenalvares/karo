<!-- Project Card -->
<!-- Displays project data in a card -->
<template>
  <article>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 16 : 2" class="mx-auto py-1 px-0">
        <v-list-item>
          <!-- Team Logo -->
          <v-list-item-avatar v-if="hasTeamAvatar">
            <v-img :src="teamAvatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <!-- Project Name -->
            <v-list-item-title class="headline">
              {{ project.title }}
            </v-list-item-title>
            <!-- Team Name -->
            <v-list-item-subtitle>{{ project.team }}</v-list-item-subtitle>
          </v-list-item-content>
          <!-- Project Status -->
          <v-icon
            right
            :color="hover ? (dark ? 'white' : 'black') : iconColor"
            >{{ projectStatus }}</v-icon
          >
        </v-list-item>
        <!-- Project background -->
        <v-img v-if="hasBackground" :src="background" height="194"></v-img>
        <!-- Project Description -->
        <v-card-text>
          {{ project.description }}
        </v-card-text>
        <v-card-actions>
          <!-- View Project -->
          <v-btn text :to="'/project/' + project.id">
            View
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </article>
</template>

<script>
import store from "@/store/index";
export default {
  name: "ProjectCard",
  props: {
    project: Object
    /*
      id: String,
      title: String,
      description: String,
      backgroundUrl: String,
      status: String,
      team: String,
      avatar: String
    */
  },
  data: () => ({
    iconColor: "test", // Project status icon color
    hasTeamAvatar: true, // Does team have a logo?
    hasBackground: true // Does project have a background?
  }),
  created() {
    // Does project have a background?
    if (
      this.project.background === null ||
      this.project.background === undefined ||
      this.project.background === ""
    ) {
      this.hasBackground = false;
    } else {
      this.hasBackground = true;
    }
    // Does team have a logo?
    if (
      this.project.avatar === null ||
      this.project.avatar === undefined ||
      this.project.avatar === ""
    ) {
      this.hasTeamAvatar = false;
    } else {
      this.hasTeamAvatar = true;
    }
  },
  computed: {
    // Set project status icon and color
    projectStatus() {
      if (this.project.status === "ongoing") {
        this.setIconColor("red");
        return "access_time";
      } else if (this.project.status === "completed") {
        this.setIconColor("success");
        return "check";
      }
      this.setIconColor("info");
      return "pause";
    },
    // Return sanitized team avatar url
    teamAvatar() {
      if (
        this.project.avatar === null ||
        this.project.avatar === undefined ||
        this.project.avatar === ""
      ) {
        return "";
      }
      return this.project.avatar;
    },
    // Return sanitized background img url
    background() {
      if (
        this.project.background === null ||
        this.project.background === undefined ||
        this.project.background === ""
      ) {
        return "";
      }
      return this.project.background;
    },
    dark() {
      const theme = store.getters.currentTheme;
      if (theme === "dark") {
        return true;
      }
      return false;
    }
  },
  methods: {
    // Set icon color
    setIconColor(color) {
      this.iconColor = color;
    }
  }
};
</script>
