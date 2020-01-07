<template>
  <v-bottom-sheet v-model="createProjectDialog">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="primary" v-on="on">
        <v-icon left>add</v-icon>
        Create Project
      </v-btn>
    </template>
    <v-sheet class="text-center">
      <v-toolbar dark>
        <h2>Create Project</h2>
        <v-spacer />
        <v-btn
          outlined
          dark
          class="my-6"
          @click="createProjectDialog = !createProjectDialog"
        >
          Close
          <v-icon right>close</v-icon>
        </v-btn>
      </v-toolbar>
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
