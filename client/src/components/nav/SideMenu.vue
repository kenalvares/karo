<template>
  <v-navigation-drawer v-model="drawer" app color="grey lighten-5">
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

export default {
  name: "SideMenu",
  data: () => ({
    sideDrawer: null
  }),
  computed: {
    links() {
      return store.getters.getMainMenu;
    },
    drawer: {
      get: function() {
        return store.getters.getSideDrawer;
      },
      set: function() {
        this.sideDrawer = store.getters.getSideDrawer;
      }
    }
  }
};
</script>
