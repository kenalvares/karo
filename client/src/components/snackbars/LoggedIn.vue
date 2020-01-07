<template>
  <v-snackbar
    v-model="toShow"
    color="success"
    :multi-line="true"
    :timeout="3000"
    :top="true"
  >
    Successfully logged in
    <v-btn dark text @click="toShow = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "LoggedIn",
  data: () => ({
    toShow: true
  })
};
</script>
