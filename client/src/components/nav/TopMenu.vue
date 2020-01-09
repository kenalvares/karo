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
    <v-menu bottom left v-if="loggedIn">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="item in items" :key="item.id">
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import store from "../../store/index";
import router from "../../router/index";
import feathersClient from "../../feathers-client";

export default {
  name: "TopMenu",
  data: () => ({}),
  created: async () => {
    try {
      return await feathersClient.reAuthenticate().then(() => {
        store.dispatch("login");
      });
    } catch (err) {
      store.dispatch("logout");
    }
  },
  computed: {
    items() {
      return store.getters.getUserMenu;
    },
    loggedIn() {
      return store.getters.isUserLoggedIn;
    }
  },
  methods: {
    changeSideDrawer: () => {
      store.commit("changeSideDrawer");
    },
    logout() {
      store.dispatch("logout");
      router.push("/");
    }
  }
};
</script>
