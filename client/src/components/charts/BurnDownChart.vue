<template
  ><v-card tile class="text-center green" dark>
    <v-sheet color="rgba(0, 0, 0, .2)" max-width="640" class="mx-auto">
      <v-sparkline
        :value="value"
        color="rgba(255, 255, 255, .7)"
        height="100"
        padding="15"
        stroke-linecap="round"
        smooth
      >
      </v-sparkline>
    </v-sheet>

    <v-card-text class="headline">Burndown Chart</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "BurnDownChart",
  props: {
    value: Array
  }
};
</script>
