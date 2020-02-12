<template>
  <!-- Main vuetify app component containing entire view of application -->
  <v-app id="inspire">
    <!-- Left-Hand Side Navigation Menu -->
    <SideMenu />

    <!-- Top App Navigation Bar -->
    <TopMenu />

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application with the proper gutter -->
      <v-container fluid>
        <!-- Contains all views from vue-router -->
        <router-view />
      </v-container>
    </v-content>

    <!-- App Footer -->
    <v-footer elevation="2" color="lightgrey" app inset id="vFooter">
      <span>&copy; 2020 - Karo</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#vFooter {
  color: #777;
}

.logo {
  max-width: 200px;
  margin-bottom: 2%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
// @ is an alias to /src
import SideMenu from "@/components/nav/SideMenu";
import TopMenu from "@/components/nav/TopMenu";

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  }),
  components: {
    SideMenu,
    TopMenu
  }
};
</script>
