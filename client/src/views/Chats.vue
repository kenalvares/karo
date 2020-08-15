<template>
  <main class="chat-window">
    <div
      class="chatbox"
      id="app"
      @click="
        showOptions = false;
        userMenu = false;
        colorPalette = false;
      "
      :class="dark ? 'darkMode' : ''"
    >
      <div class="chatbox__container" v-if="friends.length > 0">
        <v-toolbar dense flat class="chatbox__info">
          <v-menu offset-y v-show="showOptions">
            <template v-slot:activator="{ on }">
              <v-avatar
                @click.stop.prevent="userMenu = !userMenu"
                v-on="on"
                size="35"
                style="background-color: rgba(0,0,0,0.3);"
                class="mx-0 mr-1"
              >
                <v-img
                  :src="
                    selectedFriend.profilePicUrl
                      ? selectedFriend.profilePicUrl
                      : placeholderSrc
                  "
                />
              </v-avatar>
            </template>
            <v-list>
              <v-list-item @click="deleteCurrentFriend()">
                Remove from friends
              </v-list-item>
            </v-list>
          </v-menu>
          {{ fullName(friends[selected]) }}
          <v-spacer />

          <v-menu offset-y v-show="showOptions">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
                small
                @click.stop.prevent="
                  showOptions = !showOptions;
                  colorPalette = false;
                "
              >
                <v-icon>more_horiz</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                @click.stop.prevent="
                  colorPalette = true;
                  showOptions = false;
                "
              >
                Change channel color
              </v-list-item>
              <v-expand-transition>
                <v-list-item
                  class="chatbox__colorPalette"
                  v-show="colorPalette"
                >
                  <div
                    class="chatbox__color"
                    v-for="i in 12"
                    :key="i"
                    @click="changeChannelColor"
                  ></div>
                </v-list-item>
              </v-expand-transition>
              <v-list-item
                @click="deleteCurrentChannel()"
                :disabled="selectedFriend.index === 0"
              >
                Delete current channel
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <div class="chatbox__navigation" v-if="friends.length > 0">
          <v-chip
            dense
            class="chatbox__channelSwitchButton"
            v-for="(channel, channelIndex) in selectedFriend.channels"
            :key="channelIndex"
            :class="
              channelIndex === selectedFriend.index
                ? 'chatbox__channelSwitchButton--selected'
                : ''
            "
            :style="{
              backgroundColor:
                channelIndex === selectedFriend.index
                  ? selectedFriend.channels[channelIndex].color
                  : 'initial',
              borderColor: selectedFriend.channels[channelIndex].color,
              color:
                channelIndex !== selectedFriend.index
                  ? selectedFriend.channels[channelIndex].color
                  : 'default'
            }"
            @click="selectedFriend.index = channelIndex"
          >
            {{ channel.name }}
          </v-chip>
          <v-btn
            class="chatbox__channelSwitchButton chatbox__channelNewButton--input my-0 py-0"
            v-if="selectedFriend.makeNewChannel"
          >
            <v-text-field
              class="my-0 py-0"
              type="text"
              v-model="selectedFriend.newChannelName"
              name="newChannelName"
              placeholder="Channel name"
              ref="newChannelName"
              aria-label="New channel input"
              @blur="onChannelInputBlur()"
              @keyup.enter="
                newChannel(
                  selectedFriend.newChannelName,
                  selectedFriend.friendid
                )
              "
              text
            />
          </v-btn>

          <v-btn
            v-if="selectedFriend.makeNewChannel"
            icon
            class="ma-0 pa-0"
            @click="
              newChannel(selectedFriend.newChannelName, selectedFriend.friendid)
            "
          >
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn
            v-if="!selectedFriend.makeNewChannel"
            @click="addButtonClick()"
            icon
          >
            <v-icon>add</v-icon>
          </v-btn>
        </div>
        <v-container fluid class="chatbox__chat" v-if="friends.length > 0">
          <div class="send-message-box">
            <v-text-field
              class="chatbox__messageInput"
              v-model="selectedFriend.msg"
              ref="newMessageInput"
              placeholder="New message..."
              @keyup.enter="newMessage()"
            />
            <v-btn fab color="#09f" @click="newMessage()">
              <v-icon>send</v-icon>
            </v-btn>
          </div>
          <v-container
            fluid
            class="chatbox__messages"
            v-if="selectedChannel != null && selectedChannel != undefined"
          >
            <v-row
              v-for="(message, messageIndex) in selectedChannel.messages"
              :key="messageIndex"
              class="my-0"
            >
              <div
                class="chatbox__date my-0 py-0"
                v-if="messageIndex === 0 || messageIndex &gt; 0 &amp;&amp; selectedChannel.messages[messageIndex - 1].date !== message.date"
              >
                {{ message.date }}
              </div>
              <div
                class="chatbox__messageContainer"
                :class="
                  message.userId === userId
                    ? 'chatbox__messageContainer--right'
                    : ''
                "
                :style="{
                  'margin-top': messageIndex &gt; 0 &amp;&amp; selectedChannel.messages[messageIndex - 1].userId !== message.userId ? '12px':'4px',
                  'margin-bottom': messageIndex &lt; (selectedChannel.messages.length - 1) &amp;&amp; selectedChannel.messages[messageIndex + 1].userId !== message.userId ? '12px':'4px'
						}"
              >
                <div
                  class="chatbox__message"
                  aria-label="message.content"
                  :style="{
								'background-color': message.userId === userId ? selectedChannel.color:'',
								'border-top-right-radius': (messageIndex &gt; 0 &amp;&amp; selectedChannel.messages[messageIndex - 1].userId === userId &amp;&amp; message.userId === userId) ? '5px':'20px',
								'border-bottom-right-radius': (messageIndex &lt; (selectedChannel.messages.length - 1) &amp;&amp; selectedChannel.messages[messageIndex + 1].userId === userId &amp;&amp; message.userId === userId) ? '5px':'20px',
								'border-top-left-radius': (messageIndex &gt; 0 &amp;&amp; selectedChannel.messages[messageIndex - 1].userId === message.userId &amp;&amp; message.userId !== userId) ? '5px':'20px',
								'border-bottom-left-radius': (messageIndex &lt; (selectedChannel.messages.length - 1) &amp;&amp; selectedChannel.messages[messageIndex + 1].userId === message.userId &amp;&amp; message.userId !== userId) ? '5px':'20px'
							}"
                >
                  {{ message.content }}
                  <div
                    class="chatbox__time"
                    :class="
                      message.userId === userId ? 'chatbox__time--left' : ''
                    "
                  >
                    {{ message.time }}
                  </div>
                </div>
              </div>
            </v-row>
          </v-container>
        </v-container>
      </div>
      <v-container v-else fluid class="chatbox__nochats">
        <v-card class="my-auto transparent" outlined>
          <v-card-title>No chats!</v-card-title>
        </v-card>
      </v-container>

      <Contacts
        :friends="friends"
        :selected="selected"
        @selected="contactSelected"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.chat-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.chatbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}
