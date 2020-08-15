<template>
  <v-dialog v-model="dialog" max-width="1080px">
    <template v-slot:activator="{ on }">
      <v-btn fab fixed bottom right class="mx-3 red" v-on="on">
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-toolbar>
        <h2>Create Team</h2>
        <v-spacer />
        <v-btn icon class="my-6" @click="dialog = !dialog">
          <v-icon>close</v-icon>
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
    dialog: false
  }),
  components: {
    CreateTeamStepper
  },
  methods: {
    closeDialog(teamCreated) {
      if (teamCreated) {
        this.dialog = !this.dialog;
        this.$emit("teamCreated", true);
      } else {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>
