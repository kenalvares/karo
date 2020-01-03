<template>
  <v-col fluid v-if="toShow">
    <v-card outlined class="mx-auto emptyCard" max-width="344">
      <img src="../../assets/sad_face.png" class="emptyImg" />
      <v-card-text>
        <p class="display-1 text--primary my-1">
          Uh oh!
        </p>
        <div class="text--primary my-3 font-italic">
          Nothing to see here...
        </div>
        <div>
          {{ msg }}
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<style lang="scss" scoped>
.emptyImg {
  width: 70%;
}

.emptyCard {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fafafa;
}
</style>

<script>
export default {
  name: "EmptyCard",
  props: {
    toShow: Boolean,
    msg: String
  }
};
</script>
