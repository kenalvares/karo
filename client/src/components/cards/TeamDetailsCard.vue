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
