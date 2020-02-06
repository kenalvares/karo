<!-- Project Card -->
<!-- Displays project data in a card -->
<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar v-if="hasTeamAvatar">
        <v-img :src="teamAvatar"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ project.title }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ project.team }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-icon right :color="iconColor">{{ projectStatus }}</v-icon>
    </v-list-item>
    <v-img v-if="hasBackground" :src="background" height="194"></v-img>
    <v-card-text>
      {{ project.description }}
    </v-card-text>
    <v-card-actions>
      <v-btn text color="indigo accent-4" :to="'project/' + project.id">
        View
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ProjectCard",
  props: {
    project: Object
  },
  data: () => ({
    iconColor: "test",
    hasTeamAvatar: true,
    hasBackground: true
  }),
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
    background() {
      if (
        this.project.background === null ||
        this.project.background === undefined ||
        this.project.background === ""
      ) {
        return "";
      }
      return this.project.background;
    }
  },
  created() {
    if (
      this.project.background === null ||
      this.project.background === undefined ||
      this.project.background === ""
    ) {
      this.hasBackground = false;
    } else {
      this.hasBackground = true;
    }

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
  methods: {
    // Set icon color
    setIconColor(color) {
      this.iconColor = color;
    }
  }
};
</script>
