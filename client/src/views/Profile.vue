<template>
  <v-container fluid>
    <!-- If data from server is still pending -->
    <LoadingData :loader="loader" />
    <!-- Show profile if data is no longer pending -->
    <v-row v-if="!loader.pendingData" align="start" class="fill-height">
      <v-col cols="4">
        <!-- Profile Card -->
        <v-card max-width="370" tile>
          <v-flex class="teal darken-2">
            <v-row align="end" class="fill-height">
              <v-col align-self="start" cols="12" class="flex-row">
                <!-- Profile img -->
                <v-avatar color="grey" size="164" style="overflow:hidden">
                  <v-img :src="avatarSrc"></v-img>
                  <CloudinaryUploader
                    v-if="editing"
                    cloudName="karo"
                    uploadPreset="karo_unsigned"
                    :sources="['local', 'url']"
                    :showAdvancedOptions="false"
                    :cropping="true"
                    :multiple="false"
                    defaultSource="local"
                    @completed="uploaded"
                  />
                </v-avatar>

                <v-spacer />
                <!-- If this user's profile -->
                <v-flex class="flex-row-reverse" v-if="me">
                  <!-- Edit Profile -->
                  <v-btn
                    outlined
                    class="teal darken-1 mx-2 teal--text text--darken-4"
                    @click="editing = !editing"
                    v-if="!editing"
                  >
                    Edit
                    <v-icon small right>create</v-icon>
                  </v-btn>
                  <!-- Update Profile -->
                  <v-btn
                    class="teal lighten-1 mx-2 teal--text text--darken-4"
                    v-if="editing"
                    @click="updateProfile()"
                  >
                    <v-icon small>
                      check
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <!-- Name -->
                    <v-list-item-title class="flex-row title">
                      <span v-if="!editing">{{ fullName }}</span>
                      <v-text-field
                        v-if="editing"
                        placeholder="First Name"
                        v-model="profile.firstname"
                      ></v-text-field>
                      <v-text-field
                        v-if="editing"
                        placeholder="Last Name"
                        v-model="profile.lastname"
                      ></v-text-field>
                    </v-list-item-title>
                    <v-list-item-subtitle class="flex-row">
                      <!-- Tagline -->
                      <span v-if="!editing">{{ profile.tagline }}</span>
                      <v-text-field
                        v-if="editing"
                        placeholder="Tagline"
                        v-model="profile.tagline"
                      ></v-text-field>
                    </v-list-item-subtitle>
                    <!-- Friends only -->
                    <v-list-item-subtitle class="friends-info" v-if="friends">
                      <!-- Email -->
                      <a
                        class="contact-link"
                        v-if="!editing"
                        :href="'mailto:' + profile.email"
                        target="_top"
                        >{{ profile.email }}</a
                      >
                      <v-text-field
                        v-if="editing"
                        placeholder="Email"
                        v-model="profile.email"
                      ></v-text-field>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="friends-info" v-if="friends">
                      <!-- Phone No. -->
                      <a
                        class="contact-link"
                        v-if="!editing"
                        :href="'tel:' + profile.phone"
                        target="_top"
                        >{{ profile.phone }}</a
                      >
                      <v-text-field
                        v-if="editing"
                        placeholder="Phone"
                        v-model="profile.phone"
                      ></v-text-field>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="friends-info" v-if="friends">
                      <!-- Country -->
                      <span v-if="!editing">{{ profile.country }}</span>
                      <v-text-field
                        v-if="editing"
                        placeholder="Country"
                        v-model="profile.country"
                      ></v-text-field>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-flex>
          <!-- If not this user's profile -->
          <v-flex v-if="!me" class="grey darken-4">
            <v-col class="flex-row">
              <!-- Add friend -->
              <v-btn
                @click="addFriend()"
                v-if="!friends"
                class="secondary mr-3"
                :loading="addingFriend"
                :disabled="requestPending"
              >
                {{ requestPending ? "Pending" : "Friend" }}
                <v-icon v-if="!requestPending" right>add</v-icon>
              </v-btn>
              <!-- Message -->
              <v-btn @click="message()" class="primary">
                Message
                <v-icon right>message</v-icon>
              </v-btn>
            </v-col>
          </v-flex>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>About</v-expansion-panel-header>
              <!-- Bio -->
              <v-expansion-panel-content>
                <span v-if="!editing">{{ profile.bio }}</span>
                <v-textarea
                  auto-grow
                  v-if="editing"
                  placeholder="Biography"
                  v-model="profile.bio"
                ></v-textarea>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- If not editing -->
          <v-expansion-panels v-if="!editing">
            <v-expansion-panel>
              <v-expansion-panel-header>Friends</v-expansion-panel-header>
              <!-- If friends data has loaded -->
              <v-expansion-panel-content v-if="friendsLoaded">
                <div
                  v-for="friend in friendList"
                  :key="friend.friendid"
                  class="flex-row-center"
                >
                  <!-- Friend profile img -->
                  <v-avatar v-if="friend.avatar" size="30" class="mr-2">
                    <v-img :src="friend.avatar" />
                  </v-avatar>
                  <!-- Friend name -->
                  <span v-if="hasFriends">{{ friend.fullname }}</span>
                  <v-spacer />
                  <!-- Options -->
                  <v-menu bottom left>
                    <template v-slot:activator="{ on }">
                      <v-btn small icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        v-for="(option, i) in options"
                        :key="i"
                        @click="goTo(option.link, friend.friendid)"
                      >
                        <v-list-item-title>{{ option.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <!-- If user has no friends -->
                <div v-if="!hasFriends">
                  <em>No friends!</em>
                </div>
              </v-expansion-panel-content>
              <!-- If friends data has not loaded -->
              <v-expansion-panel-content v-if="!friendsLoaded">
                <!-- Loader -->
                <v-row class="full-height">
                  <v-col cols="12" align="center" class="flex-column">
                    <v-progress-circular
                      :size="100"
                      :width="5"
                      color="primary"
                      indeterminate
                      class="mb-5"
                      v-if="!loader.failed"
                    ></v-progress-circular>
                    <v-progress-circular
                      :size="100"
                      :width="5"
                      color="grey"
                      class="mb-5"
                      v-if="loader.failed"
                    >
                      <v-icon color="grey">close</v-icon>
                    </v-progress-circular>
                    <span>{{ loader.pendingMsg }}</span>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-toolbar>Projects</v-toolbar>
        <v-row>
          <!-- Display a single team from list of teams -->
          <v-col
            v-for="project in selectedProjects"
            :key="project.title"
            cols="12"
            sm="6"
            md="4"
          >
            <!-- Single Project -->
            <ProjectCard :project="project" />
          </v-col>
          <!-- If user has no teams display notice -->
          <EmptyCard
            :toShow="emptyProjectArray"
            :msg="`${profile.firstname} doesnt have any projects yet!`"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
}
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}
.flex-column {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flex-row-reverse {
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: start;
}
.friends-info {
  font-size: 1rem !important;
  color: #fff !important;
  padding-top: 0.5rem;
}
.contact-link {
  text-decoration: none;
  color: #fff !important;
  &:hover {
    opacity: 0.5;
  }
}
</style>

<script>
/*eslint-disable no-console*/
// @ is an alias to /src
import store from "@/store/index";
import router from "@/router/index";
import EmptyCard from "@/components/cards/EmptyCard";
import ProjectCard from "@/components/cards/ProjectCard";
import feathersClient from "../feathers-client";
import LoadingData from "@/components/loaders/LoadingData";
import CloudinaryUploader from "@/components/uploaders/CloudinaryUploader";

export default {
  name: "profile",
  components: {
    LoadingData,
    CloudinaryUploader,
    EmptyCard,
    ProjectCard
  },
  data: () => ({
    options: [
      {
        name: "View",
        link: "/profile/"
      },
      {
        name: "Message",
        link: "/chats"
      }
    ],
    user: {},
    me: false,
    profile: {},
    editing: false,
    friends: false,
    loader: {
      pendingData: true,
      pendingMsg: "Getting user profile...",
      failed: false
    },
    requestPending: false,
    addingFriend: false,
    friendsLoaded: false,
    hasFriends: false,
    friendList: null,
    // Array of projects user is working on
    projects: [
      /*
        id: String,
        title: String,
        description: String,
        backgroundUrl: String,
        status: String,
        team: String,
        avatar: String
      */
    ],
    // Array of roles in DB
    roles: [],
    // Array of statuses in DB
    status: []
  }),
  async created() {
    store.commit("setPageTitle", "Profile");
    await this.fetchData();
  },
  computed: {
    // Return array of projects based on selected filters
    selectedProjects() {
      if (this.projectFilter === "fav") {
        return this.projects.filter(function(project) {
          return project.fav;
        });
      } else if (this.projectFilter === "completed") {
        return this.projects.filter(function(project) {
          if (project.status === "completed") {
            return true;
          }
        });
      } else if (this.projectFilter === "ongoing") {
        return this.projects.filter(function(project) {
          if (project.status === "ongoing") {
            return true;
          }
        });
      } else if (this.projectFilter === "onhold") {
        return this.projects.filter(function(project) {
          if (project.status === "onhold") {
            return true;
          }
        });
      } else {
        return this.projects;
      }
    },
    // If user has no projects
    emptyProjectArray() {
      if (this.selectedProjects.length < 1) {
        return true;
      }
      return false;
    },
    avatarSrc() {
      if (
        this.profile.avatar === null ||
        this.profile.avatar === undefined ||
        this.profile.avatar === ""
      ) {
        return require("@/assets/user-placeholder.jpg");
      } else {
        return this.profile.avatar;
      }
    },
    fullName() {
      return this.profile.firstname + " " + this.profile.lastname;
    }
  },
  methods: {
    // Returns IDs and names of roles in DB
    async getRoles() {
      const rawRoles = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return [...rawRoles.data];
    },
    // Returns IDs of teams and IDs of roles of user in those teams
    async getTeamsAndRoles(val) {
      const rawTeams = await feathersClient.service("members").find({
        query: {
          userid: val,
          $select: ["teamid", "roleid"]
        }
      });
      return [...rawTeams.data];
    },
    // Returns name and profile picture of teams
    async getTeamNameAndLogo(val) {
      let teamInfo = await feathersClient.service("teams").find({
        query: {
          id: val,
          $select: ["name", "profilePicUrl"]
        }
      });
      return teamInfo.data[0];
    },
    // Returns info of projects owned by a team
    async getProjects(val) {
      let rawProjects = await feathersClient.service("projects").find({
        query: {
          teamid: val,
          $select: ["id", "name", "vision", "status", "background"]
        }
      });
      return rawProjects.data;
    },
    // Returns statuses in DB
    async getStatus() {
      const rawStatus = await feathersClient.service("project-status").find({
        query: {
          $select: ["id", "status"]
        }
      });
      return [...rawStatus.data];
    },
    message() {
      router.push("/chats");
    },
    uploaded(val) {
      this.profile.avatar = val.url;
      console.log(val);
    },
    async fetchData() {
      this.loader.pendingData = true;
      this.loader.pendingMsg = "Getting user profile...";
      this.loader.failed = false;
      this.friendsLoaded = false;
      try {
        await store.dispatch("login");
      } catch (err) {
        console.log(err);
      }
      this.user = store.getters.getUserData;
      const raw = await feathersClient.service("users").find({
        query: {
          id: this.$router.history.current.params.id
        }
      });
      this.profile = raw.data[0];
      if (this.user.id === this.profile.id) {
        this.me = true;
        this.friends = true;
      } else {
        this.me = false;
        this.friends = false;
      }
      this.loader.pendingMsg = `${this.profile.firstname}'s profile is loading...`;
      const raw2 = await feathersClient.service("friends").find({
        query: {
          $or: [
            {
              userid_1: this.profile.id,
              status: "friends"
            },
            {
              userid_2: this.profile.id,
              status: "friends"
            }
          ]
        }
      });
      this.friendList = raw2.data;
      if (this.friendList.length < 1) {
        this.hasFriends = false;
      } else {
        this.hasFriends = true;
      }
      for (let i = 0; i < this.friendList.length; i++) {
        if (this.profile.id === this.friendList[i].userid_1) {
          this.friendList[i].friendid = this.friendList[i].userid_2;
          this.friends = true;
        } else if (this.profile.id === this.friendList[i].userid_2) {
          this.friendList[i].friendid = this.friendList[i].userid_1;
          this.friends = true;
        } else {
          this.friends = false;
        }
        delete this.friendList[i].userid_1;
        delete this.friendList[i].userid_2;
        delete this.friendList[i].createdAt;
        delete this.friendList[i].updatedAt;
        delete this.friendList[i].id;
        const rawFriendData = await feathersClient.service("users").find({
          query: {
            id: this.friendList[i].friendid,
            $select: ["firstname", "lastname", "avatar"]
          }
        });
        const friendData = rawFriendData.data[0];
        this.friendList[i].fullname =
          friendData.firstname + " " + friendData.lastname;
        this.friendList[i].avatar = friendData.avatar;
      }
      this.friendsLoaded = true;
      this.loader.pendingData = false;

      await this.checkRequest();

      this.projects = [];
      this.roles = [];
      try {
        // This user's data
        const me = this.profile;
        // IDs and names of roles
        const roles = await this.getRoles();
        // IDs of teams user is part of and ID of role of user in that team
        const teams = await this.getTeamsAndRoles(me.id);
        for (let i = 0; i < teams.length; i++) {
          // Get team name and logo
          const teamInfo = await this.getTeamNameAndLogo(teams[i].teamid);
          teams[i].name = teamInfo.name;
          teams[i].avatar = teamInfo.profilePicUrl;
          // Get this team's projects
          teams[i].projects = await this.getProjects(teams[i].teamid);
        }
        // Statuses in DB
        const status = await this.getStatus();
        let projects = [];
        // Add each project as an object to the projects array
        for (let i = 0; i < teams.length; i++) {
          for (let j = 0; j < teams[i].projects.length; j++) {
            let obj = {};
            obj.id = teams[i].projects[j].id;
            obj.title = teams[i].projects[j].name;
            obj.team = teams[i].name;
            obj.description = teams[i].projects[j].vision;
            obj.backgroundUrl = teams[i].projects[j].background;
            obj.avatar = teams[i].avatar;
            for (let k = 0; k < status.length; k++) {
              if (status[k].id === teams[i].projects[j].status) {
                obj.status = status[k].status;
              }
            }
            projects.push(obj);
          }
        }
        // Store server data tmeporarily
        this.projects = projects;
        this.roles = roles;
      } catch (err) {
        console.log("Error in Projects.vue", err);
      }
    },
    async updateProfile() {
      await feathersClient
        .service("users")
        .patch(this.profile.id, this.profile);
      this.editing = false;
    },
    goTo(link, id) {
      router.push(link + id);
    },
    async addFriend() {
      this.addingFriend = true;
      const me = this.user;
      const you = this.profile;
      let data = {},
        userid_1,
        userid_2,
        status;
      if (me.id < you.id) {
        userid_1 = me.id;
        userid_2 = you.id;
        status = "pending_first_second";
      } else {
        userid_1 = you.id;
        userid_2 = me.id;
        status = "pending_second_first";
      }
      data.userid_1 = userid_1;
      data.userid_2 = userid_2;
      const body = `Hello ${you.firstname}, you have a pending friend request from ${me.firstname} ${me.lastname}!`;
      const notification = {
        userid: you.id,
        title: "Notification",
        body: body,
        read: "false",
        type: "request",
        data: data
      };
      const rawFriend = await feathersClient.service("friends").create({
        userid_1: userid_1,
        userid_2: userid_2,
        status: status
      });
      if (rawFriend.id) {
        this.addingFriend = false;
        await this.fetchData();
      }
      await feathersClient.service("notification").create(notification);
    },
    async checkRequest() {
      const rawThisFriend = await feathersClient.service("friends").find({
        query: {
          userid_1: {
            $in: [this.user.id, this.profile.id]
          },
          userid_2: {
            $in: [this.user.id, this.profile.id]
          },
          $select: ["status", "id"]
        }
      });
      if (rawThisFriend.data.length > 0) {
        if (
          rawThisFriend.data[0].status === "pending_first_second" ||
          rawThisFriend.data[0].status === "pending_second_first"
        ) {
          this.requestPending = true;
        }
      }
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>
