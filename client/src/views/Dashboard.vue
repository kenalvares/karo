<template>
  <div>
    <Placeholder page="Dashboard" />
    <LoggedIn :snackbar="toShow" />
  </div>
</template>

<script>
// @ is an alias to /src
import store from "@/store/index";
import Placeholder from "@/components/dev/Placeholder";
import LoggedIn from "@/components/snackbars/LoggedIn";

export default {
  name: "dashboard",
  components: {
    Placeholder,
    LoggedIn
  },
  data: () => ({
    toShow: false
  }),
  mounted() {
    if (store.state.loggedIn) {
      this.toShow = true;
    } else {
      this.toShow = false;
    }
  }
};
</script>
