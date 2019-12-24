<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Karo" />
    <v-row align="center">
      <v-col cols="12">
        <v-btn depressed large color="primary" to="/login">Login</v-btn>
        <v-btn outlined large color="primary" to="/sign-up">Sign Up</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
