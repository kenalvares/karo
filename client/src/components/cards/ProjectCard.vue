<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="project.avatar"></v-img
      ></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{
          project.title
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ project.team }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-icon right :color="iconColor">{{ projectStatus }}</v-icon>
    </v-list-item>

    <v-img :src="project.backgroundUrl" height="194"></v-img>

    <v-card-text>
      {{ project.description }}
    </v-card-text>

    <v-card-actions>
      <v-btn text color="indigo accent-4">
        View
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :color="checkFav" @click="favouriteThisProject(project.id)" icon>
        <v-icon>star</v-icon>
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
    iconColor: "test"
  }),
  computed: {
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
    checkFav() {
      if (this.project.fav === true) {
        return "yellow";
      }
      return "grey";
    }
  },
  methods: {
    setIconColor(color) {
      this.iconColor = color;
    },
    favouriteThisProject() {
      this.project.fav = !this.project.fav;
    }
  }
};
</script>
