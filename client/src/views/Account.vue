<template>
  <div>
    <Placeholder page="Accounts"></Placeholder>
  </div>
</template>

<script>
// @ is an alias to /src
import Placeholder from "@/components/dev/Placeholder.vue";
import store from "@/store/index";
export default {
  name: "account",
  components: {
    Placeholder
  },
  created() {
    store.commit("setPageTitle", "Account");
  }
};
</script>
