<template>
  <v-app id="inspire">
    <SideMenu />

    <TopMenu />

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view />
      </v-container>
    </v-content>

    <v-footer elevation="2" color="lightgrey" app inset id="vFooter">
      <span>&copy; 2019 - Karo</span>
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
