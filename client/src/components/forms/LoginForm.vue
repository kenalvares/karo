<template>
  <v-row justify="center">
    <v-col cols="12" xl="4" lg="6" md="4">
      <v-form
        ref="form"
        class="form"
        v-model="valid"
        @submit.prevent="loginUser"
      >
        <v-card>
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
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click.stop="goBack(1)" type="button">Back</v-btn>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped></style>

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
    /*eslint-disable no-console*/
    try {
      return await feathersClient.reAuthenticate().then(() => {
        store.commit("userLoggedIn");
        router.push("/dashboard");
      });
    } catch (err) {
      store.commit("userLoggedOut");
    }
    /*eslint-disable no-console*/
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
          store.commit("userLoggedIn");
          router.push("/dashboard");
        });
      } catch (err) {
        this.errors = err.message;
      }
    }
  }
};
</script>
