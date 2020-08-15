<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-toolbar class="grey darken-4" flat dense>
      <v-btn small text tile class=" my-1" @click="back()">
        <v-icon x-small>arrow_back_ios</v-icon>Back
      </v-btn>
    </v-toolbar>
    <v-list dense>
      <v-list-item
        v-for="link in links"
        :key="link.text"
        router
        :to="link.route"
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import store from "@/store/index";
import router from "@/router/index";
/*eslint-disable no-console*/

export default {
  name: "SideMenu",
  data: () => ({
    sideDrawer: null
  }),
  computed: {
    links() {
      let links = store.getters.getMainMenu;
      return links;
    },
    drawer: {
      get: function() {
        return store.getters.getSideDrawer;
      },
      set: function() {
        this.sideDrawer = store.getters.getSideDrawer;
      }
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
    refreshLinks() {
      this.links;
    },
    back() {
      router.go(-1);
    }
  },
  watch: {
    $route: "refreshLinks"
  }
};
</script>
