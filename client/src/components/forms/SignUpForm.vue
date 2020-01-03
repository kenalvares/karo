<template>
  <v-row justify="center">
    <v-col cols="12" xl="4" lg="6" md="4">
      <v-form
        ref="form"
        class="form"
        v-model="valid"
        @submit.prevent="createUser"
        @keydown.prevent.enter
      >
        <v-card>
          <v-toolbar flat color="grey" dark>
            <v-icon left>create</v-icon>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              ref="firstname"
              v-model="firstname"
              label="First Name"
              required
            ></v-text-field>
            <v-text-field
              ref="lastname"
              v-model="lastname"
              label="Last Name"
              required
            ></v-text-field>
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
            <v-text-field
              v-model="confirmPassword"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              name="confirmPassword"
              label="Confirm Password"
              counter
              @click:append="show2 = !show2"
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

<script>
import router from "../../router/index";
import feathersClient from "../../feathers-client";

export default {
  name: "SignUpForm",
  data: () => ({
    valid: false,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    show1: false,
    show2: false,
    errorMsgs: null
  }),
  methods: {
    goBack: function(n) {
      n *= -1;
      router.go(n);
    },
    createUser() {
      let user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      };
      feathersClient
        .service("users")
        .create(user)
        .then(router.push({ path: "login" }));
    }
  }
};
</script>
