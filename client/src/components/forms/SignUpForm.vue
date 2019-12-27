<template>
  <v-row justify="center">
    <v-col cols="12" lg="6" md="4">
      <v-form action="http://localhost:3030/users" method="POST">
        <v-card>
          <v-toolbar flat color="grey" dark>
            <v-icon left>create</v-icon>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              ref="firstname"
              v-model="firstname"
              :error-messages="errorMessages"
              label="First Name"
              required
            ></v-text-field>
            <v-text-field
              ref="lastname"
              v-model="lastname"
              :error-messages="errorMessages"
              label="Second Name"
              required
            ></v-text-field>
            <v-text-field
              ref="email"
              v-model="email"
              :error-messages="errorMessages"
              label="E-Mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :error-messages="errorMessages"
              :type="show1 ? 'text' : 'password'"
              name="password"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              :error-messages="errorMessages"
              name="confirmPAssword"
              label="Confirm Password"
              hint="At least 8 characters"
              counter
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text type="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SignUpForm",
  data: () => ({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    show1: false,
    show2: false
  }),

  computed: {
    form() {
      return {
        name: this.name,
        firstname: this.firtsname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      };
    }
  }
};
</script>
