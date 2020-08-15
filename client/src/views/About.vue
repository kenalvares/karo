<template>
  <div>
    <Placeholder page="About"></Placeholder>
  </div>
</template>

<script>
// @ is an alias to /src
import Placeholder from "@/components/dev/Placeholder.vue";
import store from "@/store/index";
export default {
  name: "about",
  components: {
    Placeholder
  },
  created() {
    store.commit("setPageTitle", "About");
  }
};
</script>
