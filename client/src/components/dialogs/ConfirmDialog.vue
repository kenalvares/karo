<template>
  <v-dialog v-model="computedShow">
    <v-card>
      <v-card-title class="headline grey lighten-4" primary-title>
        Confirm
      </v-card-title>
      <v-card-title> </v-card-title>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    showProp: Boolean
  },
  data: () => ({
    step: 1
  }),
  computed: {
    computedShow: {
      get: function() {
        return this.showProp;
      },
      set: function() {
        this.$emit("closeProjectCreation");
      }
    }
  }
};
</script>
