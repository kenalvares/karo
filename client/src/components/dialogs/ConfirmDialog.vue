<template>
  <v-dialog v-model="computedShow" max-width="420">
    <v-card>
      <v-toolbar>
        <v-icon left>warning</v-icon>

        <h2>{{ heading }}</h2>
        <v-spacer />
        <v-btn outlined dark class="my-6" @click="close()">
          Close
          <v-icon right>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-3">
        {{ body }}
      </v-card-text>
      <v-card-actions>
        <v-btn class="red" @click="proceed()">
          Continue
        </v-btn>
        <v-btn outlined @click="cancel()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    showProp: Boolean,
    heading: String,
    body: String,
    validationText: String
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
        this.$emit("passBack", "false");
      }
    }
  },
  methods: {
    close() {
      this.$emit("passBack", "false");
    },
    cancel() {
      this.$emit("passBack", "false");
    },
    proceed() {
      this.$emit("passBack", "true");
    }
  }
};
</script>
