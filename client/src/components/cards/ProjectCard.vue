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
    </v-list-item>

    <v-img :src="project.backgroundUrl" height="194"></v-img>

    <v-card-text>
      {{ project.description }}
    </v-card-text>

    <v-card-actions>
      <v-btn text color="deep-purple accent-4">
        View
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ProjectCard",
  props: {
    project: Object
  }
};
</script>
