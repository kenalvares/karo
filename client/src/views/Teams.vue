<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <TeamView msg="Welcome to Your Teams" />
  </div>
</template>

<script>
// @ is an alias to /src
import TeamView from "@/components/TeamView.vue";

export default {
  name: "Teams",
  components: {
    TeamView
  }
};
</script>
