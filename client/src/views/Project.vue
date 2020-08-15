<template>
  <v-container>
    <!--
      This row contains the loader.
      It is only rendered while client is awaiting data from server
      -->
    <LoadingData :loader="mainLoader" />
    <v-dialog v-model="addingBacklogItem">
      <v-card>
        <v-toolbar>
          <v-icon left>add</v-icon>

          <h2>
            Add Backlog Item to <em>{{ project.name }}</em>
          </h2>
          <v-spacer />
          <v-btn icon class="my-6" @click="showAddBacklogItem()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar dense flat class="red darken-4" v-if="errors">
          <v-icon left>warning</v-icon>
          {{ errors }}
        </v-toolbar>
        <div style="max-width:300px" class="mx-auto">
          <LoadingData :loader="backlogItemLoader" />
        </div>
        <v-row class="pa-0 ma-0 mt-4" v-if="!backlogItemLoader.pendingData">
          <v-spacer />
          <v-col cols="8">
            <v-text-field
              ref="backlogitem"
              v-model="backlogItemTitle"
              placeholder="User-Story/Feature Headline"
              :outlined="true"
              class="my-0"
              @keydown.enter.prevent
            ></v-text-field>
            <v-textarea
              placeholder="User-Story/Feature Description"
              v-model="backlogItemBody"
              :outlined="true"
              class="my-0"
              @keydown.enter.prevent
            ></v-textarea>
          </v-col>
          <v-col cols="2">
            <v-btn icon outlined large @click="addBacklogItem()">
              <v-icon>add</v-icon></v-btn
            >
          </v-col>
          <v-spacer />
        </v-row>
      </v-card>
    </v-dialog>
    <v-row v-if="!mainLoader.pendingData">
      <v-col cols="12" md="3" xl="4">
        <v-card class="mx-auto text-center grey darken-4" dark>
          <v-sheet
            v-if="project.background"
            class="project-image-offset mx-auto"
            elevation="12"
            max-width="344"
          >
            <v-img src="project.background"></v-img>
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
            <!-- <v-btn
              block
              text
              outlined
              class="mt-2 mx-auto"
            >
              Edit
              <v-icon>create</v-icon>
            </v-btn> -->
          </v-card-text>
        </v-card>
        <v-card class="mx-auto text-center grey"> </v-card>
      </v-col>
      <v-col cols="12" md="9" xl="8">
        <v-card>
          <v-toolbar flat :height="60" class="backlog-toolbar">
            <v-icon left>list</v-icon>
            <strong>Product Backlog</strong>
            <v-divider :vertical="true" class="mx-3"></v-divider>
            {{
              `${this.project.backlog.length} ${
                this.project.backlog.length === 1 ? "item" : "items"
              }`
            }}
            <v-spacer />
            <v-btn
              :dense="true"
              @click="showBacklog = !showBacklog"
              class="px-2 mx-3"
              outlined
              >{{ showBacklogText }}</v-btn
            >
          </v-toolbar>
          <v-card-text v-if="showBacklog" class="py-0">
            <v-row class="py-0 my-0">
              <v-col cols="6" class="py-0">
                <v-switch
                  v-if="showBacklog"
                  :dense="true"
                  :hide-details="true"
                  :inset="true"
                  :label="`${heatmap ? 'Hide' : 'Show'} Heatmap?`"
                  v-model="heatmap"
                  class="py-2 my-0"
                  color="red"
                ></v-switch>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-btn
                  icon
                  absolute
                  right
                  class="py-0 my-0"
                  @click="showAddBacklogItem()"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <LoadingData :loader="backlogLoader" />
          <div v-if="!backlogLoader.pendingData">
            <v-expansion-panels v-if="showBacklog" accordion flat>
              <v-expansion-panel
                v-for="item in project.backlog"
                :key="item.priority"
                :class="itemColor(item.priority)"
              >
                <v-expansion-panel-header
                  :ripple="true"
                  class="text-capitalize"
                >
                  <v-row>
                    <v-col
                      cols="1"
                      class="ma-0 pa-0 flex-column-center"
                      :width="0"
                    >
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
                          item.priority === project.backlog.length
                            ? true
                            : false
                        "
                        @click="decreasePriority(item.priority)"
                      >
                        <v-icon small>arrow_drop_down</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="10" class="my-auto py-auto mx-0 px-1">
                      <span class="header-text">{{ item.title }}</span>
                    </v-col>
                    <v-col
                      cols="1"
                      class="my-auto py-auto mx-0 px-0"
                      :width="0"
                    >
                      <v-btn
                        @click="removeItem(item.priority - 1, item.id)"
                        icon
                        class="ma-0 pa-0 red--text"
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
          </div>
        </v-card>

        <!--
      This row contains the loader.
      It is only rendered while client is awaiting data from server
      -->
        <LoadingData :loader="sprintLoader" />
        <v-row v-if="!sprintLoader.pendingData">
          <v-col cols="12" md="4" xl="3" :max-height="200">
            <v-btn block :height="200" outlined @click="checkOngoingSprints()">
              Start Sprint #{{ nextSprint }}
              <v-icon right>
                add
              </v-icon>
            </v-btn>
            <ConfirmDialog
              :showProp="confirmDialog"
              :heading="heading"
              :body="body"
              @passBack="close()"
            />
            <CreateSprint
              :project="project"
              :showDialog="createSprint"
              :number="nextSprint"
              :status="status"
              @created="closeSprint(true)"
              @close="closeSprint(false)"
            />
          </v-col>
          <v-col
            v-for="sprint in sprints"
            :key="sprint.id"
            cols="12"
            md="4"
            xl="3"
            :max-height="200"
          >
            <v-card :height="200" class="text-center flex-column-center">
              <v-card-text
                class="subheading ma-0 pa-0 text-center letter-spaced"
              >
                {{ sprint.status.toUpperCase() }}
              </v-card-text>
              <v-card-text class="display-1"
                >Sprint #{{ sprint.number }}</v-card-text
              >
              <v-btn depressed small :to="`/sprint/${sprint.id}`">View</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
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
.letter-spaced {
  letter-spacing: 0.2rem;
  opacity: 0.8;
}
@media only screen and(max-width: 600px) {
  .backlog-toolbar {
    font-size: 12px !important;
  }
}
</style>

