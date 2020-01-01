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
        class="mt-6"
        flat
        color="red"
        @click="createProjectDialog = !createProjectDialog"
        >close</v-btn
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
