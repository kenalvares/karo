<template>
  <v-dialog v-model="show">
    Test
    <v-btn outlined dark class="my-6" @click="close(false)">
      Close
      <v-icon right>close</v-icon>
    </v-btn>
  </v-dialog>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  name: "EditProject",
  data: () => ({
    edit: false
  }),
  computed: {
    show: {
      // getter
      get: function() {
        return this.showDialog;
      },
      // setter
      set: function() {
        this.$emit("close");
      }
    }
  },
  methods: {
    close(edited) {
      this.step = 1;
      if (edited) {
        this.$emit("edited");
      } else {
        this.$emit("close");
      }
    }
  }
};
</script>
