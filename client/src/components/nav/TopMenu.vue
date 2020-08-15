<template>
  <v-app-bar
    app
    elevation="4"
    :class="
      `${dark ? 'red darken-4' : 'red'} ${visible ? 'not-hidden' : 'hidden'}`
    "
    :height="50"
    dark
  >
    <v-app-bar-nav-icon @click="changeSideDrawer()" />
    <v-spacer />
    <v-toolbar-title
      ><b>{{ title.toUpperCase() }}</b></v-toolbar-title
    >
    <v-spacer />
    <v-btn depressed large color="success" to="/login" v-if="!loggedIn">
      <v-icon left small>lock_open</v-icon>Login
    </v-btn>

    <NotificationDrawer v-if="loggedIn" />
    <UserIconMenu v-if="loggedIn" @themeSet="setTheme()" />
    <v-btn
      absolute
      fab
      bottom
      right
      v-if="loggedIn"
      :small="visible"
      :x-small="!visible"
      :class="`${dark ? 'red darken-4' : 'red'} hide-menu`"
      @click="fullScreen()"
      :style="`${visible ? 'bottom:-100%' : 'bottom: -95%'}`"
    >
      <v-icon>
        {{ icon }}
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.hidden {
  transform: translateY(-60px) !important;
}
.not-hidden {
  transform: translateY(0);
}
.hide-menu {
  z-index: -1;
}
</style>

<script>
import store from "@/store/index";

import UserIconMenu from "@/components/nav/UserIconMenu";
import NotificationDrawer from "@/components/cards/NotificationDrawer";
/*eslint-disable no-console*/

export default {
  name: "TopMenu",
  async created() {
    try {
      await store.dispatch("login");
    } catch (err) {
      console.log(err);
    }
  },
  data: () => ({
    visible: true
  }),
  components: {
    UserIconMenu,
    NotificationDrawer
  },
  computed: {
    title() {
      return store.getters.getPageTitle;
    },
    loggedIn() {
      return store.getters.isUserLoggedIn;
    },
    dark() {
      const theme = store.getters.currentTheme;
      if (theme === "dark") {
        return true;
      }
      return false;
    },
    icon() {
      if (this.visible) {
        return "fullscreen";
      }
      return "fullscreen_exit";
    }
  },
  methods: {
    changeSideDrawer: () => {
      store.commit("changeSideDrawer");
    },
    setTheme() {
      this.$emit("themeSet");
    },
    fullScreen() {
      console.log("fs ran!");
      store.commit("hideSideDrawer");
      this.visible = !this.visible;
    }
  }
};
</script>
