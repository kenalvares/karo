<template>
  <v-row>
    <v-col cols="3">
      <v-card class="mx-auto text-center grey darken-4" dark>
        <v-sheet
          class="project-image-offset mx-auto"
          color="cyan"
          elevation="12"
          max-width="calc(100% - 32px)"
        >
          <v-img src="https://picsum.photos/420/300"></v-img>
        </v-sheet>

        <v-card-text class="pt-0">
          <div class="display-1 font-weight-thin">{{ project.name }}</div>
          <div class="subtitle font-weight-light mb-2">{{ project.team }}</div>
          <div class="subheading font-weight-light grey--text">
            Last Sprint Performance
          </div>
          <v-divider class="my-2"></v-divider>
          <v-icon class="mr-2" small>
            mdi-clock
          </v-icon>
          <span class="caption grey--text font-weight-light"
            >completed 17 days ago</span
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="9">
      <v-card outlined flat>
        <v-toolbar flat :height="60">
          <v-icon left>list</v-icon>
          <strong>Product Backlog</strong>
          <v-divider :vertical="true" class="mx-3"></v-divider>
          <span>{{ noOfBacklogItems }}</span>
          <v-spacer />

          <v-switch
            :dense="true"
            :hide-details="true"
            :inset="true"
            v-model="heatmap"
            label="Show Heatmap?"
            color="red"
            light
          />
        </v-toolbar>
        <v-expansion-panels :accordion="true" :flat="true">
          <v-expansion-panel
            v-for="item in project.backlog"
            :key="item.priority"
            :class="itemColor(item.priority)"
          >
            <v-expansion-panel-header class="text-capitalize">
              <v-row>
                <v-col cols="1" class="my-auto py-auto mx-0 px-0" >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ onInc }">
                      <v-btn
                        icon
                        class="ma-0 pa-0"
                        :disabled="item.priority === 1 ? true : false"
                        v-on="onInc"
                        @click="increasePriority(item.priority)"
                      >
                        <v-icon small>arrow_drop_up</v-icon>
                      </v-btn>
                    </template>
                    <span>Increase priority</span>
                  </v-tooltip>
                  <small>{{ item.priority }}</small>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ onDec }">
                      <v-btn
                        icon
                        class="ma-0 pa-0"
                        :disabled="
                          item.priority === project.backlog.length
                            ? true
                            : false
                        "
                        v-on="onDec"
                        @click="decreasePriority(item.priority)"
                      >
                        <v-icon small>arrow_drop_down</v-icon>
                      </v-btn>
                    </template>
                    <span>Decrease priority</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="10" class="my-auto py-auto mx-0 px-1">
                  <span class="header-text">{{ item.title }}</span>
                </v-col>
                <v-col cols="1" class="mx-0 px-0">
                  <v-btn
                    @click="removeItem(item.priority - 1)"
                    icon
                    class="ma-0 pa-0 red--text text--darken-4"
                  >
                    <v-icon small class="mx-0 px-0">close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-4 px-3 description-text"
              >{{ item.description }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.project-image-offset {
  top: -16px;
  position: relative;
  overflow: hidden;
}
</style>

<script>
/*eslint-disable no-unused-vars*/
import store from "@/store/index";
import router from "@/router/index";
export default {
  name: "Project",
  data: () => ({
    project: {
      id: "14",
      name: "Karo",
      team: "Group 5",
      backlog: [
        {
          priority: 1,
          title: "Signups",
          description: "User signup with email ID"
        },
        {
          priority: 2,
          title: "Logins",
          description: "User can login with email ID and password"
        },
        {
          priority: 3,
          title: "Friends",
          description: "User can add friends"
        }
      ]
    },
    heatmap: false
  }),
  methods: {
    itemColor(priority) {
      if (this.heatmap) {
        if (this.project.backlog.length < 4) {
          return "green accent-1";
        } else {
          let str = "";
          if (priority <= this.project.backlog.length * 0.3) {
            str = "green";
          } else if (
            priority > this.project.backlog.length * 0.3 &&
            priority < this.project.backlog.length * 0.8
          ) {
            str = "yellow";
          } else {
            str = "deep-orange";
          }
          str += " accent-1";
          return str;
        }
      } else {
        return "white";
      }
    }
  },
  computed: {
    noOfBacklogItems() {
      if (this.project.backlog === 1) {
        return this.project.backlog.length + " item";
      }
      return this.project.backlog.length + " items";
    }
  }
};
</script>
