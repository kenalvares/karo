<template>
  <v-bottom-sheet v-model="createTeamDialog">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="primary" v-on="on">
        <v-icon left>add</v-icon>
        Create Team
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-toolbar dark>
        <h2>Create Team</h2>
        <v-spacer />
        <v-btn
          outlined
          dark
          class="my-6"
          @click="createTeamDialog = !createTeamDialog"
        >
          Close
          <v-icon right>close</v-icon>
        </v-btn>
      </v-toolbar>
      <div>
        <CreateTeamStepper :roles="roles" @teamCreated="closeDialog" />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import CreateTeamStepper from "@/components/steppers/CreateTeamStepper";
export default {
  /*eslint-disable no-console*/
  name: "CreateTeamDialog",
  props: {
    roles: Array
  },
  data: () => ({
    createTeamDialog: false
  }),
  components: {
    CreateTeamStepper
  },
  methods: {
    closeDialog(teamCreated) {
      if (teamCreated) {
        this.createTeamDialog = !this.createTeamDialog;
        this.$emit("teamCreated", true);
      }
    }
  }
};
</script>
