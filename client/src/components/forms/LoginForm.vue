<!-- Login Form-->
<!-- Displays short team data in card -->
<template>
  <v-row
    style="width:100%!important;"
    justify="center"
    align="center"
    class="mb-0 pb-0"
  >
    <v-col cols="12" xl="4" lg="6" md="4" class="mb-0 pb-0">
      <v-form
        ref="form"
        class="form mb-0 pb-0"
        v-model="valid"
        @submit.prevent="loginUser"
      >
        <v-card class="mb-0 pb-0">
          <v-toolbar flat color="grey" dark>
            <v-icon left>lock_open</v-icon>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <div class="red white--text pa-4" v-if="errors">{{ errors }}</div>
          <v-card-text>
            <v-text-field
              ref="email"
              v-model="email"
              label="E-Mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="password"
              label="Password"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click.stop="goBack(1)" text>Back</v-btn>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import router from "../../router/index";
import store from "../../store/index";
import feathersClient from "../../feathers-client";

export default {
  name: "LoginForm",
  data: () => ({
    valid: false,
    email: "",
    password: "",
    show1: false,
    errors: null
  }),
  mounted: async () => {
    try {
      return await feathersClient.reAuthenticate().then(() => {
        store.dispatch("login");
        router.push("/dashboard");
      });
    } catch (err) {
      store.dispatch("logout");
    }
  },
  methods: {
    goBack: function(n) {
      n *= -1;
      router.go(n);
    },
    async loginUser() {
      let user = {
        strategy: "local",
        email: this.email,
        password: this.password
      };
      try {
        return await feathersClient.authenticate(user).then(() => {
          store.dispatch("login");
          router.push("/dashboard");
        });
      } catch (err) {
        store.dispatch("logout");
        if (err.code === 408) {
          this.errors = "Timed out. Refresh and try again";
        } else {
          this.errors = err.message;
        }
      }
    }
  }
};
</script>
