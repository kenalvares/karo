<template>
  <v-stepper v-model="projectStepper" :vertical="false">
    <v-stepper-header>
      <v-stepper-step :complete="projectStepper > 1" step="1">
        Enter Project Name
      </v-stepper-step>
      <v-divider />
      <v-stepper-step :complete="projectStepper > 2" step="2"
        >Select Team</v-stepper-step
      >
      <v-divider />
      <v-stepper-step :complete="projectStepper > 3" step="3"
        >Project Description</v-stepper-step
      >
      <v-divider />

      <v-stepper-step :complete="projectStepper > 4" step="4"
        >Duration</v-stepper-step
      >
    </v-stepper-header>
    <v-stepper-items class="red white--text pa-3" v-if="errors">
      <v-icon left class="white--text">warning</v-icon>
      {{ errors }}
    </v-stepper-items>
    <v-stepper-content step="1">
      <v-text-field
        ref="projectname"
        v-model="projectname"
        placeholder="My Awesome Project!"
        required
        counter
        :rules="projectnameMaxChars"
        @keydown.enter="step(2)"
      ></v-text-field>
      <v-btn color="primary" @click="step(2)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-select
        v-if="hasTeams"
        :items="teams"
        placeholder="My Teams"
        v-model="teamname"
        @keydown.enter.prevent
      ></v-select>
      <CreateTeamDialog />
      <v-btn color="primary" class="ml-4" @click="step(3)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-textarea
        placeholder="This project aims to..."
        hint="A short, concise introduction to your project"
        v-model="description"
        auto-grow
        counter
        :rules="descriptionMaxChars"
        @keydown.enter="step(4)"
      ></v-textarea>
      <v-btn color="primary" @click="step(4)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="4">
      <v-row>
        <v-spacer />
        <v-col cols="5">
          <v-row :class="labelMarginY">
            <v-col align="left" :class="labelMarginY">Start Date</v-col>
          </v-row>
          <v-menu
            ref="menu1"
            v-model="startDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            :max-width="dateMenuWidth"
            :min-width="dateMenuWidth"
            @keydown.enter.prevent
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startDateFormatted"
                label=""
                :hint="dateFormatHint"
                persistent-hint
                prepend-icon="event"
                @blur="startDate = parseDate(startDateFormatted)"
                v-on="on"
                :class="labelMarginY"
                @keydown.enter.prevent
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              no-title
              @input="startDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="5">
          <v-row :class="labelMarginY">
            <v-col align="left" :class="labelMarginY">End Date</v-col>
          </v-row>
          <v-menu
            ref="endDateMenu"
            v-model="endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            :max-width="dateMenuWidth"
            :min-width="dateMenuWidth"
            @keydown.enter.prevent
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endDateFormatted"
                label=""
                :hint="dateFormatHint"
                persistent-hint
                prepend-icon="event"
                @blur="endDate = parseDate(endDateFormatted)"
                v-on="on"
                :class="labelMarginY"
                @keydown.enter.prevent
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              no-title
              @input="endDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer />
      </v-row>
      <v-btn color="primary" @click="createProject()" right>Continue</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
export default {
  name: "CreateProjectStepper",
  components: {
    CreateTeamDialog
  },
  data: vm => ({
    projectStepper: 1,
    projectname: "",
    teamname: "",
    description: "",
    startDate: new Date().toISOString().substr(0, 10),
    startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    startDateMenu: false,
    endDate: new Date().toISOString().substr(0, 10),
    endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    endDateMenu: false,
    teams: ["Team 1", "Team 2", "Team 3"],
    errors: null,
    descriptionMaxChars: [v => v.length <= 500 || "Max 500 characters"],
    projectnameMaxChars: [v => v.length <= 50 || "Max 50 characters"],
    dateMenuWidth: "290px",
    labelMarginY: "my-0",
    dateFormatHint: "DD/MM/YYYY format"
  }),
  computed: {
    hasTeams() {
      if (this.teams.length < 1) {
        return false;
      }
      return true;
    },
    computedStartDateFormatted() {
      return this.formatDate(this.startDate);
    },
    computedEndDateFormatted() {
      return this.formatDate(this.endDate);
    }
  },
  watch: {
    /*eslint-disable no-unused-vars*/
    startDate(val) {
      this.startDateFormatted = this.formatDate(this.startDate);
    },
    endDate(val) {
      this.endDateFormatted = this.formatDate(this.endDate);
    }
    /*eslint-enable no-unused-vars*/
  },
  methods: {
    /*eslint-disable no-console*/
    createProject() {
      var projDetails = {
        name: this.projectname,
        team: this.teamname,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate
      };
      console.log("Created project!", projDetails);
    } /*eslint-enable no-console*/,
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
    step(n) {
      let nextStep = true;
      if (n === 2) {
        if (this.projectname === "" || this.projectname === null) {
          this.errors = "Please name your project to continue";
          nextStep = false;
        }
      } else if (n === 3) {
        if (this.teamname === "" || this.teamname === null) {
          this.errors = "Please select a team to continue";
          nextStep = false;
        }
      } else if (n === 4) {
        if (this.description === "" || this.description === null) {
          this.errors = "Please describe your project";
          nextStep = false;
        }
      }

      if (nextStep) {
        this.errors = null;
        this.projectStepper = n;
      }
    }
  }
};
</script>
