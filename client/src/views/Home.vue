<template>
  <div>
    <Placeholder page="Home" />
    <div class="hello">
      <h3>Installed CLI Plugins</h3>
      <ul>
        <li>
          <a
            href="https://github.com/vuetifyjs/vuetify"
            target="_blank"
            rel="noopener"
            >vuetify</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
            target="_blank"
            rel="noopener"
            >babel</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
            target="_blank"
            rel="noopener"
            >router</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
            target="_blank"
            rel="noopener"
            >vuex</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
            target="_blank"
            rel="noopener"
            >eslint</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
            target="_blank"
            rel="noopener"
            >unit-jest</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-cypress"
            target="_blank"
            rel="noopener"
            >e2e-cypress</a
          >
        </li>
      </ul>
      <h3>Essential Links</h3>
      <ul>
        <li>
          <a href="https://vuejs.org" target="_blank" rel="noopener"
            >Core Docs</a
          >
        </li>
        <li>
          <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
            >Forum</a
          >
        </li>
        <li>
          <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
            >Community Chat</a
          >
        </li>
        <li>
          <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
            >Twitter</a
          >
        </li>
        <li>
          <a href="https://news.vuejs.org" target="_blank" rel="noopener"
            >News</a
          >
        </li>
      </ul>
      <h3>Ecosystem</h3>
      <ul>
        <li>
          <a href="https://router.vuejs.org" target="_blank" rel="noopener"
            >vue-router</a
          >
        </li>
        <li>
          <a href="https://vuex.vuejs.org" target="_blank" rel="noopener"
            >vuex</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/vue-devtools#vue-devtools"
            target="_blank"
            rel="noopener"
            >vue-devtools</a
          >
        </li>
        <li>
          <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
            >vue-loader</a
          >
        </li>
        <li>
          <a
            href="https://github.com/vuejs/awesome-vue"
            target="_blank"
            rel="noopener"
            >awesome-vue</a
          >
        </li>
      </ul>
      <v-row align="center">
        <v-col cols="12">
          <v-btn
            depressed
            large
            class="indigo white--text btn-login"
            to="/login"
          >
            <v-icon left small>lock_open</v-icon>Login </v-btn
          >&nbsp;
          <v-btn
            depressed
            large
            class="success white--text btn-signup"
            to="/sign-up"
          >
            <v-icon left small>create</v-icon>Sign Up
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-login {
  color: #fff;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.hello {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>

<script>
// @ is an alias to /src
import Placeholder from "@/components/dev/Placeholder.vue";

export default {
  name: "home",
  components: {
    Placeholder
  }
};
</script>
