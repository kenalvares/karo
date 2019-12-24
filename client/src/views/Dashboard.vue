<template>
  <div class="dashboard">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Dash msg="Welcome to Your Dashboard" />
  </div>
</template>

<script>
// @ is an alias to /src
import Dash from "@/components/Dash.vue";

export default {
  name: "Dashboard",
  components: {
    Dash
  }
};
</script>
