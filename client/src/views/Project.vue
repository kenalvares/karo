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
          <div class="font-weight-light">{{ project.vision }}</div>
          <div class="title font-weight-light mb-2">
            {{ project.team }}
          </div>
          <div class="subheading font-weight-light grey--text">
            Status: {{ project.status }}
          </div>
          <v-divider class="my-2"></v-divider>
          <v-icon class="mr-2" small>
            mdi-clock
          </v-icon>
          <span class="caption grey--text font-weight-light"
            >updated {{ sinceUpdate }}</span
          >
        </v-card-text>
      </v-card>
      <v-card class="mx-auto text-center grey"> </v-card>
    </v-col>
    <v-col cols="9">
      <v-card>
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
            class="px-2"
          />
          <v-btn
            :dense="true"
            @click="showBacklog = !showBacklog"
            class="px-2"
            outlined
            :color="showBacklogColor"
            >{{ showBacklogText }}</v-btn
          >
        </v-toolbar>
        <v-expansion-panels v-if="showBacklog" :accordion="true" :flat="true">
          <v-expansion-panel
            v-for="item in project.backlog"
            :key="item.priority"
            :class="itemColor(item.priority)"
          >
            <v-expansion-panel-header :ripple="true" class="text-capitalize">
              <template v-slot:actions>
                <v-icon>keyboard_arrow_down</v-icon>
              </template>
              <section class="backlog-item_row">
                <div class="backlog-item_controls">
                  <v-btn
                    icon
                    class="ma-0 pa-0"
                    :disabled="item.priority === 1 ? true : false"
                    @click="increasePriority(item.priority)"
                  >
                    <v-icon small>arrow_drop_up</v-icon>
                  </v-btn>

                  <small>{{ item.priority }}</small>

                  <v-btn
                    icon
                    class="ma-0 pa-0"
                    :disabled="
                      item.priority === project.backlog.length ? true : false
                    "
                    @click="decreasePriority(item.priority)"
                  >
                    <v-icon small>arrow_drop_down</v-icon>
                  </v-btn>
                </div>
                <div class="backlog-item_title">
                  <span class="header-text">{{ item.title }}</span>
                </div>
                <div class="backlog-item_priority">
                  <v-btn
                    @click="removeItem(item.priority - 1, item.id)"
                    icon
                    class="ma-0 pa-0 red--text text--darken-4"
                  >
                    <v-icon small class="mx-0 px-0">close</v-icon>
                  </v-btn>
                </div>
              </section>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-4 px-3 description-text"
              >{{ item.description }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
      <v-row>
        <v-col cols="4" :max-height="200">
          <v-btn block :height="200" outlined color="grey darken-1">
            <v-text>Create Sprint</v-text>
            <v-icon right>
              add
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          v-for="sprint in sprints"
          :key="sprint.id"
          cols="4"
          :max-height="200"
        >
          <v-card
            :height="200"
            class="text-center flex-column-center blue-grey darken-1"
          >
            <v-card-text class="display-1 grey--text text--lighten-4">{{
              sprint.name
            }}</v-card-text>
            <v-btn
              text
              small
              outlined
              class="blue-grey grey--text text--lighten-2"
              >View</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.flex-column-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.project-image-offset {
  top: -16px;
  position: relative;
  overflow: hidden;
}
.backlog-item_row {
  display: grid;
  grid-template-columns: 5% auto 5%;
  grid-template-rows: 1fr;
  grid-template-areas: "controls title priority";
}
.backlog-item_controls {
  grid-area: controls;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.backlog-item_title {
  grid-area: title;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}
.backlog-item_priority {
  grid-area: priority;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>

<script>
/*eslint-disable no-unused-vars*/
import store from "@/store/index";
import router from "@/router/index";
import feathersClient from "../feathers-client";
/*eslint-disable no-console*/
export default {
  name: "Project",
  data: () => ({
    sprints: [
      { id: 1, name: "Sprint 1" },
      { id: 2, name: "Sprint 2" },
      { id: 3, name: "Sprint 3" },
      { id: 4, name: "Sprint 4" },
      { id: 5, name: "Sprint 5" },
      { id: 6, name: "Sprint 6" },
      { id: 7, name: "Sprint 7" },
      { id: 8, name: "Sprint 8" },
      { id: 9, name: "Sprint 9" }
    ],
    project: {},
    heatmap: false,
    showBacklog: false
  }),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      let project = await this.getProject();
      project.backlog = await this.getBacklog(project);
      this.project = project;
    },
    async getProject() {
      // Get Project Data
      const raw = await feathersClient.service("projects").find({
        query: {
          id: this.$router.history.current.params.id
        }
      });
      // Filter Project Data
      let filtered = { ...raw.data[0] };
      // Sanitize strings
      if (
        filtered.background === null ||
        filtered.background === undefined ||
        filtered.background === ""
      ) {
        filtered.background = "";
      }
      if (
        filtered.finishedAt === null ||
        filtered.finishedAt === undefined ||
        filtered.finishedAt === ""
      ) {
        filtered.finishedAt = "";
      }
      const updatedData = filtered.updatedAt.split(" ");
      filtered.updatedAt = updatedData[0];
      const createdData = filtered.createdAt.split("T");
      filtered.createdAt = createdData[0];
      // Get team name
      const raw2 = await feathersClient.service("teams").find({
        query: {
          id: filtered.teamid,
          $select: ["name"]
        }
      });
      const team = raw2.data[0];
      filtered.team = team.name;
      delete filtered.teamid;
      // Get project status
      let raw3 = await feathersClient.service("project-status").find({
        query: {
          id: filtered.status,
          $select: ["status"]
        }
      });
      const gotStatus = raw3.data[0];
      filtered.status =
        gotStatus.status[0].toUpperCase() + gotStatus.status.slice(1);
      return filtered;
    },
    async getBacklog(project) {
      const raw = await feathersClient.service("backlog-items").find({
        query: {
          projectid: project.id,
          $select: ["id", "priority", "title", "description"]
        }
      });
      return [...raw.data];
    },
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
    },
    async removeItem(i, id) {
      await feathersClient.service("backlog-items").remove(id);
      this.project.backlog.splice(i, 1);
      for (let j = i; j < this.project.backlog.length; j++) {
        this.project.backlog[j].priority = this.project.backlog[j].priority - 1;
        await feathersClient
          .service("backlog-items")
          .patch(this.project.backlog[j].id, {
            priority: this.project.backlog[j].priority
          });
      }
    },
    async increasePriority(i) {
      if (i <= 1) {
        this.project.backlog[i - 1].priority = i;
      } else {
        let temp = {};
        this.project.backlog[i - 1].priority = i - 1;
        this.project.backlog[i - 2].priority = i;
        temp = this.project.backlog[i - 1];
        this.project.backlog[i - 1] = this.project.backlog[i - 2];
        this.project.backlog[i - 2] = temp;
      }
    },
    decreasePriority(i) {
      if (i >= this.project.backlog.length) {
        this.project.backlog[i - 1].priority = i;
      } else {
        let temp = {};
        this.project.backlog[i - 1].priority = i + 1;
        this.project.backlog[i].priority = i;
        temp = this.project.backlog[i - 1];
        this.project.backlog[i - 1] = this.project.backlog[i];
        this.project.backlog[i] = temp;
      }
    }
  },
  computed: {
    noOfBacklogItems() {
      if (this.project.backlog === 1) {
        return this.project.backlog.length + " item";
      }
      return this.project.backlog.length + " items";
    },
    sinceUpdate() {
      let str = "";
      let date = new Date();
      const updatedAt = new Date(this.project.updatedAt);
      const today = new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
      const timeDifference = today.getTime() - updatedAt.getTime();
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      if (dayDifference < 1) {
        str = `today`;
      } else if (dayDifference == 1) {
        str = `${dayDifference} day ago`;
      } else {
        str = `${dayDifference} days ago`;
      }
      return str;
    },
    showBacklogColor() {
      if (this.showBacklog) {
        return "grey";
      }
      return "primary";
    },
    showBacklogText() {
      if (this.showBacklog) {
        return "Hide";
      }
      return "Show";
    }
  }
};
</script>