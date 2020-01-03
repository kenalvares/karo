<template>
  <v-stepper v-model="projectStepper" vertical>
    <v-stepper-step :complete="projectStepper > 1" step="1">
      Enter Project Name
<<<<<<< HEAD
=======
      <small>Summarize if needed</small>
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-text-field
        ref="projectname"
        v-model="projectname"
<<<<<<< HEAD
        placeholder="My Awesome Project!"
        required
        @keydown.enter="step(1)"
      ></v-text-field>
      <v-btn color="primary" @click="step(1)">Continue</v-btn>
=======
        label="Project Name"
        required
      ></v-text-field>
      <v-btn color="primary" @click="projectStepper = 2">Continue</v-btn>
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
    </v-stepper-content>

    <v-stepper-step :complete="projectStepper > 2" step="2"
      >Select Team</v-stepper-step
    >

    <v-stepper-content step="2">
<<<<<<< HEAD
      <v-select
        :items="items"
        placeholder="My Teams"
        v-model="teamname"
        @keydown.enter.prevent
      ></v-select>
      <v-btn color="primary" @click="step(1)">Continue</v-btn>
=======
      <v-text-field
        ref="teamname"
        v-model="teamname"
        label="Team Name"
        required
      ></v-text-field>
      <v-btn color="primary" @click="projectStepper = 3">Continue</v-btn>
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
    </v-stepper-content>

    <v-stepper-step :complete="projectStepper > 3" step="3"
      >Project Description</v-stepper-step
    >

    <v-stepper-content step="3">
<<<<<<< HEAD
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
=======
      <v-text-field
        ref="description"
        v-model="description"
        label="Project Description"
        required
      ></v-text-field>
      <v-btn color="primary" @click="projectStepper = 4">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4">Background Image</v-stepper-step>
    <v-stepper-content step="4">
      <v-text-field
        ref="name"
        v-model="backgroundUrl"
        label="Project Background"
        required
      ></v-text-field>
      <v-btn color="primary" @click="projectStepper = 5">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-step step="5">Duration</v-stepper-step>
    <v-stepper-content step="5"
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
      ><v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
<<<<<<< HEAD
        @keydown.enter.prevent
=======
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
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
<<<<<<< HEAD
            @keydown.enter.prevent
=======
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
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
<<<<<<< HEAD
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    items: ["Team1", "Team2", "Team3"]
=======
    backgroundUrl: "",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
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
<<<<<<< HEAD
=======
        backgroundUrl: this.backgroundUrl,
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
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
<<<<<<< HEAD
    },
    step(n) {
      this.projectStepper += n;
=======
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
    }
  }
};
</script>
