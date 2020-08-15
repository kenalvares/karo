<template>
  <v-container fluid class="fill">
    <SignUpForm />
    <v-row class="my-0 py-0">
      <v-col cols="12" class="my-0 py-0">
        <em>
          Already have an account?
          <v-btn @click="goTo('/login')" text color="primary" class="ma-0 pa-0">
            Login
          </v-btn>
        </em>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.fill {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 80vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
<script>
// @ is an alias to /src
import SignUpForm from "@/components/forms/SignUpForm.vue";
import store from "@/store/index";
import router from "@/router/index";

export default {
  name: "signup",
  components: {
    SignUpForm
  },
  created() {
    store.commit("setPageTitle", "Sign Up");
  },
  methods: {
    goTo(link) {
      router.push(link);
    }
  }
};
</script>
