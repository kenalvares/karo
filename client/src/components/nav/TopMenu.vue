<template>
  <v-app-bar app color="light-blue darken-4" dark>
    <v-app-bar-nav-icon @click="changeSideDrawer()" />
    <v-toolbar-title>Karo</v-toolbar-title>
  </v-app-bar>
</template>

<script>
import store from "../../store/index";

export default {
  name: "TopMenu",
  data: () => ({
    links: [
      {
        icon: "mdi-home",
        text: "Home",
        route: "/"
      },
      {
        icon: "mdi-view-dashboard",
        text: "Dashboard",
        route: "/dashboard"
      },
      {
        icon: "mdi-file-multiple",
        text: "Projects",
        route: "/projects"
      },
      {
        icon: "mdi-message",
        text: "Chats",
        route: "/chats"
      },
      {
        icon: "mdi-account-multiple",
        text: "Teams",
        route: "/teams"
      }
    ]
  }),
  methods: {
    changeSideDrawer: () => {
      store.commit("changeSideDrawer");
    }
  }
};
</script>
