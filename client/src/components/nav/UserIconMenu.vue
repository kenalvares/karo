<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar>
          <v-img :src="avatarSrc" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list min-width="200">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :to="item.route + user.id"
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout()">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
/*eslint-disable no-console*/
import store from "../../store/index";
import router from "../../router/index";

export default {
  name: "UserIconMenu",
  data: () => ({
    user: {}
  }),
  created() {
    this.user = store.getters.getUserData;
  },
  computed: {
    items() {
      const userMenu = store.getters.getUserMenu;
      return userMenu;
    },
    avatarSrc() {
      return store.getters.avatarSrc;
    }
  },
  methods: {
    logout() {
      store.dispatch("logout");
      router.push("/");
    }
  }
};
</script>
