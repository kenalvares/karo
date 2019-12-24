<template>
  <div class="projects">
    <img alt="Vue logo" src="../assets/logo.png" />
    <ProjectView msg="Welcome to Your Projects" />
  </div>
</template>

<script>
// @ is an alias to /src
import ProjectView from "@/components/ProjectView.vue";

export default {
  name: "Projects",
  components: {
    ProjectView
  }
};
</script>
