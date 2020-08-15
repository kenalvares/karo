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
        <div class="mt-2 pa-0">
          <span>Enter</span>
          <span class="mx-2"
            >'<b>{{ sanitize(validationText) }}</b
            >'</span
          >
          <span>to delete</span>
          <v-text-field
            v-model="confirmText"
            class="ma-0 pa-0"
            :placeholder="sanitize(validationText)"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="red" @click="proceed()" :disabled="deleteAllowed">
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
  name: "ConfirmDeleteDialog",
  props: {
    showProp: Boolean,
    heading: String,
    body: String,
    validationText: String
  },
  data: () => ({
    step: 1,
    confirmText: ""
  }),
  computed: {
    computedShow: {
      get: function() {
        return this.showProp;
      },
      set: function() {
        this.$emit("passBack", "false");
      }
    },
    deleteAllowed() {
      const text = this.sanitize(this.validationText);
      if (this.confirmText === text) {
        return false;
      }
      return true;
    }
  },
  methods: {
    close() {
      this.$emit("passBack", "false");
    },
    sanitize(text) {
      text = text.toLowerCase();
      text = text.replace(/ /g, "-");
      return text;
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
