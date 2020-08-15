<template>
  <!-- Main vuetify app component containing entire view of application -->
  <v-app id="inspire">
    <!-- Left-Hand Side Navigation Menu -->
    <SideMenu />

    <!-- Top App Navigation Bar -->
    <TopMenu @themeSet="setTheme()" />

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application with the proper gutter -->
      <v-container fluid>
        <!-- Contains all views from vue-router -->
        <v-dialog
          v-model="onBreak"
          class="break"
          max-width="420"
          style="width: 90%;"
        >
          <v-card v-if="!counting">
            <v-card-title>
              <v-icon left>
                snooze
              </v-icon>
              <span class="title font-weight-light">Take a Break</span>
            </v-card-title>

            <v-item-group active-class="primary" v-model="time">
              <v-container>
                <v-row>
                  <v-col
                    v-for="option in options"
                    :key="option.duration"
                    cols="6"
                    md="6"
                  >
                    <v-item v-slot:default="{ active, toggle }">
                      <v-card
                        class="d-flex align-center"
                        dark
                        height="200"
                        :style="
                          `background-image:url(https://picsum.photos/seed/${option.duration}/200/300`
                        "
                        @click="toggle"
                        ><div v-if="!active" class="display-3 full text-center">
                          {{ sanitizeDuration(option.duration) }}
                        </div>
                        <div v-if="active" class="display-3 full text-center">
                          <v-icon>check</v-icon>
                        </div>
                      </v-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-container>
            </v-item-group>
            <v-card-actions>
              <v-btn block @click="startBreak()" :disabled="timeSelected">
                Start</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-card
            class="mx-auto timer-card"
            :color="color"
            dark
            v-if="counting"
          >
            <v-row justify="center" align="center" class="py-3">
              <span class="title font-weight-light">{{ breakStatus }}</span>
            </v-row>

            <v-card-text
              align="center"
              justify="center"
              class="display-4 text-center flex-grow-1 font-weight-bold timer-text py-0 my-3"
            >
              {{ timer }}
            </v-card-text>

            <v-card-actions>
              <v-list-item class="grow">
                <v-row align="center" justify="center">
                  <v-btn class="mr-1" icon @click="close()"
                    ><v-icon>clear</v-icon></v-btn
                  >
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <router-view />
      </v-container>
    </v-content>

    <!-- App Footer -->
    <v-footer app id="vFooter">
      <span>&copy; 2020 - Karo</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
.timer-text {
  transition: all 0.9s ease-in-out;
  text-shadow: 2px 8px 6px rgba(0, 0, 0, 0.2),
    0px -5px 35px rgba(255, 255, 255, 0.3) !important;
}
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

.timer-card {
  transition: all 0.9s ease-in-out;
  overflow: hidden;
}

.full {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 10, 0.8);
}
.primary .full {
  background-color: rgb(33, 33, 2000, 0.7);
}
</style>

<script>
/*eslint-disable no-console*/

// @ is an alias to /src
import store from "@/store/index";
import SideMenu from "@/components/nav/SideMenu";
import TopMenu from "@/components/nav/TopMenu";
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    paused: false,
    counting: false,
    time: null,
    breakStatus: "On Break",
    timer: "",
    options: [
      { duration: 30 },
      { duration: 120 },
      { duration: 300 },
      { duration: 1800 }
    ],
    colors: [
      { id: "#FF1744" },
      { id: "#F50057" },
      { id: "#D500F9" },
      { id: "#651FFF" },
      { id: "#3D5AFE" },
      { id: "#2979FF" },
      { id: "#00B0FF" },
      { id: "#00E5FF" },
      { id: "#1DE9B6" },
      { id: "#00E676" },
      { id: "#76FF03" },
      { id: "#C6FF00" },
      { id: "#FFEA00" },
      { id: "#FFC400" },
      { id: "#FF9100" },
      { id: "#FF3D00" }
    ],
    count: 0,
    alarm: {
      soundurl: "http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3"
    }
  }),
  computed: {
    onBreak: {
      // getter
      get: function() {
        return store.getters.onBreak;
      },
      // setter
      set: function() {
        this.close();
      }
    },
    color() {
      const color = this.colors[this.count].id;
      return color;
    },
    timeSelected() {
      if (this.time === null || this.time === undefined || this.time === "") {
        return true;
      }
      return false;
    }
  },
  components: {
    SideMenu,
    TopMenu
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    close() {
      this.time = null;
      this.timer = "";
      this.counting = false;
      this.breakStatus = "On Break";
      store.commit("changeBreak");
    },
    startBreak() {
      if (this.time != null || this.time != undefined || this.time != "") {
        this.time = this.options[this.time].duration;
        this.counting = true;
        setInterval(this.tick, 1000);
      }
    },
    sanitizeDuration(duration) {
      if (duration >= 0 && duration < 60) {
        return `${duration}s`;
      } else if (duration >= 60 && duration < 1800) {
        return `${duration / 60}m`;
      } else if (duration >= 1800) {
        return `${duration / 3600}h`;
      }
      return duration;
    },
    timeDurationToString(duration) {
      return duration > 9 ? duration : "0" + duration;
    },

    tick() {
      if (this.counting && !this.paused) {
        this.time -= 1;
        if (this.count >= 0 && this.count < this.colors.length - 1) {
          this.count++;
        } else if (this.count === this.colors.length - 1) {
          this.count = 0;
        }
        const minutesLeft = Math.floor(this.time / 60);
        const secondsLeft = this.time % 60;
        this.timer = `${this.timeDurationToString(
          minutesLeft
        )}:${this.timeDurationToString(secondsLeft)}`;
        if (this.time === 0) {
          this.playSound();
          this.paused = true;
          this.breakStatus = "Break Over";
        }
      }
    },
    playSound() {
      var audio = new Audio(this.alarm.soundurl);
      audio.play();
      setTimeout(function() {
        audio.pause();
      }, 4000);
    }
  }
};
</script>
