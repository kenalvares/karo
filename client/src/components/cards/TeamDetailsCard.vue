<!-- Team Details Card-->
<!-- Displays detailed team data in a card -->
<template>
  <v-card elevation="2">
    <v-row>
      <v-col cols="2">
        <v-flex class="pa-5">
          <v-avatar size="164">
            <v-img :src="logoSrc" />
          </v-avatar>
        </v-flex>
      </v-col>
      <v-col cols="10" class="flex-column">
        <v-card-title>{{ team.name }}</v-card-title>

        <v-card-subtitle>
          {{ team.description }}
        </v-card-subtitle>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn v-if="owned" text color="indigo accent-4">
        Edit
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn text @click="showMembers = !showMembers">
        Members
        <v-icon right>{{
          showMembers ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div>
        <v-list-item
          v-show="showMembers"
          v-for="member in members"
          :key="member.userid"
          class="border-list-item"
        >
          <span class="member-name">{{ member.name }}</span>
          <span class="member-email">{{ member.email }}</span>
          <v-spacer />

          <v-chip>{{ member.role }}</v-chip>
          <v-btn
            icon
            class="mx-2"
            @click="goToProfile('/profile/', member.userid)"
          >
            <v-icon>person</v-icon>
          </v-btn>
          <v-btn icon class="mx-2">
            <v-icon>message</v-icon>
          </v-btn>
        </v-list-item>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}

.member-name {
  font-size: 1rem;
  font-weight: 600;
}

.member-email {
  font-size: 0.8rem;
  text-transform: uppercase;
  border-radius: 0.2rem;
  letter-spacing: 0.1rem;
  padding: 0.1rem 0.3rem;
  margin: 0.1rem 0.5rem;
  background-color: #e6e6e6;
}

.border-list-item {
  border: 1px solid #ccc;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
}
</style>

<script>
import router from "@/router/index";
export default {
  name: "TeamDetailsCard",
  props: {
    logoSrc: String,
    team: Object,
    owned: Boolean,
    members: Array
  },
  data: () => ({
    showMembers: false
  }),
  methods: {
    // Push to member profile
    goToProfile(link, id) {
      router.push(link + id);
    }
  }
};
</script>
