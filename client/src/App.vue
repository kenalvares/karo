<template>
  <!-- Main vuetify app component containing entire view of application -->
  <v-app id="inspire">
    <!-- Left-Hand Side Navigation Menu -->
    <SideMenu />

    <!-- Top App Navigation Bar -->
    <TopMenu />

    <!-- Sizes your content based upon application components -->
    <v-content dark color="#121212">
      <!-- Provides the application with the proper gutter -->
      <v-container dark fluid color="#121212">
        <!-- Contains all views from vue-router -->
        <router-view dark color="#121212" />
      </v-container>
    </v-content>

    <!-- App Footer -->
    <v-footer app dark id="vFooter" clipped-left>
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
  },
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
