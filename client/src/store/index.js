// src/store/store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideDrawer: false,
    menus: {
      mainMenu: [
        {
          icon: "mdi-home",
          text: "Home",
          route: "/"
        },
        {
          icon: "mdi-view-dashboard",
          text: "Dashboard",
          route: "/dashboard"
        },
        {
          icon: "mdi-file-multiple",
          text: "Projects",
          route: "/projects"
        },
        {
          icon: "mdi-message",
          text: "Chats",
          route: "/chats"
        },
        {
          icon: "mdi-account-multiple",
          text: "Teams",
          route: "/teams"
        }
      ]
    },
    links: null,
    loggedIn: false
  },
  getters: {
    getMainMenu(state) {
      return state.menus.mainMenu;
    },
    getSideDrawer(state) {
      return state.sideDrawer;
    },
    isUserLoggedIn(state) {
      return state.loggedIn;
    }
  },
  mutations: {
    changeSideDrawer(state) {
      state.sideDrawer = !state.sideDrawer;
    },
    userLoggedIn(state) {
      state.loggedIn = true;
    },
    userLoggedOut(state) {
      state.loggedIn = false;
    }
  },
  actions: {}
});
