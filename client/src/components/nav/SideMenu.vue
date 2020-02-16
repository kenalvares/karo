<template>
  <v-navigation-drawer v-model="drawer" app dark clipped>
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
import store from "../../store/index";
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
    }
  },
  methods: {
    refreshLinks() {
      this.links;
    }
  },
  watch: {
    $route: "refreshLinks"
  }
};
</script>
