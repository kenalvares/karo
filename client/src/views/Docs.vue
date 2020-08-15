<template>
  <div>
    <Placeholder page="Docs"></Placeholder>
  </div>
</template>

<script>
// @ is an alias to /src
import Placeholder from "@/components/dev/Placeholder.vue";
import store from "@/store/index";
export default {
  name: "docs",
  components: {
    Placeholder
  },
  created() {
    store.commit("setPageTitle", "Docs");
  }
};
</script>
