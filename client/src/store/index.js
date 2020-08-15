// src/store/store.js
import Vue from "vue";
import Vuex from "vuex";
import feathersClient from "../feathers-client";

Vue.use(Vuex);
/*eslint-disable no-console*/
export default new Vuex.Store({
  state: {
    sideDrawer: false,
    theme: "dark",
    break: false,
    menus: {
      loggedOutMenu: [
        {
          icon: "mdi-home",
          text: "Home",
          route: "/"
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
        }
      ],
      userMenu: [
        {
          icon: "mdi-home",
          text: "My Profile",
          route: "/profile/"
        }
      ]
    },
    // links: null,
    loginNotice: false,
    loggedIn: false,
    user: {},
    currentTeam: {},
    pageTitle: "Karo"
  },
  getters: {
    getMainMenu(state) {
      if (state.loggedIn) {
        return state.menus.loggedInMainMenu;
      } else {
        return state.menus.loggedOutMenu;
      }
    },
    onBreak(state) {
      return state.break;
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
    },
    currentTheme(state) {
      return state.theme;
    },
    getPageTitle(state) {
      return state.pageTitle;
    }
  },
  mutations: {
    changeSideDrawer(state) {
      state.sideDrawer = !state.sideDrawer;
    },
    hideSideDrawer(state) {
      state.sideDrawer = false;
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
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    changeBreak(state) {
      state.break = !state.break;
    },
    setPageTitle(state, str) {
      state.pageTitle = str;
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
          return rawData;
        });
      } catch (err) {
        let customErr = {};
        if (err.code === 401) {
          customErr.msg = "Try logging in again!";
        } else if (err.code === 408) {
          customErr.msg = "Authentication failed, try again!";
        } else {
          return err;
        }
        customErr.code = err.code;
        return customErr;
      }
    }
  }
});
