<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateTeamDialog />
        <v-btn-toggle
          v-model="teamFilter"
          tile
          color="success accent-3"
          group
          mandatory
        >
          <v-btn value="all">
            All
          </v-btn>
          <v-btn value="owned by me">
            Owned By Me
          </v-btn>
          <v-btn value="saved">
            Saved
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="team in teams" :key="team.id" cols="12" sm="4">
        <TeamCard :team="team" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TeamCard from "@/components/cards/TeamCard";
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
export default {
  name: "teams",
  data: () => ({
    teamFilter: 0,
    teams: [
      {
        id: "1",
        name: "MedHeads",
        description:
          "Team of medical professionals working on potential cures for cancer",
        avatar: "https://picsum.photos/300/300?random=6",
        owned: true
      },
      {
        id: "2",
        name: "Youth4You",
        description:
          "Law college students fighting for the rights of iguanas everywhere",
        avatar: "https://picsum.photos/300/300?random=7",
        owned: false
      },
      {
        id: "3",
        name: "20th Century Wolf",
        description:
          "Writing, directing and producing a high-budget, block-buster movie",
        avatar: "https://picsum.photos/300/300?random=8",
        owned: false
      },
      {
        id: "4",
        name: "Goa Police",
        description: "Planning raids on all the undergroud block makers in Goa",
        avatar: "https://picsum.photos/300/300?random=9",
        owned: true
      },
      {
        id: "5",
        name: "Group #5",
        description: "Developing an app to make project management easier",
        avatar: "https://picsum.photos/300/300?random=10",
        owned: true
      }
    ]
  }),
  components: {
    TeamCard,
    CreateTeamDialog
  }
};
</script>
