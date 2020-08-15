<template>
  <v-menu
    v-model="show"
    :disabled="false"
    :absolute="false"
    :open-on-hover="false"
    :close-on-click="true"
    :close-on-content-click="false"
    :offset-x="false"
    :offset-y="true"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>notifications</v-icon>
        <p class="badge">{{ notificationCount }}</p>
      </v-btn>
    </template>
    <v-card class="card" max-width="600">
      <v-toolbar>
        <v-icon left>
          notifications
        </v-icon>
        Notifications
        <v-spacer />
        <v-btn icon @click="show = !show">
          <v-icon>clear</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="nothing" v-if="nothing">
        <em>Nothing to see...</em>
      </div>
      <div class="card--content" v-if="!nothing">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          :three-line="notification.type === 'request' ? true : false"
        >
          <v-hover v-slot:default="{ hover }">
            <div class="notification-row">
              <v-list-item-content
                class="notification"
                v-if="notification.type === 'normal'"
              >
                <v-list-item-title>{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  notification.body
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content
                class="notification notification--request"
                v-if="notification.type === 'request'"
              >
                <v-list-item-title>{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  notification.body
                }}</v-list-item-subtitle>
                <v-list-item-action class="mb-0 mt-1 ml-0 pl-0">
                  <v-btn
                    text
                    color="primary"
                    @click="addFriend(notification.id, notification.data)"
                  >
                    Accept Request
                  </v-btn>
                </v-list-item-action>
              </v-list-item-content>
              <v-btn
                v-if="hover"
                icon
                x-small
                color="red"
                @click="markRead(notification.id)"
                class="btn--remove"
              >
                <v-icon>remove_circle</v-icon>
              </v-btn>
            </div>
          </v-hover>
        </v-list-item>
      </div>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.badge {
  position: absolute;
  display: block;
  border-radius: 500px;
  font-size: 0.8rem;
  padding: 5% 10%;
  background-color: green;
  top: -50%;
  right: 0;
}

.card {
  width: 100vw;
  height: 80vh;
  max-width: 270px;
  max-height: 640px;
}

.notification-row {
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
}

.btn--remove {
  align-self: center;
  justify-self: flex-end;
  width: 1rem;
}

.nothing {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}
.card--content {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>

<script>
import feathersClient from "@/feathers-client";
import store from "@/store";
/*eslint-disable no-console*/
export default {
  name: "NotificationDrawer",
  data: () => ({
    show: false,
    notifications: null,
    nothing: false
  }),
  computed: {
    notificationCount() {
      if (
        this.notifications === "" ||
        this.notifications === null ||
        this.notifications === undefined
      ) {
        return 0;
      } else {
        return this.notifications.length;
      }
    }
  },
  async created() {
    this.me = store.getters.getUserData;
    this.notifications = await this.getNotifications();
  },
  methods: {
    async getNotifications() {
      const raw = await feathersClient.service("notification").find({
        query: {
          userid: this.me.id,
          read: false,
          $sort: {
            createdAt: -1
          },
          $select: [
            "id",
            "title",
            "body",
            "read",
            "type",
            "data",
            "createdAt",
            "updatedAt"
          ]
        }
      });
      let data = [];
      if (raw.data.length > 0) {
        data = [...raw.data];
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].type === "" ||
            data[i].type === null ||
            data[i].type === undefined
          ) {
            data[i].type = "normal";
          }
        }
        return data;
      } else {
        this.nothing = false;
        return data;
      }
    },
    async addFriend(i, data) {
      const raw = await feathersClient.service("friends").find({
        query: {
          ...data,
          $select: ["id"]
        }
      });
      await feathersClient.service("friends").patch(raw.data[0].id, {
        status: "friends"
      });
      await feathersClient.service("channels").create({
        name: "Main",
        color: "#09f",
        messages: null,
        friendid: raw.data[0].id
      });
      await this.markRead(i);
    },
    async markRead(id) {
      await feathersClient.service("notification").patch(id, {
        read: true
      });
      this.notifications = await this.getNotifications();
    }
  }
};
</script>
