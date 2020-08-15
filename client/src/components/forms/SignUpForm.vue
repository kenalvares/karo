<template>
  <v-row style="width:100%!important;" justify="center" align="center">
    <v-col cols="12" xl="4" lg="6" md="4">
      <v-form
        ref="form"
        class="form"
        v-model="valid"
        @submit.prevent="validateUser"
        @keydown.prevent.enter
        autocomplete="on"
      >
        <v-card>
          <v-toolbar flat color="grey" dark>
            <v-icon left>create</v-icon>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-subtitle class="red white--text pa-3" v-if="errors">
            <v-icon left class="white--text">warning</v-icon>
            {{ errors }}
          </v-card-subtitle>
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
    errors: ""
  }),
  methods: {
    goBack: function(n) {
      n *= -1;
      router.go(n);
    },
    validateUser() {
      let emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
      let hasSpace = /\s/g;
      let hasNumber = /\d/g;
      let validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,60}$/g;
      if (this.firstname === "" || this.firstname === null) {
        this.errors = "First name is required";
        return;
      } else if (hasSpace.test(this.firstname)) {
        this.errors = "No spaces allowed in first name";
        return;
      } else if (hasNumber.test(this.firstname)) {
        this.errors = "No numbers allowed in first name";
        return;
      } else if (this.lastname === "" || this.lastname === null) {
        this.errors = "Last name is required";
        return;
      } else if (hasSpace.test(this.lastname)) {
        this.errors = "No spaces allowed in last name";
        return;
      } else if (hasNumber.test(this.lastname)) {
        this.errors = "No numbers allowed in last name";
        return;
      } else if (this.email === "" || this.email === null) {
        this.errors = "Email is required";
        return;
      } else if (!emailPattern.test(this.email)) {
        this.errors = "Enter a valid email";
        return;
      } else if (hasSpace.test(this.email)) {
        this.errors = "No spaces allowed in email";
        return;
      } else if (this.password === "" || this.password === null) {
        this.errors = "Password is required";
        return;
      } else if (this.password.length < 8) {
        this.errors = "Password must be atleast 8 characters";
        return;
      } else if (!validPassword.test(this.password)) {
        this.errors =
          "Password must include a-z, A-Z, 0-9 and special characters";
        return;
      } else if (this.confirmPassword !== this.password) {
        this.errors = "Passwords must match";
        return;
      }
      this.errors = "";
      this.createUser();
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
