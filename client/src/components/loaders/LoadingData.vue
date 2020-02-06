<template>
  <v-row v-if="loader.pendingData" class="fill-height flex-column-center">
    <v-col cols="12" align="center" class="flex-column-center">
      <v-progress-circular
        :size="100"
        :width="5"
        color="primary"
        indeterminate
        class="mb-5"
        v-if="!loader.failed"
      ></v-progress-circular
      ><v-progress-circular
        :size="100"
        :width="5"
        color="grey"
        class="mb-5"
        v-if="loader.failed"
      >
        <v-icon color="grey">close</v-icon></v-progress-circular
      >
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
  }
};
</script>
