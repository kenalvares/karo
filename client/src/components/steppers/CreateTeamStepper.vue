<template>
  <v-stepper v-model="teamStepper" :vertical="false">
    <v-stepper-header>
      <v-stepper-step :complete="teamStepper > 1" step="1">
        Team Name
      </v-stepper-step>
      <v-divider />
      <v-stepper-step :complete="teamStepper > 2" step="2"
        >Team Logo</v-stepper-step
      >
      <v-divider />
      <v-stepper-step :complete="teamStepper > 3" step="3"
        >Description</v-stepper-step
      >
      <v-divider />

      <v-stepper-step :complete="teamStepper > 4" step="4"
        >Members</v-stepper-step
      >
    </v-stepper-header>
    <v-stepper-items class="red white--text pa-3" v-if="errors">
      <v-icon left class="white--text">warning</v-icon>
      {{ errors }}
    </v-stepper-items>
    <v-stepper-content step="1">
      <v-text-field
        ref="teamname"
        v-model="teamname"
        placeholder="My Awesome Team!"
        required
        counter
        label="Enter Team Name"
        :rules="teamnameMaxChars"
        @keydown.enter="step(3)"
      ></v-text-field>
      <v-btn color="primary" @click="step(3)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-file-input
        :rules="teamLogoRules"
        ref="teamlogo"
        @keydown.enter="step(3)"
        accept="image/png, image/jpeg, image/bmp"
        prepend-icon="mdi-camera"
        label="Upload Team Logo"
      ></v-file-input>
      <v-btn color="primary" outlined class="ml-4" @click="step(3)">Skip</v-btn>
      <v-btn color="primary" class="ml-4" @click="step(3)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-textarea
        placeholder="This team is all about..."
        hint="A short, concise introduction to your team"
        v-model="description"
        auto-grow
        label="Enter Team Description"
        counter
        :rules="descriptionMaxChars"
        @keydown.enter="step(4)"
      ></v-textarea>
      <v-btn color="primary" @click="step(4)">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="4">
      <v-btn color="primary" class="ml-4" @click="createTeam()">Continue</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
/*eslint-disable no-unused-vars*/
import feathersClient from "../../feathers-client";
/*eslint-enable no-unused-vars*/

export default {
  name: "CreateTeamStepper",
  data: () => ({
    teamStepper: 1,
    teamname: "",
    teamlogo: "",
    description: "",
    errors: null,
    descriptionMaxChars: [v => v.length <= 500 || "Max 500 characters"],
    teamnameMaxChars: [v => v.length <= 50 || "Max 50 characters"],
    teamLogoRules: [
      v => !v || v.size < 2000000 || "Logo size should be less than 2 MB!"
    ]
  }),
  methods: {
    /*eslint-disable no-console*/
    createTeam() {
      var teamDetails = {
        name: this.teamname,
        description: this.description,
        profilePicUrl: this.teamlogo
      };
      console.log(teamDetails, this.teamMembers);
    } /*eslint-enable no-console*/,
    step(n) {
      let nextStep = true;
      if (n === 2) {
        if (this.teamname === "" || this.teamname === null) {
          this.errors = "Please enter a team name to continue";
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
        this.teamStepper = n;
      }
    }
  }
};
</script>
