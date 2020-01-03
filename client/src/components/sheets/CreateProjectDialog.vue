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
<<<<<<< HEAD
        class="my-6"
        outlined
        color="red"
        @click="createProjectDialog = !createProjectDialog"
      >
        <v-icon left>close</v-icon>Close</v-btn
=======
        class="mt-6"
        depressed
        color="red"
        @click="createProjectDialog = !createProjectDialog"
        >close</v-btn
>>>>>>> 4f0eba90b9322e8b0a8546b0ab9481707dc13e86
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
