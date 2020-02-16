<template>
  <v-dialog v-model="createTeamDialog" max-width="1080px">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-3" outlined v-on="on">
        <v-icon left>add</v-icon>
        Create Team
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-toolbar dark color="grey darken-4">
        <h2>Create Team</h2>
        <v-spacer />
        <v-btn
          outlined
          dark
          color="grey"
          class="my-6"
          @click="createTeamDialog = !createTeamDialog"
        >
          Close
          <v-icon right>close</v-icon>
        </v-btn>
      </v-toolbar>
      <div>
        <CreateTeamStepper
          :roles="roles"
          @teamCreated="closeDialog"
          @creationCancelled="closeDialog"
        />
      </div>
    </v-sheet>
  </v-dialog>
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
      this.createTeamDialog = !this.createTeamDialog;
    }
  }
};
</script>
