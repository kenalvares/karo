<template>
  <v-container fluid class="mt-0">
    <v-row v-if="loader.pendingData" class="fill-height flex-column-center">
      <v-col cols="12" align="center" class="flex-column-center">
        <v-progress-circular
          :size="100"
          :width="5"
          color="primary"
          indeterminate
          class="mb-5"
          v-if="!loader.failed"
        ></v-progress-circular
        ><v-progress-circular
          :size="100"
          :width="5"
          color="grey"
          class="mb-5"
          v-if="loader.failed"
        >
          <v-icon color="grey">close</v-icon></v-progress-circular
        >
        <span>{{ loader.pendingMsg }}</span>
      </v-col>
    </v-row>
    <TeamDetailsCard
      v-if="!loader.pendingData"
      :logoSrc="logoSrc"
      :team="team"
      :owned="owned"
      :members="members"
    />
    <v-btn
      fab
      color="red accent-2 white--text"
      bottom
      right
      absolute
      large
      class="my-4"
      v-if="owned"
      @click="closeProjectCreation()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="dialog">
      <v-card>
        <v-stepper v-model="createProjectStepper" vertical>
          <v-stepper-header class="grey darken-3">
            <v-card-title left class="grey--text text--lighten-2">
              <v-icon left class="grey--text text--lighten-2">create</v-icon>
              Create Project
            </v-card-title>
          </v-stepper-header>
          <v-stepper-items class="red white--text pa-3" v-if="errors">
            <v-icon left class="white--text">warning</v-icon>
            {{ errors }}
          </v-stepper-items>
          <v-stepper-items>
            <v-stepper-step :complete="createProjectStepper > 1" step="1"
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
                @keydown.enter="step(2)"
              >
              </v-text-field>

              <v-btn color="primary" @click="step(2)">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="createProjectStepper > 2" step="2"
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
                @keydown.enter="step(3)"
              ></v-textarea>

              <v-btn color="primary" @click="step(3)">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step step="3" :complete="createProjectStepper > 3"
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
                            <v-col cols="1" class="ma-0 pa-0" :width="0">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ onInc }">
                                  <v-btn
                                    icon
                                    class="ma-0 pa-0"
                                    :disabled="
                                      item.priority === 1 ? true : false
                                    "
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
                            <v-col cols="11">
                              <span class="header-text">{{ item.title }}</span>
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
                  <v-btn color="primary" dark v-on="on">
                    Create
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title v-if="!loader.creatingProject" class="headline grey lighten-4" primary-title>
                    One Last Check
                  </v-card-title>
                  
                  <v-card-title v-if="loader.creatingProject" class="headline grey lighten-4" primary-title>
                    One Second
                  </v-card-title>

                  <v-card-text v-if="!loader.creatingProject" class="pa-2 px-3">
                    {{ firstName }}, are you ready to start this project?
                  </v-card-text>

                  <v-card-text v-if="loader.creatingProject" class="fill-height flex-column-center">
                    <v-progress-circular
                      :size="100"
                      :width="5"
                      color="primary"
                      indeterminate
                      class="mb-5"
                    >
                      <v-icon color="grey">close</v-icon>
                    </v-progress-circular                    >
                    <span>{{ loader.creatingProjectMsg }}</span>
              </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="createProject()">
                      Start Project
                    </v-btn>
                    <v-btn
                      @click="
                        step(1);
                        confirmDialog = !confirmDialog;
                      "
                    >
                      Check Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn text @click="closeProjectCreation()">Cancel</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
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
import store from "../store/index";
import feathersClient from "../feathers-client";
import TeamDetailsCard from "@/components/cards/TeamDetailsCard";

//import router from "../router/index";
export default {
  name: "Team",
  data: () => ({
    createProjectStepper: 1,
    dialog: false,
    confirmDialog: false,
    heatmap: false,
    team: {},
    user: {},
    members: [],
    roles: [],
    owned: false,
    loader: {
      pendingData: true,
      pendingMsg: "Getting Team Data...",
      failed: false,
      creatingProject: false,
      creatingProjectMsg: "Creating Project..."
    },
    status: [],
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
  components: {
    TeamDetailsCard
  },
  computed: {
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
    logoSrc() {
      if (
        this.team.profilePicUrl === null ||
        this.team.profilePicUrl === undefined ||
        this.team.profilePicUrl === ""
      ) {
        return store.getters.teamLogoSrc;
      }
      return this.team.profilePicUrl;
    },
    noOfBacklogItems() {
      if (this.project.backlog === 1) {
        return this.project.backlog.length + " item";
      }
      return this.project.backlog.length + " items";
    }
  },
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
    step(n) {
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
        this.createProjectStepper = n;
      }
    },
    closeProjectCreation() {
      this.project.name = "";
      this.project.vision = "";
      this.project.backlog = [];
      this.dialog = !this.dialog;
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
        await feathersClient.service("backlog-items").create(this.project.backlog[i]);
      }
      this.closeConfirmDialog();
      console.log("Project Created!", raw);
      this.closeProjectCreation();
    },
    async getMemberData(userid) {
      const user = await feathersClient.service("users").find({
        query: {
          id: userid,
          $select: ["firstname", "lastname", "email"]
        }
      });
      let memberData = {};
      memberData.name = user.data[0].firstname + " " + user.data[0].lastname;
      memberData.email = user.data[0].email;
      return memberData;
    },
    async getStatus() {
      const raw = await feathersClient.service("project-status").find({
        query: {
          $select: ["id", "status"]
        }
      });
      const status = raw.data;
      return status;
    },
    async fetchData() {
      try {
        await store.dispatch("login");
        const me = store.getters.getUserData;
        const rawTeam = await feathersClient.service("teams").find({
          query: {
            id: this.$router.history.current.params.id
          }
        });
        const team = rawTeam.data[0];
        this.loader.pendingMsg = `Team "${team.name}" is loading..."`;
        const rawMembers = await feathersClient.service("members").find({
          query: {
            $select: ["userid", "roleid", "fav"],
            teamid: team.id
          }
        });
        const members = rawMembers.data;
        const rawRoles = await feathersClient.service("roles").find({
          query: {
            $select: ["id", "role"]
          }
        });
        let ownerId;
        const roles = rawRoles.data;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].role === "Owner") {
            ownerId = roles[i].id;
          }
        }
        for (let i = 0; i < members.length; i++) {
          for (let j = 0; j < roles.length; j++) {
            if (members[i].roleid === roles[j].id) {
              members[i].role = roles[j].role;
              delete members[i].roleid;
            }
            if (members[i].roleid === ownerId) {
              if (members[i].userid === me.id) {
                this.owned = true;
              }
            }
          }
        }
        for (let i = 0; i < members.length; i++) {
          const memberData = await this.getMemberData(members[i].userid);
          members[i].name = memberData.name;
          members[i].email = memberData.email;
        }
        let status = await this.getStatus();
        this.team = team;
        this.user = me;
        this.members = members;
        this.roles = roles;
        this.status = status;
        this.loader.pendingData = false;
      } catch (err) {
        if (err.code === 401) {
          this.loader.pendingMsg = "You aren't logged in";
          this.loader.failed = true;
        } else if (err.code === 408) {
          this.loader.pendingMsg = "You aren't logged in";
          this.loader.failed = true;
        } else {
          console.log(err);
          this.loader.pendingMsg = "Try refreshing the page";
          this.loader.failed = true;
        }
      }
    }
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    $route: "fetchData",
    startDate() {
      this.startDateFormatted = this.formatDate(this.startDate);
    },
    endDate() {
      this.endDateFormatted = this.formatDate(this.endDate);
    }
  }
};
</script>
