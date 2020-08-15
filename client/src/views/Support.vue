<template>
  <div>
    <Placeholder page="Support"></Placeholder>
  </div>
</template>

<script>
// @ is an alias to /src
import Placeholder from "@/components/dev/Placeholder.vue";
import store from "@/store/index";
export default {
  name: "support",
  components: {
    Placeholder
  },
  created() {
    store.commit("setPageTitle", "Support");
  }
};
</script>
