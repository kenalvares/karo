<template>
  <v-dialog v-model="show">
    <v-toolbar>
      <v-icon left>create</v-icon>

      <h2>Create Project</h2>
      <v-spacer />
      <v-btn outlined dark class="my-6" @click="show = !show">
        Close
        <v-icon right>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-stepper v-model="step" vertical>
        <v-stepper-items
          class="red darken-4 grey--text text--lighten-4 pa-3"
          v-if="errors"
        >
          <v-icon left class="grey--text text--lighten-4">warning</v-icon>
          {{ errors }}
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-step :complete="step > 1" step="1"
            >Name Your Project</v-stepper-step
          >

          <v-stepper-content step="1">
            <v-text-field
              ref="projectname"
              v-model="project.name"
              placeholder="My Awesome Project!"
              required
              counter
              :rules="projectnameMaxChars"
              @keydown.enter="stepTo(2)"
            >
            </v-text-field>

            <v-btn class="mx-2" color="primary" @click="stepTo(2)">
              Continue
            </v-btn>

            <v-btn outlined class="mx-2" @click="close()">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2"
            >Define Your Vision</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-textarea
              placeholder="This project aims to..."
              hint="A short, overall vision for your project"
              v-model="project.vision"
              auto-grow
              counter
              :rules="visionMaxChars"
              @keydown.enter="stepTo(3)"
            ></v-textarea>

            <v-btn class="mx-2" color="primary" @click="stepTo(3)">
              Continue
            </v-btn>

            <v-btn outlined class="mx-2" @click="close()">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3" :complete="step > 3"
            >Create the Product Backlog</v-stepper-step
          >
          <v-stepper-content step="3">
            <v-row>
              <v-col cols="11">
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
              <v-col cols="1">
                <v-btn icon outlined large @click="addBacklogItem()">
                  <v-icon>add</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
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
                      color="red"
                      light
                    />
                    <p class="fill-height my-0 mx-0 pa-0 flex-column-center">
                      {{ heatmap ? "Hide" : "Show" }} Heatmap?
                    </p>
                  </v-toolbar>
                  <v-expansion-panels dark accordion flat>
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
                            class="my-auto py-auto mx-0 px-0"
                            :width="0"
                          >
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
                          <v-col cols="1" class="mx-0 px-0" :width="0">
                            <v-btn
                              @click="removeItem(item.priority - 1)"
                              icon
                              class="ma-0 pa-0 red--text"
                            >
                              <v-icon small class="mx-0 px-0">close</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content
                        class="pt-4 px-3 description-text"
                        >{{ item.description }}
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-col>
            </v-row>

            <v-dialog v-model="confirmDialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn class="mx-2" color="primary" v-on="on">
                  Create
                </v-btn>
              </template>

              <v-card>
                <v-card-title
                  v-if="!creatingProject.pending"
                  class="headline grey darken-1"
                  primary-title
                >
                  One Last Check
                </v-card-title>

                <v-card-title
                  v-if="creatingProject.pending"
                  class="headline grey darken-1"
                  primary-title
                >
                  One Second
                </v-card-title>

                <v-card-text v-if="!creatingProject.pending" class="pa-2 px-3">
                  {{ firstName }}, are you ready to start this project?
                </v-card-text>

                <v-card-text
                  v-if="creatingProject.pending"
                  class="fill-height flex-column-center"
                >
                  <v-progress-circular
                    :size="100"
                    :width="5"
                    color="primary"
                    indeterminate
                    class="mb-5"
                  >
                    <v-icon color="grey">close</v-icon>
                  </v-progress-circular>
                  <span>{{ creatingProject.pendingMsg }}</span>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="primary" class="mx-2" @click="createProject()">
                    Start Project
                  </v-btn>
                  <v-btn
                    outlined
                    class="mx-2"
                    @click="
                      stepTo(1);
                      confirmDialog = !confirmDialog;
                    "
                  >
                    Check Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn outlined class="mx-2" @click="close()">Cancel</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.flex-column-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.header-text {
  font-weight: 600;
}
.description-text {
  font-size: 0.9rem !important;
}
</style>

