<template>
  <div>
    <LoggedIn v-if="toShow" />
    <Placeholder page="Dashboard" />
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
    if (store.state.loginNotice) {
      this.toShow = true;
      store.commit("hideLoginNotice");
    } else {
      this.toShow = false;
    }
  }
};
</script>