.chatbox__container {
  position: relative;
  width: calc(100% - 175px);
  height: 100%;
}

.chatbox__info {
  width: 100%;
  border-bottom: 1px solid #f2f2f2;

  text-transform: capitalize;
}
.chatbox__info img {
  cursor: pointer;
}
.chatbox__navigation {
  display: flex;
  height: auto;
  align-items: center;
  text-align: left;
  padding: 8px 10px;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
}
.chatbox__channelSwitchButton,
.chatbox__channelNewButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  font-weight: 400;
  white-space: nowrap;
  border-radius: 40px;
  margin: 0 9px 0 0;
  font-size: 11px;
  height: 25px;
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #09f;
  color: #09f;
  cursor: pointer;
}
.chatbox__channelSwitchButton input,
.chatbox__channelNewButton input {
  margin: 0;
  padding: 0 4px;
  border: none;
  height: 100%;
  width: 96px;
  text-align: left;
  font: inherit;
}
.chatbox__channelSwitchButton input::placeholder,
.chatbox__channelNewButton input::placeholder {
  color: #bbb;
}
.chatbox__channelSwitchButton--selected,
.chatbox__channelNewButton--selected {
  background: #09f;
  color: #fff !important;
}
.chatbox__channelSwitchButton--input,
.chatbox__channelNewButton--input {
  padding: 0 8px;
  cursor: default;
  display: flex;
}
.chatbox__channelNewButton {
  border-color: #e4e4e4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 25px;
  width: 25px;
  color: #555;
  font-weight: 100;
  font-size: 22px;
  transition-duration: 0.1s;
}
.chatbox__channelNewButton:hover {
  border-color: #aaa;
}
.chatbox__chat {
  position: relative;
  height: calc(100% - 78px);
}
.chatbox__nochats {
  position: relative;
  height: 100%;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.chatbox__messages {
  margin: 0 auto;
  height: 100%;
  padding: 20px;
  padding-bottom: 75px;
  overflow-y: auto;
}
.send-message-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 450px;
  margin: 0 auto;
  right: 0;
  left: 0;
  bottom: 26px;
  z-index: 2;
}
.chatbox__messageInput {
  display: block;
  font: inherit;
  font-size: 13px;
  text-align: left;
  height: 37px;
  padding: 2px 19px;
  border-radius: 50px;
  border: 1px solid #e4e4e4;
}
.chatbox__messageInput::placeholder {
  color: #bbb;
}
.chatbox__messageContainer {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 6px 0;
  justify-content: flex-start;
}
.chatbox__messageContainer--right {
  justify-content: flex-end;
}
.chatbox__messageContainer--right .chatbox__message {
  color: #fff;
  border: none;
}
.chatbox__message {
  position: relative;
  max-width: 400px;
  padding: 6px 15px;
  text-align: left;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #000;
  word-break: break-word;
  background-color: #fff;
}
.chatbox__message:hover .chatbox__time {
  display: block;
}
.chatbox__time {
  display: none;
  position: absolute;
  color: #ccc;
  right: -38px;
  top: calc(50% - 9px);
}
.chatbox__time--left {
  left: -38px;
  right: auto;
}
.chatbox__date {
  width: 100%;
  height: 20px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.chatbox__date:nth-child(1) {
  margin-top: 0;
}
.chatbox__colorPalette {
  width: 100%;
  max-width: 300px;
  z-index: 2;
  padding: 9px;
  display: grid;
  grid-template: 1fr 1fr 1fr/1fr 1fr 1fr 1fr;
  grid-gap: 5px;
}
.chatbox__color {
  width: 35px;
  height: 35px;
  border-radius: 100%;
  cursor: pointer;
}
.chatbox__color:hover {
  opacity: 0.9;
}
.chatbox__color:nth-child(1) {
  background-color: #ff7ca8;
}
.chatbox__color:nth-child(2) {
  background-color: #247ba0;
}
.chatbox__color:nth-child(3) {
  background-color: #70c1b3;
}
.chatbox__color:nth-child(4) {
  background-color: #b2dbbf;
}
.chatbox__color:nth-child(5) {
  background-color: #ff1654;
}
.chatbox__color:nth-child(6) {
  background-color: #ffba08;
}
.chatbox__color:nth-child(7) {
  background-color: #3f88c5;
}
.chatbox__color:nth-child(8) {
  background-color: #23bf73;
}
.chatbox__color:nth-child(9) {
  background-color: #ff0f80;
}
.chatbox__color:nth-child(10) {
  background-color: #fe4e00;
}
.chatbox__color:nth-child(11) {
  background-color: #f19a3e;
}
.chatbox__color:nth-child(12) {
  background-color: #09f;
}
.darkMode {
  color: #fff;
}
.darkMode footer,
.darkMode .chatbox__info,
.darkMode .chatbox__navigation,
.darkMode .chatbox__channelSwitchButton,
.darkMode .chatbox__channelNewButton,
.darkMode .chatbox__colorPalette {
  color: #fff;
}
.darkMode .chatbox__info,
.darkMode .chatbox__navigation {
  border-color: #444;
}
.darkMode .chatbox__message {
  background: #444;
  color: #fff;
}
.darkMode .chatbox__messageInput {
  background: #444;
  color: #fff;
}
.darkMode .chatbox__channelNewButton img,
.darkMode .chatbox__info img,
.darkMode .chatbox__navigation img {
  filter: invert(100%);
}
@media screen and (max-width: 600px) {
  .chatbox__contacts {
    width: 85px;
  }
  .chatbox__container {
    width: calc(100% - 85px);
  }
}
@media screen and (max-width: 640px) {
  .chatbox__messageInput {
    width: 290px;
  }
}
</style>
<script>
import store from "@/store/index";
import feathersClient from "@/feathers-client";
import Contacts from "@/components/lists/Contacts";
export default {
  /*eslint-disable no-console*/
  name: "chats",
  computed: {
    selectedFriend() {
      if (this.friends != undefined && this.friends != null) {
        return this.friends[this.selected];
      }
      return -1;
    },
    selectedChannel() {
      if (
        this.friends[this.selected] != undefined &&
        this.friends[this.selected] != null
      ) {
        return this.friends[this.selected].channels[
          this.friends[this.selected].index
        ];
      }
      return -1;
    },
    dark() {
      const theme = store.getters.currentTheme;
      if (theme === "dark") {
        return true;
      }
      return false;
    },
    placeholderSrc() {
      return require("@/assets/user-placeholder.jpg");
    }
  },
  components: {
    Contacts
  },
  async created() {
    store.commit("setPageTitle", "Chats");
    await this.fetchData();
  },
  methods: {
    contactSelected(friendIndex) {
      this.selected = friendIndex;
    },
    async fetchData() {
      await store.dispatch("login");
      this.me = store.getters.getUserData;
      this.userId = this.me.id;
      const raw = await feathersClient.service("friends").find({
        query: {
          status: "friends",
          $or: [
            {
              userid_1: this.userId
            },
            {
              userid_2: this.userId
            }
          ]
        }
      });
      let friends = [];
      if (raw.data.length > 0) {
        for (let i = 0; i < raw.data.length; i++) {
          if (raw.data[i].userid_1 === this.userId) {
            let obj = {
              userId: raw.data[i].userid_2,
              friendid: raw.data[i].id
            };
            friends.push(obj);
          } else {
            let obj = {
              userId: raw.data[i].userid_1,
              friendid: raw.data[i].id
            };
            friends.push(obj);
          }
        }
        for (let i = 0; i < friends.length; i++) {
          const rawUser = await feathersClient.service("users").find({
            query: {
              id: friends[i].userId
            }
          });
          if (rawUser.data.length > 0) {
            friends[i].firstname = rawUser.data[0].firstname;
            friends[i].lastname = rawUser.data[0].lastname;
            friends[i].profilePicUrl = rawUser.data[0].avatar;
            friends[i].newChannelName = "";
            friends[i].msg = "";
            friends[i].makeNewChannel = false;
            friends[i].index = 0;
            friends[i].channels = [];
            const raw2 = await feathersClient.service("channels").find({
              query: {
                friendid: friends[i].friendid
              }
            });
            if (raw2.data.length > 0) {
              for (let j = 0; j < raw2.data.length; j++) {
                if (raw2.data[j].messages == null) {
                  raw2.data[j].messages = [];
                } else {
                  console.log("Test", raw2.data[j].messages);
                  raw2.data[j].messages = JSON.parse(raw2.data[j].messages);
                }
              }
              friends[i].channels = [...raw2.data];
            }
            this.friends = friends;
          } else {
            this.friends = [];
          }
        }
      } else {
        this.friends = [];
      }
    },
    addButtonClick() {
      this.selectedFriend.makeNewChannel = true;
      this.$nextTick(() => {
        this.$refs.newChannelName.focus();
      });
    },
    fullName(friend) {
      if (friend != undefined && friend != null) {
        this.nochats = false;
        return `${friend.firstname} ${friend.lastname}`;
      }
      this.nochats = true;
      return "No Chats";
    },
    async newChannel(name, friendid) {
      if (name.length > 0) {
        if (/([^\s])/.test(name)) {
          let channel = {
            name: this.selectedFriend.newChannelName,
            color: "#09f",
            messages: null,
            friendid: friendid
          };
          const raw = await feathersClient.service("channels").create(channel);
          channel.messages = [];
          if (raw) {
            await this.fetchData();
          }
        }
      }
    },
    onChannelInputBlur() {
      if (this.selectedFriend.newChannelName === "") {
        this.selectedFriend.makeNewChannel = false;
      } else {
        this.newChannel(this.selectedFriend.newChannelName);
      }
    },
    async changeChannelColor(event) {
      let newColor = window.getComputedStyle(event.target).backgroundColor;
      const raw = await feathersClient
        .service("channels")
        .patch(this.selectedChannel.id, {
          color: newColor
        });
      if (raw) {
        await this.fetchData();
      }
    },
    async deleteCurrentChannel() {
      let channelIndex = this.friends[this.selected].index;
      // channelIndex is the index of this channel in channels [] of friend
      if (channelIndex > 0) {
        // Can't delete the main channel
        let channel = this.selectedFriend.channels[channelIndex];
        const raw = await feathersClient.service("channels").remove(channel.id);
        if (raw) {
          this.selectedFriend.index = 0;
          this.selectedFriend.channels.splice(channelIndex, 1);
          this.showOptions = false;
        }
      }
    },
    deleteCurrentFriend() {
      this.friends.splice(this.selected, 1);
      if (this.selected > 0) {
        this.selected--;
      }
    },
    async newMessage() {
      if (/([^\s])/.test(this.selectedFriend.msg)) {
        if (this.selectedFriend.msg.length > 0) {
          this.selectedFriend.channels[
            this.friends[this.selected].index
          ].messages.push({
            content: this.selectedFriend.msg,
            userId: this.userId,
            time: this.getTime(),
            date: this.getDate()
          });
          await feathersClient
            .service("channels")
            .patch(
              this.selectedFriend.channels[this.friends[this.selected].index]
                .id,
              {
                messages: JSON.stringify(
                  this.selectedFriend.channels[
                    this.friends[this.selected].index
                  ].messages
                )
              }
            )
            .then(res => {
              if (!res) {
                this.selectedFriend.channels[
                  this.friends[this.selected].index
                ].messages.pop();
              }
            });
          this.selectedFriend.msg = "";
        }
      }
    },
    getDate() {
      let date = new Date();
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate()
      );
    },
    getTime() {
      let date = new Date();
      return (
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes()
      );
    }
  },
  data: () => ({
    me: {},
    userMenu: false,
    showOptions: false,
    userId: "",
    colorPalette: false,
    selected: 0,
    friends: []
    /*
    friends: [
      {
        firstname: "Adam",
        lastname: "Bush",
        profilePicUrl: "https://randomuser.me/api/portraits/men/85.jpg",
        userId: "umYHX3R",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [
          {
            name: "MAIN",
            color: "#09f",
            messages: [
              {
                content: "Hi, how are you?",
                date: "2019-02-13",
                time: "12:34",
                userId: "umYHX3R"
              },
              {
                content: "Welcome to Karo chat with channels!",
                date: "2019-02-13",
                time: "12:35",
                userId: "umYHX3R"
              },
              {
                content: "channels?",
                date: "2019-02-13",
                time: "12:38",
                userId: "43"
              },
              {
                content:
                  "yup! Sometimes when you chat with someone you'd like to talk about different topics simultaneously or save important notes or links somewhere - it's super easy with channels",
                date: "2019-02-13",
                time: "12:39",
                userId: "umYHX3R"
              },
              {
                content: "sounds cool 😎",
                date: "2019-02-13",
                time: "12:40",
                userId: "43"
              },
              {
                content: "could be really useful",
                date: "2019-02-13",
                time: "12:40",
                userId: "43"
              },
              {
                content: "let's try them out",
                date: "2019-02-13",
                time: "12:41",
                userId: "43"
              },
              {
                content: "try to switch channels - click 'project planning' ^",
                date: "2019-02-13",
                time: "12:45",
                userId: "umYHX3R"
              }
            ]
          },
          {
            name: "project planning",
            color: "#ff0f80",
            messages: [
              {
                content:
                  "Why would we spam our main chat, when we can plan our project here?",
                date: "2019-02-09",
                time: "23:34",
                userId: "umYHX3R"
              },
              {
                content: "yeah, the channels are excellent!",
                date: "2019-02-10",
                time: "06:15",
                userId: "43"
              },
              {
                content: "I've found a lovely project idea online!",
                date: "2019-02-10",
                time: "06:15",
                userId: "43"
              },
              {
                content: "link?",
                date: "2019-02-10",
                time: "06:23",
                userId: "umYHX3R"
              }
            ]
          },
          {
            name: "homework",
            color: "rgb(36, 123, 160)",
            messages: [
              {
                content: "what do we have to do for tommorow?",
                date: "2019-02-13",
                time: "17:34",
                userId: "umYHX3R"
              },
              {
                content:
                  "maths - exercises 2.314, 2.316 abc, 2.317 d | physics - read about centripetal force",
                date: "2019-02-13",
                time: "17:55",
                userId: "43"
              },
              {
                content: "thanks!",
                date: "2019-02-13",
                time: "18:23",
                userId: "umYHX3R"
              }
            ]
          }
        ]
      },
      {
        firstname: "Lucy",
        lastname: "Smith",
        userId: "jY0ty9S",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        profilePicUrl: "https://randomuser.me/api/portraits/women/65.jpg",
        channels: [
          {
            name: "MAIN",
            color: "#09f",
            messages: [
              {
                content: "Heey ;)",
                date: "2019-02-06",
                time: "17:19",
                userId: "jY0ty9S"
              }
            ]
          },
          {
            name: "random talks",
            color: "#09f",
            messages: [
              {
                content: "I like dinosaurs",
                date: "2019-02-09",
                time: "23:34",
                userId: "jY0ty9S"
              },
              {
                content: "me too!",
                date: "2019-02-09",
                time: "23:35",
                userId: "43"
              }
            ]
          },
          {
            name: "channel3",
            color: "#09f",
            messages: [
              {
                content: "what are we gonna use this channel for?",
                date: "2019-02-07",
                time: "14:34",
                userId: "jY0ty9S"
              },
              {
                content: "dunno",
                date: "2019-02-07",
                time: "14:35",
                userId: "43"
              },
              {
                content: "hmm let's leave it empty",
                date: "2019-02-07",
                time: "18:56",
                userId: "jY0ty9S"
              }
            ]
          }
        ]
      },
      {
        firstname: "Natasha",
        lastname: "Brown",
        userId: "adf8iOc",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        profilePicUrl: "https://randomuser.me/api/portraits/women/43.jpg",
        index: 0,
        channels: [
          {
            name: "MAIN",
            color: "#09f",
            messages: [
              {
                content:
                  "Lorem Ipsum dolor sit amet oh my god I have no idea what should I write here lol",
                date: "2018-09-12",
                time: "12:45",
                userId: "adf8iOc"
              },
              {
                content: "making placeholder messages is really boring",
                date: "2018-09-13",
                time: "08:23",
                userId: "43"
              }
            ]
          }
        ]
      },
      {
        firstname: "Babür",
        lastname: "Aclan",
        profilePicUrl: "https://randomuser.me/api/portraits/med/men/18.jpg",
        userId: null,
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Vicky",
        lastname: "Brady",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/91.jpg",
        userId: "6981389T",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Enver",
        lastname: "Gottschlich",
        profilePicUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
        userId: null,
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Abbie",
        lastname: "Richardson",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/58.jpg",
        userId: "ES 63 66 39 F",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Debra",
        lastname: "Foster",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/84.jpg",
        userId: "EW 54 98 10 P",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Rena",
        lastname: "Beer",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/12.jpg",
        userId: null,
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Nicklas",
        lastname: "Netland",
        profilePicUrl: "https://randomuser.me/api/portraits/med/men/4.jpg",
        userId: "02105748674",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Alma",
        lastname: "Møller",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/45.jpg",
        userId: "953147-1893",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [{ name: "MAIN", color: "#09f", messages: [] }]
      },
      {
        firstname: "Paige",
        lastname: "Fox",
        profilePicUrl: "https://randomuser.me/api/portraits/med/women/5.jpg",
        userId: "4371535T",
        newChannelName: "",
        msg: "",
        makeNewChannel: false,
        index: 0,
        channels: [
          {
            name: "MAIN",
            color: "#09f",
            messages: []
          }
        ]
      }
    ]
    */
  })
};
</script>
