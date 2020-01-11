<template>
  <v-container fluid>
    <v-row v-if="pendingData" class="full-height">
      <v-col cols="12" align="center" class="flex-column">
        <v-progress-circular
          :size="100"
          :width="5"
          color="primary"
          indeterminate
          class="mb-5"
          v-if="!failed"
        ></v-progress-circular
        ><v-progress-circular
          :size="100"
          :width="5"
          color="grey"
          class="mb-5"
          v-if="failed"
        >
          <v-icon color="grey">close</v-icon></v-progress-circular
        >
        <span>{{ pendingMsg }}</span>
      </v-col>
    </v-row>
    <v-row v-if="!pendingData" align="start" class="fill-height">
      <v-col cols="4">
        <v-card max-width="370" tile>
          <v-flex class="teal darken-2">
            <v-row align="end" class="fill-height">
              <v-col align-self="start" cols="12" class="flex-row">
                <v-avatar color="grey" size="164" tile>
                  <v-img :src="avatarSrc"></v-img>
                </v-avatar>
                <v-spacer />
                <v-flex class="flex-row-reverse" v-if="me">
                  <v-btn
                    outlined
                    class="teal darken-1 mx-2 teal--text text--darken-4"
                    @click="editing = !editing"
                    v-if="!editing"
                  >
                    Edit
                    <v-icon small right>create</v-icon>
                  </v-btn>
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
                      <span v-if="!editing">{{ profile.tagline }}</span>
                      <v-text-field
                        v-if="editing"
                        placeholder="Tagline"
                        v-model="profile.tagline"
                      ></v-text-field>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="friends-info" v-if="friends">
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
          <v-flex v-if="!me && !friends" class="grey darken-4">
            <v-col class="flex-row">
              <v-btn @click="addFriend()" class="secondary mr-3">
                Friend
                <v-icon right>add</v-icon>
              </v-btn>
              <v-btn @click="message()" class="primary">
                Message
                <v-icon right>message</v-icon>
              </v-btn>
            </v-col>
          </v-flex>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>About</v-expansion-panel-header>
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
          <v-expansion-panels v-if="!editing">
            <v-expansion-panel>
              <v-expansion-panel-header>Friends</v-expansion-panel-header>
              <v-expansion-panel-content v-if="friendsLoaded">
                <div
                  v-for="friend in friendList"
                  :key="friend.friendid"
                  class="flex-row-center"
                >
                  <v-avatar v-if="friend.avatar" size="30" class="mr-2">
                    <v-img :src="friend.avatar" />
                  </v-avatar>
                  <span v-if="hasFriends">{{ friend.fullname }}</span>
                  <v-spacer />
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
                <div v-if="!hasFriends">
                  <em>No friends!</em>
                </div>
              </v-expansion-panel-content>
              <v-expansion-panel-content v-if="!friendsLoaded">
                <v-row class="full-height">
                  <v-col cols="12" align="center" class="flex-column">
                    <v-progress-circular
                      :size="100"
                      :width="5"
                      color="primary"
                      indeterminate
                      class="mb-5"
                      v-if="!failed"
                    ></v-progress-circular
                    ><v-progress-circular
                      :size="100"
                      :width="5"
                      color="grey"
                      class="mb-5"
                      v-if="failed"
                    >
                      <v-icon color="grey">close</v-icon></v-progress-circular
                    >
                    <span>{{ pendingMsg }}</span>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
      <v-col cols="8">
        Projects
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
import feathersClient from "../feathers-client";

export default {
  name: "profile",
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
    pendingData: true,
    friendsLoaded: false,
    pendingMsg: "Getting user profile...",
    failed: false,
    hasFriends: false,
    friendList: null
  }),
  computed: {
    avatarSrc() {
      return store.getters.avatarSrc;
    },
    fullName() {
      return this.profile.firstname + " " + this.profile.lastname;
    }
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    async fetchData() {
      this.pendingData = true;
      this.pendingMsg = "Getting user profile...";
      this.failed = false;
      this.friendsLoaded = false;
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
      this.pendingMsg = `${this.profile.firstname}'s profile is loading...`;
      const raw2 = await feathersClient.service("friends").find({
        query: {
          status: "friends",
          $or: [{ userid_1: this.profile.id }, { userid_2: this.profile.id }]
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
      this.pendingData = false;
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
      const me = this.user;
      const you = this.profile;
      let userid_1, userid_2, status;
      if (me.id < you.id) {
        userid_1 = me.id;
        userid_2 = you.id;
        status = "pending_first_second";
      } else {
        userid_1 = you.id;
        userid_2 = me.id;
        status = "pending_second_first";
      }
      const body = `Hello ${you.firstname}, you have a pending friend request from ${me.firstname} ${me.lastname}!`;
      const notification = {
        userid: you.id,
        title: "Notification",
        body: body,
        read: "false"
      };
      await feathersClient.service("friends").create({
        userid_1: userid_1,
        userid_2: userid_2,
        status: status
      });
      await feathersClient.service("notification").create(notification);
    }
  }
};
</script>
