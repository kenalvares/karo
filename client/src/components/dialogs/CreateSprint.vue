<template>
  <v-dialog v-model="show">
    <v-toolbar v-if="!mainLoader.pendingData">
      <v-icon left>create</v-icon>

      <h2>Create Sprint</h2>
      <v-spacer />
      <v-btn outlined dark class="my-6" @click="close(false)">
        Close
        <v-icon right>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card>
      <div style="max-width:300px" class="mx-auto">
        <!--
        This row contains the loader.
        It is only rendered while client is awaiting data from server
        -->
        <LoadingData :loader="mainLoader" />
      </div>
      <v-stepper v-model="step" vertical v-if="!mainLoader.pendingData">
        <v-stepper-items class="red darken-4 pa-3" v-if="errors">
          <v-icon left>warning</v-icon>
          {{ errors }}
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-step :complete="step > 1" step="1"
            >Set Duration</v-stepper-step
          >

          <v-stepper-content step="1">
            <v-row class="my-0 py-0">
              <v-col cols="12" class="my-0 py-0">
                <v-alert dense border="left" colored-border type="info">
                  This sprint will be <strong>{{ duration }}</strong> long.
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-menu
                  ref="startMenu"
                  v-model="startMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="startDateFormatted"
                      label="Start Date"
                      hint="DD/MM/YYYY format"
                      prepend-icon="event"
                      @blur="startDate = parseDate(startDateFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    :allowed-dates="allowedStartDates"
                    no-title
                    @input="startMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-spacer />
              <v-col cols="5">
                <v-menu
                  ref="endMenu"
                  v-model="endMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="endDateFormatted"
                      label="End Date"
                      hint="DD/MM/YYYY"
                      prepend-icon="event"
                      @blur="endDate = parseDate(endDateFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    :allowed-dates="allowedEndDates"
                    no-title
                    @input="endMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-btn class="mx-2" color="primary" @click="stepTo(2)">
              Continue
            </v-btn>
            <v-btn outlined class="mx-2" @click="close()">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2"
            >Select Backlog Items</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-card max-width="1080" class="mb-4">
              <v-toolbar
                :color="
                  sprint.backlog.length
                    ? 'grey darken-4'
                    : 'deep-purple accent-4'
                "
                dark
              >
                <v-btn
                  v-if="sprint.backlog.length"
                  icon
                  @click="sprint.backlog = []"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-toolbar-title>
                  {{
                    sprint.backlog.length
                      ? `${sprint.backlog.length} selected`
                      : `Backlog - ${project.name}`
                  }}
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-scale-transition>
                  <v-btn v-if="sprint.backlog.length" icon>
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-scale-transition>
              </v-toolbar>

              <v-card-text>
                <v-select
                  v-model="sprint.backlog"
                  :items="project.backlog.map(({ title }) => title)"
                  multiple
                  auto-grow
                  label="Select an option"
                ></v-select>
              </v-card-text>
            </v-card>
            <v-btn class="mx-2" color="primary" @click="createSprint()">
              Continue
            </v-btn>
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
import LoadingData from "@/components/loaders/LoadingData";
export default {
  name: "CreateSprint",
  props: {
    project: Object,
    showDialog: Boolean,
    number: Number,
    status: Array
  },
  components: {
    LoadingData
  },
  data: vm => ({
    step: 1,
    startingSprint: {
      pending: false,
      pendingMsg: "Starting Sprint..."
    },
    errors: null,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    startMenu: false,
    endMenu: false,
    sprint: {
      backlog: []
    },
    mainLoader: {
      pendingData: false,
      pendingMsg: "Creating sprint",
      failed: false
    }
  }),
  created() {
    const today = new Date();
    this.endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10);
  },
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
    duration() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (isNaN(days)) {
        this.setError("Check selected dates");
      } else if (days < 7) {
        this.setError("Recommended minimum sprint length is 1 week");
      } else {
        this.setError(null);
      }
      return `${days} days`;
    }
  },
  watch: {
    startDate() {
      this.startDateFormatted = this.formatDate(this.startDate);
    },
    endDate() {
      this.endDateFormatted = this.formatDate(this.endDate);
    }
  },

  methods: {
    setError(str) {
      this.errors = str;
    },
    allowedStartDates: val => {
      try {
        let test = {};
        test.date = parseInt(val.split("-")[2], 10);
        test.month = parseInt(val.split("-")[1], 10);
        test.year = parseInt(val.split("-")[0], 10);
        const base = new Date();
        if (test.year < base.getFullYear()) {
          return false;
        } else {
          if (test.year === base.getFullYear()) {
            if (test.month === base.getMonth() + 1) {
              if (test.date < base.getDate()) {
                return false;
              }
            }
            if (test.month < base.getMonth() + 1) {
              return false;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
      return true;
    },
    allowedEndDates: val => {
      try {
        let test = {};
        test.date = parseInt(val.split("-")[2], 10);
        test.month = parseInt(val.split("-")[1], 10);
        test.year = parseInt(val.split("-")[0], 10);
        const base = new Date();
        if (test.year < base.getFullYear()) {
          return false;
        } else {
          if (test.year === base.getFullYear()) {
            if (test.month === base.getMonth() + 1) {
              if (test.date < base.getDate() + 7) {
                return false;
              }
            }
            if (test.month < base.getMonth() + 1) {
              return false;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
      return true;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    stepTo(n) {
      let nextStep = true;
      if (n === 2) {
        // Do this
      } else if (n === 3) {
        // do this
      } else if (n === 4) {
        // do this
      }

      if (nextStep) {
        this.errors = null;
        this.step = n;
      }
    },
    async createSprint() {
      if (this.sprint.backlog.length < 1) {
        this.setError("Select atleast 1 item to work on.");
      } else {
        this.mainLoader.pendingData = true;
        this.mainLoader.pendingMsg = "Creating Sprint...";
        let sprint = {};
        sprint.number = this.number;
        sprint.projectid = this.project.id;
        sprint.startDate = this.startDate;
        sprint.endDate = this.endDate;
        sprint.backlogRaw = [];
        for (let i = 0; i < this.sprint.backlog.length; i++) {
          for (let j = 0; j < this.project.backlog.length; j++) {
            if (this.sprint.backlog[i] === this.project.backlog[j].title) {
              sprint.backlogRaw.push(this.project.backlog[j].id);
            }
          }
        }
        this.mainLoader.pendingMsg = "Almost done...";
        sprint.backlog = JSON.stringify(Object.assign({}, sprint.backlogRaw));
        delete sprint.backlogRaw;
        for (let i = 0; i < this.status.length; i++) {
          if (this.status[i].status === "ongoing") {
            sprint.status = this.status[i].id;
          }
        }
        await feathersClient.service("sprints").create(sprint);
        this.close(true);
      }
    },
    close(created) {
      this.step = 1;
      if (created) {
        this.$emit("created");
      } else {
        this.$emit("close");
      }
    },
    async startSprint() {
      this.close();
    }
  }
};
</script>
