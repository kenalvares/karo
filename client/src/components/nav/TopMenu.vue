<template>
  <v-app-bar app color="light-blue darken-4" dark>
    <v-app-bar-nav-icon @click="changeSideDrawer()" />
    <v-toolbar-title>Karo</v-toolbar-title>
    <v-spacer />
    <v-btn
      depressed
      large
      class="indigo white--text btn-login"
      to="/login"
      v-if="!loggedIn"
    >
      <v-icon left small>lock_open</v-icon>Login
    </v-btn>
    <UserIconMenu v-if="loggedIn" />
  </v-app-bar>
</template>

<script>
import store from "../../store/index";
import UserIconMenu from "@/components/nav/UserIconMenu.vue";
//import feathersClient from "../../feathers-client";
/*eslint-disable no-console*/

export default {
  name: "TopMenu",
  async created() {
    await store.dispatch("login");
  },
  components: {
    UserIconMenu
  },
  computed: {
    loggedIn() {
      return store.getters.isUserLoggedIn;
    }
  },
  methods: {
    changeSideDrawer: () => {
      store.commit("changeSideDrawer");
    }
  }
};
</script>