<script>
/*eslint-disable no-console*/
import feathersClient from "@/feathers-client";
export default {
  name: "CreateProject",
  props: {
    team: Object,
    /*
        id: String,
        profilePicUrl: String,
        name: String,
        description: String,
        createdAt: String,
        updatedAt: String
      */
    user: Object,
    /*
        id: String,
        avatar: String,
        firstname: String,
        lastname: String,
        email: String,
        tagline: String
      */
    status: Array,
    showDialog: Boolean
  },
  data: () => ({
    step: 1,
    confirmDialog: false,
    heatmap: false,
    creatingProject: {
      pending: false,
      pendingMsg: "Creating Project..."
    },
    project: {
      name: "",
      vision: "",
      backlog: []
    },
    errors: null,
    visionMaxChars: [v => v.length <= 300 || "Max 300 characters"],
    projectnameMaxChars: [v => v.length <= 60 || "Max 60 characters"],
    backlogItemTitle: "",
    backlogItemBody: ""
  }),
  computed: {
    show: {
      // getter
      get: function() {
        return this.showDialog;
      },
      // setter
      set: function() {
        this.$emit("closeProjectCreation");
      }
    },
    firstName() {
      let str = "";
      if (
        this.user.firstname === {} ||
        this.user.firstname === null ||
        this.user.firstname === undefined
      ) {
        str = "Hey";
      } else {
        str =
          this.user.firstname.charAt(0).toUpperCase() +
          this.user.firstname.slice(1);
      }
      return str;
    },
    noOfBacklogItems() {
      if (this.project.backlog === 1) {
        return this.project.backlog.length + " item";
      }
      return this.project.backlog.length + " items";
    }
  },
  methods: {
    removeItem(i) {
      this.project.backlog.splice(i, 1);
      for (let j = i; j < this.project.backlog.length; j++) {
        this.project.backlog[j].priority = this.project.backlog[j].priority - 1;
      }
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
            str = "yellow darken-2";
          } else {
            str = "red";
          }
          return str;
        }
      } else {
        return "grey darken-4";
      }
    },
    addBacklogItem() {
      let item = {};
      item.priority = this.project.backlog.length + 1;
      item.title = this.backlogItemTitle;
      item.description = this.backlogItemBody;
      this.project.backlog.push(item);
      this.backlogItemTitle = "";
      this.backlogItemBody = "";
    },
    increasePriority(i) {
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
    stepTo(n) {
      let nextStep = true;
      if (n === 2) {
        if (!this.project.name || !this.project.name.trim()) {
          this.errors = "Please name your project to continue";
          nextStep = false;
        } else if (this.project.name.length > 60) {
          this.errors = "Project name less than 60 characters";
          nextStep = false;
        }
      } else if (n === 3) {
        if (!this.project.vision || !this.project.vision.trim()) {
          this.errors = "Please define your project vision";
          nextStep = false;
        } else if (this.project.vision.length > 300) {
          this.errors = "Project vision less than 300 characters";
          nextStep = false;
        }
      } else if (n === 4) {
        if (this.project.backlog.length < 1) {
          this.errors =
            "Please add some user-stories or features to the product backlog. This can be edited later";
          nextStep = false;
        } else {
          n = 3;
        }
      }

      if (nextStep) {
        this.errors = null;
        this.step = n;
      }
    },
    close() {
      this.step = 1;
      this.project.name = "";
      this.project.vision = "";
      this.project.backlog = [];
      this.$emit("closeProjectCreation");
    },
    closeConfirmDialog() {
      this.confirmDialog = !this.confirmDialog;
    },
    async createProject() {
      let ongoingId = "";
      for (let i = 0; i < this.status.length; i++) {
        if (this.status[i].status === "ongoing") {
          ongoingId = this.status[i].id;
        }
      }
      let project = {};
      project.teamid = this.team.id;
      project.name = this.project.name;
      project.vision = this.project.vision;
      project.status = ongoingId;
      const raw = await feathersClient.service("projects").create(project);
      for (let i = 0; i < this.project.backlog.length; i++) {
        this.project.backlog[i].projectid = raw.id;
        await feathersClient
          .service("backlog-items")
          .create(this.project.backlog[i]);
      }
      this.closeConfirmDialog();
      console.log("Project Created!", raw);
      this.close();
    }
  }
};
</script>
