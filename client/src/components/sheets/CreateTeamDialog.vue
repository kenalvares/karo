<template>
  <v-bottom-sheet v-model="createTeamDialog">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="primary" v-on="on">
        <v-icon left>add</v-icon>
        Create Team
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-btn
        class="mt-6"
        flat
        color="red"
        @click="createTeamDialog = !createTeamDialog"
        >close</v-btn
      >
      <div>
        <CreateTeamStepper />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import CreateTeamStepper from "@/components/steppers/CreateTeamStepper";
export default {
  name: "CreateTeamDialog",
  data: () => ({
    createTeamDialog: false
  }),
  components: {
    CreateTeamStepper
  }
};
</script>
