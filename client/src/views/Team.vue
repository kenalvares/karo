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
                          >{{ item.body }}
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn color="primary" @click="createProject()">
                Continue
              </v-btn>

              <v-btn text @click="closeProjectCreation()"
                >Cancel</v-btn
              > </v-stepper-content
            >
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
  data: vm => ({
    createProjectStepper: 4,
    dialog: false,
    heatmap: false,
    team: {},
    user: {},
    members: [],
    roles: [],
    owned: false,
    loader: {
      pendingData: true,
      pendingMsg: "Getting Team Data...",
      failed: false
    },
    project: {
      name: "",
      vision: "",
      backlog: [],
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10)
    },
    startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    startDateMenu: false,
    endDateMenu: false,
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
    computedStartDateFormatted() {
      return this.formatDate(this.project.startDate);
    },
    computedEndDateFormatted() {
      return this.formatDate(this.project.endDate);
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
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
    addBacklogItem() {
      let item = {};
      item.priority = this.project.backlog.length + 1;
      item.title = this.backlogItemTitle;
      item.body = this.backlogItemBody;
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
    createProject() {
      console.log("Project Created!", this.project);
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
        this.team = team;
        this.user = me;
        this.members = members;
        this.roles = roles;
        this.loader.pendingData = false;
      } catch (err) {
        if (err.code === 401) {
          this.loader.pendingMsg = "You aren't logged in";
          this.loader.failed = true;
        } else {
          this.loader.pendingMsg = "Try refreshing the page";
          this.loader.failed = true;
        }
      }
    }
  },
  async created() {
    const date = new Date();
    var str = `${date.getUTCFullYear()}-${date.getUTCMonth() +
      1}-${date.getUTCDate()}`;
    console.log(str);
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
