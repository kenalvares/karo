<template>
  <v-menu top left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar>
          <v-img :src="avatarSrc" />
        </v-avatar>
      </v-btn>
    </template>

    <v-card min-width="200">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="display-1"
              >Hi, {{ user.firstname }}</v-list-item-title
            >
            <v-list-item-subtitle class="title">{{
              clock
            }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn class="red--text" icon @click="func()">
              <v-icon>snooze</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :to="item.route + user.id"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="darkMode" color="success"></v-switch>
          </v-list-item-action>
          <v-list-item-title>Dark Mode</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn @click="logout()"> Logout</v-btn>
        <v-btn to="/support">Help</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
/*eslint-disable no-console*/
/*eslint-disable no-unused-vars*/
import store from "../../store/index";
import router from "../../router/index";

export default {
  name: "UserIconMenu",
  data: () => ({
    user: {},
    clock: "00:00 am",
    darkMode: true
  }),
  created() {
    this.user = store.getters.getUserData;
    let timerID = setInterval(this.updateTime, 1000);
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
    },
    updateTime() {
      const d = new Date();
      let hours = d.getHours();
      let minutes = d.getMinutes();
      let timeOfDay = "am";
      if (hours >= 12) {
        hours -= 12;
        timeOfDay = "pm";
      }
      if (minutes < 10) {
        let zero = "0";
        minutes = zero.concat(minutes);
      }
      this.clock = `${hours}:${minutes} ${timeOfDay}`;
    }
  }
};
</script>
