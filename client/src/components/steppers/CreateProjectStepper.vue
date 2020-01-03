<template>
  <v-stepper v-model="projectStepper" vertical>
    <v-stepper-step :complete="projectStepper > 1" step="1">
      Enter Project Name
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-text-field
        ref="projectname"
        v-model="projectname"
        placeholder="My Awesome Project!"
        required
        @keydown.enter="step(1)"
      ></v-text-field>
      <v-btn color="primary" @click="step(1)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="projectStepper > 2" step="2"
      >Select Team</v-stepper-step
    >

    <v-stepper-content step="2">
      <v-select
        :items="items"
        placeholder="My Teams"
        v-model="teamname"
        @keydown.enter.prevent
      ></v-select>
      <v-btn color="primary" @click="step(1)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="projectStepper > 3" step="3"
      >Project Description</v-stepper-step
    >

    <v-stepper-content step="3">
      <v-textarea
        placeholder="This project aims to..."
        value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        hint="A short, concise introduction to your project"
        v-model="description"
        @keydown.enter="step(1)"
      ></v-textarea>
      <v-btn color="primary" @click="step(1)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4">Duration</v-stepper-step>
    <v-stepper-content step="4"
      ><v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
        @keydown.enter.prevent
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateFormatted"
            label="Date"
            hint="MM/DD/YYYY format"
            persistent-hint
            prepend-icon="event"
            @blur="date = parseDate(dateFormatted)"
            v-on="on"
            @keydown.enter.prevent
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          no-title
          @input="menu1 = false"
        ></v-date-picker>
      </v-menu>
      <v-btn color="primary" @click="createProject()">Continue</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  name: "CreateProjectStepper",
  data: vm => ({
    projectStepper: 1,
    projectname: "",
    teamname: "",
    description: "",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    items: ["Team1", "Team2", "Team3"]
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  watch: {
    /*eslint-disable no-unused-vars*/
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
    /*eslint-enable no-unused-vars*/
  },
  methods: {
    /*eslint-disable no-console*/
    createProject() {
      var projDetails = {
        projectName: this.projectname,
        teamName: this.teamname,
        projectDescription: this.description,
        projectDuration: this.date
      };
      console.log("Created project!", projDetails);
    } /*eslint-enable no-console*/,
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    step(n) {
      this.projectStepper += n;
    }
  }
};
</script>
