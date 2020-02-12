<template>
  <!-- If no more data is pending form server, add this row -->
  <v-row v-if="loader.pendingData" class="fill-height flex-column-center">
    <v-col cols="12" align="center" class="flex-column-center">
      <!-- Indeterminate spinner -->
      <v-progress-circular
        :size="100"
        :width="5"
        color="primary"
        indeterminate
        class="mb-5"
        v-if="!loader.failed"
      ></v-progress-circular>
      <!-- Failed spinner -->
      <v-progress-circular
        :size="100"
        :width="5"
        color="grey"
        class="mb-5"
        v-if="loader.failed"
      >
        <v-icon color="grey">close</v-icon></v-progress-circular
      >
      <!-- Msg while data is pending -->
      <span>{{ loader.pendingMsg }}</span>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.flex-column-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

<script>
export default {
  name: "LoadingData",
  props: {
    loader: Object
    /*
      pendingData: Boolean,
      pendingMsg: String,
      failed: Boolean
    */
  }
};
</script>
