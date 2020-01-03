<template>
  <v-bottom-sheet v-model="createProjectDialog">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="primary" v-on="on">
        <v-icon left>add</v-icon>
        Create Project
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-btn
        class="my-6"
        outlined
        color="red"
        @click="createProjectDialog = !createProjectDialog"
      >
        <v-icon left>close</v-icon>Close</v-btn
      >
      <div>
        <CreateProjectStepper />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import CreateProjectStepper from "@/components/steppers/CreateProjectStepper";
export default {
  name: "CreateProjectDialog",
  data: () => ({
    createProjectDialog: false
  }),
  components: {
    CreateProjectStepper
  }
};
</script>
