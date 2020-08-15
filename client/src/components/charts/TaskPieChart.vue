<template>
  <v-card tile class="my-2 pt-3 text-center blue" dark>
    <v-progress-circular
      :rotate="(completed / 100) * 360"
      :size="160"
      :width="29"
      :value="100"
      color="blue darken-3"
      ><v-progress-circular
        :rotate="90"
        :size="150"
        :width="20"
        :value="completed"
        color="blue lighten-2"
      >
        <p class="percentage my-auto mx-auto">{{ Math.floor(completed) }}%</p>
      </v-progress-circular>
    </v-progress-circular>

    <v-card-text class="headline">
      Completed Tasks
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.percentage {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}
</style>

<script>
export default {
  name: "TaskPieChart",
  props: {
    tasks: Array
  },
  computed: {
    completed() {
      if (this.tasks.length < 1) {
        return 0;
      } else {
        let total = this.tasks.length,
          completed = 0;
        for (let i = 0; i < total; i++) {
          if (this.tasks[i].done) {
            completed++;
          }
        }
        return (completed / total) * 100;
      }
    },
    total() {
      if (this.tasks.length < 1) {
        return 0;
      } else {
        return this.tasks.length;
      }
    }
  }
};
</script>
