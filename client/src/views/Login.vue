<template>
  <v-container fluid class="fill">
    <LoginForm />
    <v-row class="my-0 py-0">
      <v-col cols="12" class="my-0 py-0">
        <em>
          New here?
          <v-btn
            @click="goTo('/sign-up')"
            text
            color="primary"
            class="ma-0 pa-0"
          >
            Create Account
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
  height: 70vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
<script>
// @ is an alias to /src
import LoginForm from "@/components/forms/LoginForm";
import store from "@/store/index";
import router from "@/router/index";
export default {
  name: "login",
  components: {
    LoginForm
  },
  created() {
    store.commit("setPageTitle", "Login");
  },
  methods: {
    goTo(link) {
      router.push(link);
    }
  }
};
</script>
