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
      loggedOutMenu: [
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
          icon: "mdi-account-multiple",
          text: "Teams",
          route: "/teams"
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
      userMenu: [
        {
          icon: "mdi-home",
          text: "My Profile",
          route: "/profile/"
        },
        {
          icon: "mdi-view-dashboard",
          text: "Account Preferences",
          route: "/account/"
        }
      ]
    },
    links: null,
    loginNotice: false,
    loggedIn: false,
    user: {},
    currentTeam: {}
  },
  getters: {
    getMainMenu(state) {
      if (state.loggedIn) {
        return state.menus.loggedInMainMenu;
      } else {
        return state.menus.loggedOutMenu;
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
      user.avatar = state.user.profilePicUrl;
      user.tagline = state.user.tagline;
      return user;
    },
    getTeamData(state) {
      return state.currentTeam;
    },
    getUserMenu(state) {
      return state.menus.userMenu;
    },
    isUserLoggedIn(state) {
      return state.loggedIn;
    },
    avatarSrc(state) {
      if (
        state.user.avatar === null ||
        state.user.avatar === undefined ||
        state.user.avatar === ""
      ) {
        return require("@/assets/user-placeholder.jpg");
      } else {
        return state.user.avatar;
      }
    },
    teamLogoSrc() {
      return require("@/assets/team-placeholder.jpg");
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
    },
    setCurrentTeam(state, raw) {
      state.currentTeam = { ...raw.team };
    }
  },
  actions: {
    setTeamData(context, team) {
      context.commit("setCurrentTeam", team);
    },
    async logout(context) {
      await feathersClient.logout();
      context.commit("userLoggedOut");
      context.commit("hideLoginNotice");
    },
    async login(context) {
      try {
        return await feathersClient.reAuthenticate().then(rawData => {
          context.state.user = rawData.user;
          context.commit("userLoggedIn");
          context.commit("showLoginNotice");
          return rawData;
        });
      } catch (err) {
        return err;
      }
    }
  }
});
