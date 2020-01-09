// src/store/store.js
import Vue from "vue";
import Vuex from "vuex";
import feathersClient from "../feathers-client";

Vue.use(Vuex);
/*eslint-disable no-console*/
export default new Vuex.Store({
  state: {
    sideDrawer: false,
    menus: {
      loggedOutMainMenu: [
        {
          icon: "mdi-home",
          text: "Home",
          route: "/"
        },
        {
          icon: "supervisor_account",
          text: "About",
          route: "/about"
        },
        {
          icon: "menu_book",
          text: "Docs",
          route: "/docs"
        },
        {
          icon: "report_problem",
          text: "Support",
          route: "/support"
        }
      ],
      loggedInMainMenu: [
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
      ],
      userMenu: [
        {
          icon: "mdi-home",
          text: "Profile",
          route: "/profile/:id"
        },
        {
          icon: "mdi-view-dashboard",
          text: "Account",
          route: "/account/:id"
        }
      ]
    },
    links: null,
    loginNotice: false,
    loggedIn: false,
    user: null
  },
  getters: {
    getMainMenu(state) {
      if (state.loggedIn) {
        return state.menus.loggedInMainMenu;
      } else {
        return state.menus.loggedOutMainMenu;
      }
    },
    getSideDrawer(state) {
      return state.sideDrawer;
    },
    getUserData(state) {
      let user = {};
      user.id = state.user.id;
      user.firstname = state.user.firstname;
      user.lastname = state.user.lastname;
      user.email = state.user.email;
      return user;
    },
    getUserMenu(state) {
      return state.menus.userMenu;
    },
    isUserLoggedIn(state) {
      return state.loggedIn;
    }
  },
  mutations: {
    changeSideDrawer(state) {
      state.sideDrawer = !state.sideDrawer;
    },
    showLoginNotice(state) {
      state.loginNotice = true;
    },
    hideLoginNotice(state) {
      state.loginNotice = false;
    },
    userLoggedIn(state) {
      state.loggedIn = true;
    },
    userLoggedOut(state) {
      state.loggedIn = false;
      state.user = null;
    }
  },
  actions: {
    async logout(context) {
      await feathersClient.logout();
      context.commit("userLoggedOut");
      context.commit("hideLoginNotice");
    },
    async login(context) {
      const rawData = await feathersClient.reAuthenticate();
      context.state.user = rawData.user;
      context.commit("userLoggedIn");
      context.commit("showLoginNotice");
    }
  }
});