<script>
/*eslint-disable no-unused-vars*/
import LoadingData from "@/components/loaders/LoadingData";
import store from "@/store/index";
import router from "@/router/index";
import feathersClient from "@/feathers-client";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import CreateSprint from "@/components/dialogs/CreateSprint";
import EditProject from "@/components/dialogs/EditProject";
/*eslint-disable no-console*/
export default {
  name: "Project",
  components: {
    ConfirmDialog,
    CreateSprint,
    LoadingData
  },
  data: () => ({
    sprints: [],
    project: {
      backlog: []
    },
    user: {},
    roles: [],
    errors: null,
    status: [],
    heading: "Not Recommended",
    body: "You should complete any ongoing sprints before starting a new one",
    heatmap: false,
    showBacklog: false,
    confirmDialog: false,
    createSprint: false,
    mainLoader: {
      pendingData: true,
      pendingMsg: "Getting project data...",
      failed: false
    }, // Loader object
    sprintLoader: {
      pendingData: true,
      pendingMsg: "Sprints loading...",
      failed: false
    }, // Loader object
    backlogLoader: {
      pendingData: true,
      pendingMsg: "Loading backlog...",
      failed: false
    }, // Loader object
    backlogItemLoader: {
      pendingData: false,
      pendingMsg: "Adding item...",
      failed: false
    }, // Loader object
    addingBacklogItem: false,
    backlogItemTitle: "",
    backlogItemBody: ""
  }),
  async created() {
    store.commit("setPageTitle", "Karo");

    await this.fetchData();
  },
  methods: {
    showAddBacklogItem() {
      this.addingBacklogItem = !this.addingBacklogItem;
    },
    async addBacklogItem() {
      if (this.backlogItemTitle.length <= 0) {
        this.errors = "Backlog item needs a title";
      } else if (this.backlogItemBody.length <= 0) {
        this.errors = "Backlog item needs a description";
      } else {
        this.backlogItemLoader.pendingData = true;
        let item = {};
        item.projectid = this.project.id;
        item.priority = this.project.backlog.length + 1;
        item.title = this.backlogItemTitle;
        item.description = this.backlogItemBody;
        await feathersClient.service("backlog-items").create(item);
        this.project.backlog = await this.getBacklog(this.project);
        this.backlogItemLoader.pendingData = false;
        this.backlogItemTitle = "";
        this.backlogItemBody = "";
        this.showAddBacklogItem();
      }
    },
    checkOngoingSprints() {
      if (
        this.sprints === [] ||
        this.sprints === {} ||
        this.sprints === undefined ||
        this.sprints === null ||
        this.sprints === ""
      ) {
        this.startSprint();
        return;
      } else if (this.sprints.length >= 1) {
        if (this.sprints[0].status === "ongoing") {
          this.confirmDialog = !this.confirmDialog;
          return;
        }
      }
      this.startSprint();
    },
    async closeSprint(created) {
      if (created) {
        this.createSprint = false;
        this.sprintLoader.pendingData = true;
        this.sprintLoader.pendingMsg = "Refreshing sprints...";
        const sprints = await this.getSprints(this.project);
        this.sprints = sprints;
        this.sprintLoader.pendingData = false;
        this.sprintLoader.pendingMsg = "Sprints loading...";
      } else {
        this.createSprint = false;
      }
    },
    startSprint() {
      this.createSprint = !this.createSprint;
    },
    async getSprints(project) {
      const raw = await feathersClient.service("sprints").find({
        query: {
          projectid: project.id
        }
      });
      let completed, ongoing;
      for (let j = 0; j < this.status.length; j++) {
        if (this.status[j].status === "completed") {
          completed = this.status[j].id;
        } else if (this.status[j].status === "ongoing") {
          ongoing = this.status[j].id;
        }
      }
      const sprints = [...raw.data];
      for (let i = 0; i < sprints.length; i++) {
        let today = new Date();
        today.date = today.getDate();
        today.month = today.getMonth();
        today.year = today.getFullYear();
        let end = new Date(sprints[i].endDate);
        end.date = end.getDate();
        end.month = end.getMonth();
        end.year = end.getFullYear();
        if (today.year === end.year) {
          if (today.month === end.month) {
            if (today.date === end.date) {
              if (sprints[i].status === ongoing) {
                sprints[i].status = completed;
                await feathersClient.service("sprints").patch(sprints[i].id, {
                  status: sprints[i].status
                });
              }
            } else if (today.date > end.date) {
              if (sprints[i].status === ongoing) {
                sprints[i].status = completed;
                await feathersClient.service("sprints").patch(sprints[i].id, {
                  status: sprints[i].status
                });
              }
            }
          } else if (today.month > end.month) {
            if (sprints[i].status === ongoing) {
              sprints[i].status = completed;
              await feathersClient.service("sprints").patch(sprints[i].id, {
                status: sprints[i].status
              });
            }
          }
        } else if (today.year > end.year) {
          if (sprints[i].status === ongoing) {
            sprints[i].status = completed;
            await feathersClient.service("sprints").patch(sprints[i].id, {
              status: sprints[i].status
            });
          }
        }
      }
      if (
        sprints === [] ||
        sprints === {} ||
        sprints === undefined ||
        sprints === null ||
        sprints === ""
      ) {
        return [];
      } else {
        for (let i = 0; i < sprints.length; i++) {
          for (let j = 0; j < this.status.length; j++) {
            if (sprints[i].status === this.status[j].id) {
              sprints[i].status = this.status[j].status;
            }
          }
        }
      }
      return sprints;
    },
    async fetchData() {
      this.status = await this.getStatus();
      this.project = await this.getProject();
      this.mainLoader.pendingMsg = `Finding ${this.project.name}...`;
      this.project.backlog = await this.getBacklog(this.project);
      this.mainLoader.pendingData = false;
      this.mainLoader.pendingMsg = "Getting project data...";
      this.backlogLoader.pendingData = false;
      this.backlogLoader.pendingMsg = "Loading backlog...";
      this.sprints = await this.getSprints(this.project);
      this.sprintLoader.pendingData = false;
      this.sprintLoader.pendingMsg = "Sprints loading...";
    },
    async getStatus() {
      const raw = await feathersClient.service("project-status").find();
      let status = [...raw.data];
      for (let i = 0; i < status.length; i++) {
        delete status[i].createdAt;
        delete status[i].updatedAt;
      }
      return status;
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
          $select: ["id", "priority", "title", "description"],
          $sort: {
            priority: 1
          }
        }
      });
      this.showBacklog = !this.showBacklog;
      this.showBacklog = !this.showBacklog;
      return [...raw.data];
    },
    itemColor(priority) {
      if (this.heatmap) {
        if (this.project.backlog.length < 4) {
          return "green";
        } else {
          let str = "";
          if (priority <= this.project.backlog.length * 0.3) {
            str = "green";
          } else if (
            priority > this.project.backlog.length * 0.3 &&
            priority < this.project.backlog.length * 0.8
          ) {
            str = "yellow darken-3";
          } else {
            str = "red darken-3";
          }
          return str;
        }
      } else {
        return "";
      }
    },
    async removeItem(i, id) {
      await feathersClient.service("backlog-items").remove(id);
      this.project.backlog.splice(i, 1);
      for (let j = i; j < this.project.backlog.length; j++) {
        console.log(this.project.backlog[j]);
        this.project.backlog[j].priority = this.project.backlog[j].priority - 1;
        await feathersClient
          .service("backlog-items")
          .patch(this.project.backlog[j].id, {
            priority: this.project.backlog[j].priority
          });
      }
      this.project.backlog = await this.getBacklog(this.project);
      console.log(this.project.backlog);
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
    },
    close() {
      this.confirmDialog = false;
    }
  },
  computed: {
    nextSprint() {
      if (
        this.sprints === [] ||
        this.sprints === {} ||
        this.sprints === undefined ||
        this.sprints === null ||
        this.sprints === ""
      ) {
        return 1;
      } else {
        return this.sprints.length + 1;
      }
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
        str = "today";
      } else if (dayDifference == 1) {
        str = `${dayDifference} day ago`;
      } else {
        str = `${dayDifference} days ago`;
      }
      return str;
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
